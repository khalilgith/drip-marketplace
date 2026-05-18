"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  user_id: string
  customer_name: string
  customer_email: string
  items: any
  subtotal: number
  shipping: number
  total: number
  status: string
  shipping_address: any
  created_at: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setLoading(false)
      })
  }, [])

  return { orders, loading }
}
