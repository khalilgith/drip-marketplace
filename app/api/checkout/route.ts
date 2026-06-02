import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
}

interface CartItem {
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
  product_id?: string
}

// Stripe metadata values have a 500-char limit per key.
// We encode just the fields we need (product_id, name, price, qty, size, color).
function encodeItemsMeta(items: CartItem[]): string {
  const slim = items.map((i) => ({
    n: i.name.slice(0, 40),
    p: i.price,
    q: i.quantity,
    s: i.size ?? "",
    c: i.color ?? "",
    id: i.product_id ?? "",
  }))
  const json = JSON.stringify(slim)
  // If the payload is over 490 chars, strip names down further
  if (json.length <= 490) return json
  const slimmer = items.map((i) => ({
    p: i.price,
    q: i.quantity,
    s: i.size ?? "",
    c: i.color ?? "",
    id: i.product_id ?? "",
  }))
  return JSON.stringify(slimmer)
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  try {
    const { items, successUrl, cancelUrl } = await req.json() as {
      items: CartItem[]
      successUrl?: string
      cancelUrl?: string
    }

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Try to get the current user id to attach as client_reference_id
    let userId: string | undefined
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    } catch {
      // Not fatal – guest checkout is allowed
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            size: item.size ?? "",
            color: item.color ?? "",
            product_id: item.product_id ?? "",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Build metadata – items serialised, split across keys if needed
    const itemsMeta = encodeItemsMeta(items)
    const meta: Record<string, string> = {
      source: "drip-store",
      items: itemsMeta,
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      client_reference_id: userId ?? undefined,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "FR", "DE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 999, currency: "usd" },
            display_name: "Express shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
      ],
      success_url: successUrl ?? `${req.nextUrl.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  cancelUrl  ?? `${req.nextUrl.origin}/cart`,
      metadata: meta,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    console.error("[Stripe checkout]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
