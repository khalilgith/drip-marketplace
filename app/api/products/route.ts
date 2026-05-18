import { NextResponse, type NextRequest } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = createServiceClient()
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const category = searchParams.get("category")
  const brand = searchParams.get("brand")
  const searchQ = searchParams.get("search")

  let query = supabase
    .from("products")
    .select("*, brands(name, slug)")
    .order("created_at", { ascending: false })

  if (featured === "true") {
    query = query.eq("featured", true)
  }
  if (category) {
    query = query.eq("category", category)
  }
  if (brand) {
    query = query.eq("brands.slug", brand)
  }
  if (searchQ) {
    query = query.ilike("name", `%${searchQ}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServiceClient()
  const body = await request.json()

  const { data, error } = await supabase.from("products").insert(body).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
