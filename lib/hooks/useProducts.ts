"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  brand_id: string
  name: string
  description: string | null
  price: number
  compare_price: number | null
  category: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  images: string[]
  stock: number
  featured: boolean
  created_at: string
  brands: { name: string; slug: string } | null
}

export function useProducts(filters?: {
  category?: string
  brand_id?: string
  search?: string
  featured?: boolean
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    let query = supabase
      .from("products")
      .select("*, brands(name, slug)")
      .order("created_at", { ascending: false })

    if (filters?.category) {
      query = query.eq("category", filters.category)
    }
    if (filters?.brand_id) {
      query = query.eq("brand_id", filters.brand_id)
    }
    if (filters?.featured) {
      query = query.eq("featured", true)
    }
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`)
    }

    query.then(({ data }) => {
      setProducts((data as Product[]) || [])
      setLoading(false)
    })
  }, [filters?.category, filters?.brand_id, filters?.search, filters?.featured])

  return { products, loading }
}
