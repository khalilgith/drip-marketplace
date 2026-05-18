"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { StatCard } from "@/components/admin/StatCard"
import { Package, Building2, ShoppingCart, Star } from "lucide-react"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, brands: 0, orders: 0, reviews: 0 })

  useEffect(() => {
    const supabase = createClient()
    const fetchCounts = async () => {
      const [
        { count: productCount },
        { count: brandCount },
        { count: orderCount },
        { count: reviewCount },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
      ])
      setCounts({
        products: productCount || 0,
        brands: brandCount || 0,
        orders: orderCount || 0,
        reviews: reviewCount || 0,
      })
    }
    fetchCounts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Products" value={counts.products} icon={Package} description="Total products in store" />
        <StatCard title="Brands" value={counts.brands} icon={Building2} description="Registered brands" />
        <StatCard title="Orders" value={counts.orders} icon={ShoppingCart} description="Total orders received" />
        <StatCard title="Reviews" value={counts.reviews} icon={Star} description="Customer reviews" />
      </div>
    </div>
  )
}
