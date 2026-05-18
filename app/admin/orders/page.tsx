"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { OrderTable } from "@/components/admin/OrderTable"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Orders</h1>
      <div className="bg-white border border-gray-200">
        <OrderTable orders={orders} />
      </div>
    </div>
  )
}
