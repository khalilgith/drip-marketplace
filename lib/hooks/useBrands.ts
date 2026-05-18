"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  approved: boolean
  featured: boolean
}

export function useBrands(featuredOnly = false) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    let query = supabase
      .from("brands")
      .select("*")
      .eq("approved", true)
      .order("name")

    if (featuredOnly) {
      query = query.eq("featured", true)
    }

    query.then(({ data }) => {
      setBrands((data as Brand[]) || [])
      setLoading(false)
    })
  }, [featuredOnly])

  return { brands, loading }
}
