"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

const statusVariant: Record<string, "warning" | "default" | "success" | "danger"> = {
  pending: "warning",
  processing: "default",
  shipped: "success",
  delivered: "success",
  cancelled: "danger",
}

interface Order {
  id: string
  customer_name: string
  total: number
  status: string
  created_at: string
}

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
            <TableCell>{order.customer_name}</TableCell>
            <TableCell>{formatPrice(order.total)}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[order.status] || "secondary"}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
