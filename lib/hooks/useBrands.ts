"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  approved: boolean
  featured: boolean
}

async function fetchBrands(featuredOnly: boolean): Promise<Brand[]> {
  const supabase = createClient()
  let query = supabase.from("brands").select("*").eq("approved", true).order("name")
  if (featuredOnly) query = query.eq("featured", true)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as Brand[]) ?? []
}

export function useBrands(featuredOnly = false) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands", { featuredOnly }],
    queryFn: () => fetchBrands(featuredOnly),
    staleTime: 60_000,
  })
  return { brands: data ?? [], loading: isLoading, error }
}
