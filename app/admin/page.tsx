import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/admin/StatCard"
import { Package, Building2, ShoppingCart, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = createClient()

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: brandCount } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true })

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Products"
          value={productCount || 0}
          icon={Package}
          description="Total products in store"
        />
        <StatCard
          title="Brands"
          value={brandCount || 0}
          icon={Building2}
          description="Registered brands"
        />
        <StatCard
          title="Orders"
          value={orderCount || 0}
          icon={ShoppingCart}
          description="Total orders received"
        />
        <StatCard
          title="Reviews"
          value={reviewCount || 0}
          icon={Star}
          description="Customer reviews"
        />
      </div>
    </div>
  )
}
