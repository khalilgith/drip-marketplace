"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export interface Product {
  id: string
  brand_id: string | null
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

interface ProductFilters {
  category?: string
  brand_id?: string
  search?: string
  featured?: boolean
}

async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = createClient()
  let query = supabase
    .from("products")
    .select("*, brands(name, slug)")
    .order("created_at", { ascending: false })

  if (filters?.category) query = query.eq("category", filters.category)
  if (filters?.brand_id)  query = query.eq("brand_id",  filters.brand_id)
  if (filters?.featured)  query = query.eq("featured",  true)
  if (filters?.search)    query = query.ilike("name", `%${filters.search}%`)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as Product[]) ?? []
}

export function useProducts(filters?: ProductFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 30_000,
  })
  return { products: data ?? [], loading: isLoading, error }
}

export function useFeaturedProducts() {
  return useProducts({ featured: true })
}
