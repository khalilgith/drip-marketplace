import { NextResponse, type NextRequest } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { mockProducts } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const category = searchParams.get("category")
  const brandSlug = searchParams.get("brand")
  const searchQ = searchParams.get("search")

  try {
    const supabase = createServiceClient()

    // Resolve brand slug to brand_id first
    let brandId: string | null = null
    if (brandSlug) {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", brandSlug)
        .single()
      if (brand) brandId = brand.id
    }

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
    if (brandId) {
      query = query.eq("brand_id", brandId)
    }
    if (searchQ) {
      query = query.ilike("name", `%${searchQ}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    })
  } catch {
    // Fallback to mock data
    let results = [...mockProducts]

    if (featured === "true") {
      results = results.filter((p) => p.featured)
    }
    if (category) {
      results = results.filter((p) => p.category === category)
    }
    if (brandSlug) {
      results = results.filter((p) => p.brands?.slug === brandSlug)
    }
    if (searchQ) {
      const q = searchQ.toLowerCase()
      results = results.filter((p) => p.name.toLowerCase().includes(q))
    }

    return NextResponse.json(results, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    })
  }
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
