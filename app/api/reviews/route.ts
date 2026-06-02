import { NextResponse, type NextRequest } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

/* ─── GET /api/reviews?product_id=xxx ──────────────────────────────────────── */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("product_id")

  if (!productId) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  })
}

/* ─── POST /api/reviews ─────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  // Get authenticated user from cookies
  const supabase = createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let body: { product_id?: unknown; rating?: unknown; comment?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { product_id, rating, comment } = body

  // Validate product_id
  if (!product_id || typeof product_id !== "string") {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 })
  }

  // Validate rating
  const ratingNum = Number(rating)
  if (!rating || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: "rating must be an integer between 1 and 5" },
      { status: 400 }
    )
  }

  // Validate comment (optional but must be string if provided)
  if (comment !== undefined && comment !== null && typeof comment !== "string") {
    return NextResponse.json({ error: "comment must be a string" }, { status: 400 })
  }

  // Use service client for DB operations
  const serviceClient = createServiceClient()

  // Check for duplicate review
  const { data: existing } = await serviceClient
    .from("reviews")
    .select("id")
    .eq("product_id", product_id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this product" },
      { status: 409 }
    )
  }

  // Insert review
  const { data, error: insertError } = await serviceClient
    .from("reviews")
    .insert({
      product_id,
      user_id: user.id,
      rating: ratingNum,
      comment: comment ?? null,
    })
    .select("*, profiles(full_name, avatar_url)")
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
