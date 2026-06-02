import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"
import { createServiceClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
}

// Shape stored in session metadata.items
interface SlimItem {
  n?: string   // name (may be absent in very long carts)
  p: number    // price
  q: number    // quantity
  s: string    // size
  c: string    // color
  id?: string  // product_id
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature"
    console.error("[webhook] Signature verification failed:", msg)
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge events we don't handle
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    // Re-fetch with line_items expanded so we have full product data
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    const lineItems = fullSession.line_items?.data ?? []
    const customerDetails = fullSession.customer_details
    const shippingDetails = (fullSession as any).shipping_details ?? (fullSession as any).shipping

    if (!customerDetails?.email) {
      console.error("[webhook] Session missing customer email:", session.id)
      return NextResponse.json({ error: "No customer email" }, { status: 400 })
    }

    // ── Reconstruct order items ────────────────────────────────────────────────
    // Primary strategy: use metadata.items (serialised by /api/checkout)
    // Fallback: derive from expanded line_items
    let orderItems: Array<{
      product_id: string
      name: string
      price: number
      quantity: number
      size: string
      color: string
      image: string
    }>

    const rawMeta = fullSession.metadata?.items
    if (rawMeta) {
      try {
        const slim: SlimItem[] = JSON.parse(rawMeta)
        // Match slim items to line_items for images and confirmed product names
        orderItems = slim.map((s, idx) => {
          const li = lineItems[idx]
          const product = li?.price?.product as Stripe.Product | undefined
          const image = product?.images?.[0] ?? ""
          const name = s.n ?? product?.name ?? li?.description ?? `Item ${idx + 1}`
          const productId = s.id || (product?.metadata?.product_id ?? "")
          return {
            product_id: productId,
            name,
            price: s.p,
            quantity: s.q,
            size: s.s,
            color: s.c,
            image,
          }
        })
      } catch {
        // Fall back to line_items if metadata parse fails
        orderItems = lineItems.map((li) => {
          const product = li.price?.product as Stripe.Product | undefined
          return {
            product_id: product?.metadata?.product_id ?? "",
            name: product?.name ?? li.description ?? "Unknown item",
            price: (li.price?.unit_amount ?? 0) / 100,
            quantity: li.quantity ?? 1,
            size: product?.metadata?.size ?? "",
            color: product?.metadata?.color ?? "",
            image: product?.images?.[0] ?? "",
          }
        })
      }
    } else {
      // No metadata — fall back fully to expanded line_items
      orderItems = lineItems.map((li) => {
        const product = li.price?.product as Stripe.Product | undefined
        return {
          product_id: product?.metadata?.product_id ?? "",
          name: product?.name ?? li.description ?? "Unknown item",
          price: (li.price?.unit_amount ?? 0) / 100,
          quantity: li.quantity ?? 1,
          size: product?.metadata?.size ?? "",
          color: product?.metadata?.color ?? "",
          image: product?.images?.[0] ?? "",
        }
      })
    }

    // ── Financials ─────────────────────────────────────────────────────────────
    const amountTotal   = (fullSession.amount_total   ?? 0) / 100
    const amountSubtotal = (fullSession.amount_subtotal ?? 0) / 100
    const shippingCost  = amountTotal - amountSubtotal

    // ── Shipping address ───────────────────────────────────────────────────────
    // Stripe v2: shipping_details; v1 sessions: shipping
    const addr =
      ((fullSession as any).shipping_details as any)?.address ??
      (fullSession as any).shipping?.address ??
      null

    const shippingAddress = addr
      ? {
          line1:   addr.line1   ?? "",
          line2:   addr.line2   ?? undefined,
          city:    addr.city    ?? "",
          state:   addr.state   ?? "",
          zip:     addr.postal_code ?? "",
          country: addr.country  ?? "",
        }
      : null

    // ── Customer name ──────────────────────────────────────────────────────────
    const customerName =
      customerDetails.name ??
      ((fullSession as any).shipping_details as any)?.name ??
      (fullSession as any).shipping?.name ??
      customerDetails.email

    // ── Write to Supabase ──────────────────────────────────────────────────────
    const supabase = createServiceClient()

    // Idempotency: check if order with this Stripe session already exists
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle()

    if (existing) {
      console.log("[webhook] Order already exists for session:", session.id)
      return NextResponse.json({ received: true })
    }

    const { error: insertError } = await supabase.from("orders").insert({
      user_id:          fullSession.client_reference_id ?? null,
      customer_name:    customerName,
      customer_email:   customerDetails.email,
      items:            orderItems,
      subtotal:         amountSubtotal,
      shipping:         shippingCost,
      total:            amountTotal,
      status:           "processing",
      shipping_address: shippingAddress,
      stripe_session_id: session.id,
    })

    if (insertError) {
      // stripe_session_id column might not exist yet — retry without it
      if (insertError.message?.includes("stripe_session_id")) {
        const { error: fallbackError } = await supabase.from("orders").insert({
          user_id:          fullSession.client_reference_id ?? null,
          customer_name:    customerName,
          customer_email:   customerDetails.email,
          items:            orderItems,
          subtotal:         amountSubtotal,
          shipping:         shippingCost,
          total:            amountTotal,
          status:           "processing",
          shipping_address: shippingAddress,
        })
        if (fallbackError) {
          console.error("[webhook] Failed to insert order:", fallbackError.message)
          return NextResponse.json({ error: fallbackError.message }, { status: 500 })
        }
      } else {
        console.error("[webhook] Failed to insert order:", insertError.message)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    console.log("[webhook] Order created for session:", session.id)
    return NextResponse.json({ received: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("[webhook] Handler error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
