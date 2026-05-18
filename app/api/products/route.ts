import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, brands(name, slug)")
    .order("created_at", { ascending: false })

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
