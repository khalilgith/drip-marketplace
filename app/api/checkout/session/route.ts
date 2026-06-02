import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"
import { z } from "zod"

export const dynamic = "force-dynamic"

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
}

const querySchema = z.object({
  id: z.string().min(1, "Session ID is required"),
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const parse = querySchema.safeParse({ id: searchParams.get("id") })

  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0].message },
      { status: 400 }
    )
  }

  const { id } = parse.data

  // Basic sanity check – Stripe session IDs start with "cs_"
  if (!id.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    const lineItems = session.line_items?.data.map((li) => {
      const product = li.price?.product as Stripe.Product | undefined
      return {
        id:          li.id,
        description: product?.name ?? li.description ?? "",
        quantity:    li.quantity ?? 1,
        amount_total: li.amount_total,
        image:       product?.images?.[0] ?? null,
        size:        product?.metadata?.size ?? null,
        color:       product?.metadata?.color ?? null,
      }
    }) ?? []

    // Derive shipping address from shipping_details (Stripe v2) or shipping (legacy)
    const shippingAddr =
      ((session as any).shipping_details as any)?.address ??
      (session as any).shipping?.address ??
      null

    const shippingName =
      ((session as any).shipping_details as any)?.name ??
      (session as any).shipping?.name ??
      session.customer_details?.name ??
      null

    return NextResponse.json({
      id:               session.id,
      payment_status:   session.payment_status,
      amount_total:     session.amount_total,
      amount_subtotal:  session.amount_subtotal,
      currency:         session.currency,
      customer_details: {
        name:  session.customer_details?.name ?? null,
        email: session.customer_details?.email ?? null,
      },
      shipping: shippingAddr
        ? {
            name:    shippingName,
            address: {
              line1:       shippingAddr.line1   ?? "",
              line2:       shippingAddr.line2   ?? null,
              city:        shippingAddr.city    ?? "",
              state:       shippingAddr.state   ?? "",
              postal_code: shippingAddr.postal_code ?? "",
              country:     shippingAddr.country  ?? "",
            },
          }
        : null,
      line_items: lineItems,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve session"
    console.error("[checkout/session GET]", message)
    // Return 404 for "no such session" errors so the UI can show generic success
    const status = message.includes("No such") ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
