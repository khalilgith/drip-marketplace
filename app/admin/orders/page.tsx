"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ChevronDown, ChevronRight, ShoppingCart, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

// ── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface OrderItem {
  name: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  shipping_address: {
    line1?: string
    city?: string
    country?: string
  } | null
  created_at: string
  updated_at?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered"] as const

// ── Badge helpers ─────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "secondary" | "success" | "warning" | "danger" | "outline"

const statusBadgeVariant: Record<OrderStatus, BadgeVariant> = {
  pending: "secondary",
  processing: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
}

// Custom classes layered on top of the variant for the design system colours
const statusBadgeExtra: Record<OrderStatus, string> = {
  pending: "bg-[#2a2a36] text-gray-300",
  processing: "bg-yellow-500/20 text-yellow-300",
  shipped: "bg-blue-500/20 text-blue-300",
  delivered: "bg-[#D4FF00]/20 text-[#D4FF00]",
  cancelled: "bg-red-500/20 text-red-400",
}

// ── Stat card (inline, dark-themed) ──────────────────────────────────────────

function DarkStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0f0f18] p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10">
        <Icon className="h-5 w-5 text-[#C9A84C]" />
      </div>
      <div>
        <p className="text-xs font-body text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="font-heading text-2xl font-bold text-[#EDE9DF]">{value}</p>
      </div>
    </div>
  )
}

// ── Status dropdown ──────────────────────────────────────────────────────────

function StatusSelect({
  orderId,
  current,
  onUpdate,
}: {
  orderId: string
  current: OrderStatus
  onUpdate: (id: string, status: OrderStatus) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus
    if (next === current) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        toast.error(err.error ?? "Failed to update status")
      } else {
        onUpdate(orderId, next)
        toast.success(`Order moved to ${next}`)
      }
    } catch {
      toast.error("Network error — try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      onClick={(e) => e.stopPropagation()}
      className="rounded border border-white/10 bg-[#1a1a24] px-2 py-1 font-mono text-xs text-[#EDE9DF] focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] disabled:opacity-50"
    >
      {VALID_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-[#1a1a24]">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  )
}

// ── Expanded row: items list ──────────────────────────────────────────────────

function OrderItemsRow({ items }: { items: OrderItem[] }) {
  if (!items || items.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="border-t-0 bg-[#0d0d16] px-8 py-4 text-gray-500 text-xs">
          No item data available.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell
        colSpan={7}
        className="border-t-0 bg-[#0d0d16] px-8 py-4"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          Items
        </p>
        <div className="divide-y divide-white/5 rounded border border-white/5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2 text-xs"
            >
              <span className="font-body text-[#EDE9DF]">
                {item.name}
                {item.size && (
                  <span className="ml-2 text-gray-400">/ {item.size}</span>
                )}
                {item.color && (
                  <span className="ml-2 text-gray-400">/ {item.color}</span>
                )}
              </span>
              <span className="ml-8 text-gray-400">×{item.quantity}</span>
              <span className="ml-auto font-mono text-[#C9A84C]">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </TableCell>
    </TableRow>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        setOrders((data as Order[]) || [])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Optimistic status update
  const handleStatusUpdate = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
  }

  // Stats
  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

  // Filter
  const filtered = useMemo(() => {
    if (activeTab === "All") return orders
    return orders.filter(
      (o) => o.status === activeTab.toLowerCase()
    )
  }, [orders, activeTab])

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="min-h-screen bg-[#08080C] text-[#EDE9DF]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide text-[#EDE9DF]">
          Orders
        </h1>
        <p className="mt-1 font-body text-sm text-gray-400">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DarkStatCard icon={ShoppingCart} label="Total Orders" value={totalOrders} />
        <DarkStatCard icon={Clock} label="Pending" value={pendingCount} />
        <DarkStatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
        />
      </div>

      {/* Tab filter */}
      <div className="mb-6 flex gap-1 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "shrink-0 rounded px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
              activeTab === tab
                ? "bg-[#C9A84C] text-[#08080C]"
                : "text-gray-400 hover:bg-white/5 hover:text-[#EDE9DF]",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0f0f18]">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
            No orders found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="w-8 text-gray-500" />
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Order ID
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Customer
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Date
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Items
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Total
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const isExpanded = expandedId === order.id
                const itemCount = Array.isArray(order.items)
                  ? order.items.reduce(
                      (sum: number, item: OrderItem) => sum + (item.quantity ?? 1),
                      0
                    )
                  : "—"

                return (
                  <>
                    <TableRow
                      key={order.id}
                      data-state={isExpanded ? "selected" : undefined}
                      onClick={() => toggleExpand(order.id)}
                      className="cursor-pointer border-b border-white/5 hover:bg-white/5 data-[state=selected]:bg-white/5"
                    >
                      {/* Expand chevron */}
                      <TableCell className="w-8 pl-4 text-gray-500">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>

                      {/* Order ID */}
                      <TableCell>
                        <span className="font-mono text-xs text-[#EDE9DF]">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <p className="font-body text-sm text-[#EDE9DF]">
                          {order.customer_name || "—"}
                        </p>
                        {order.customer_email && (
                          <p className="font-mono text-[11px] text-gray-500">
                            {order.customer_email}
                          </p>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="font-mono text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Items count */}
                      <TableCell className="font-mono text-xs text-gray-300">
                        {itemCount}
                      </TableCell>

                      {/* Total */}
                      <TableCell className="font-mono text-sm font-medium text-[#C9A84C]">
                        {formatPrice(order.total)}
                      </TableCell>

                      {/* Status */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={[
                              "border-0 font-mono text-[10px] uppercase tracking-widest",
                              statusBadgeExtra[order.status] ?? "bg-white/10 text-gray-300",
                            ].join(" ")}
                          >
                            {order.status}
                          </Badge>
                          <StatusSelect
                            orderId={order.id}
                            current={order.status}
                            onUpdate={handleStatusUpdate}
                          />
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded items row */}
                    {isExpanded && (
                      <OrderItemsRow
                        key={`${order.id}-items`}
                        items={order.items}
                      />
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
