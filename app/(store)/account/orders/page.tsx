"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  ChevronDown,
  Package,
  ShoppingBag,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image?: string
}

interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
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
  shipping_address: ShippingAddress | null
  created_at: string
  updated_at: string
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending:    { label: "Pending",    bg: "bg-ash/20",           text: "text-ash",          dot: "bg-ash" },
  processing: { label: "Processing", bg: "bg-gold/15",          text: "text-gold",         dot: "bg-gold" },
  shipped:    { label: "Shipped",    bg: "bg-blue-500/15",      text: "text-blue-400",     dot: "bg-blue-400" },
  delivered:  { label: "Delivered",  bg: "bg-volt/15",          text: "text-volt",         dot: "bg-volt" },
  cancelled:  { label: "Cancelled",  bg: "bg-red-500/15",       text: "text-red-400",      dot: "bg-red-500" },
}

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as OrderStatus] ?? STATUS_CONFIG.pending
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function shortId(id: string) {
  return id.slice(-8).toUpperCase()
}

// ─── Animation variants ───────────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function OrderItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-cream/6 last:border-b-0">
      <div className="relative w-12 h-12 shrink-0 bg-cream/5 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-3.5 h-3.5 text-ash/40" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[11px] font-semibold text-cream/90 truncate">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {item.size && (
            <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-navy bg-ash/50 px-1.5 py-0.5">
              {item.size}
            </span>
          )}
          {item.color && (
            <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-navy bg-ash/50 px-1.5 py-0.5">
              {item.color}
            </span>
          )}
          <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-ash">
            x{item.quantity}
          </span>
        </div>
      </div>
      <span className="font-mono text-[11px] text-cream/70 tabular-nums shrink-0">
        {formatMoney(item.price * item.quantity)}
      </span>
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <motion.div
      variants={rowVariants}
      className="border border-cream/10 bg-cream/[0.02] overflow-hidden"
    >
      {/* Header row – always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-cream/[0.03] transition-colors duration-200 group"
        aria-expanded={open}
      >
        {/* Order number */}
        <div className="hidden sm:block shrink-0">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ash mb-0.5">Order</p>
          <p className="font-mono text-[13px] text-cream tabular-nums tracking-widest">
            #{shortId(order.id)}
          </p>
        </div>

        {/* Status */}
        <div className="hidden sm:block shrink-0">
          <StatusBadge status={order.status} />
        </div>

        {/* Date */}
        <div className="shrink-0 hidden md:block">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ash mb-0.5">Date</p>
          <p className="font-mono text-[11px] text-cream/70">{formatDate(order.created_at)}</p>
        </div>

        {/* Mobile: number + status stacked */}
        <div className="sm:hidden flex-1 min-w-0">
          <p className="font-mono text-[12px] text-cream tabular-nums tracking-widest mb-1">
            #{shortId(order.id)}
          </p>
          <StatusBadge status={order.status} />
        </div>

        {/* Item count */}
        <div className="shrink-0 hidden lg:block">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ash mb-0.5">Items</p>
          <p className="font-mono text-[11px] text-cream/70">
            {itemCount} {itemCount === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {/* Total */}
        <div className="ml-auto shrink-0 text-right">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ash mb-0.5">Total</p>
          <p className="font-mono text-[14px] text-cream tabular-nums">{formatMoney(order.total)}</p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-ash group-hover:text-cream transition-colors" />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            variants={expandVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-cream/8">
              {/* Items */}
              <div className="mt-5">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ash mb-3">
                  Items
                </p>
                {order.items.map((item, idx) => (
                  <OrderItemRow key={`${item.product_id}-${idx}`} item={item} />
                ))}
              </div>

              {/* Totals + address */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Totals */}
                <div className="space-y-2">
                  <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ash mb-3">
                    Summary
                  </p>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ash">Subtotal</span>
                    <span className="font-mono text-[11px] text-cream/70 tabular-nums">{formatMoney(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ash">Shipping</span>
                    {order.shipping === 0 ? (
                      <span className="font-mono text-[11px] text-volt">Free</span>
                    ) : (
                      <span className="font-mono text-[11px] text-cream/70 tabular-nums">{formatMoney(order.shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-cream/8">
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-cream font-semibold">Total</span>
                    <span className="font-mono text-[13px] text-cream tabular-nums">{formatMoney(order.total)}</span>
                  </div>
                </div>

                {/* Shipping address */}
                {order.shipping_address && (
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ash mb-3">
                      Shipped To
                    </p>
                    <address className="not-italic font-mono text-[10px] text-ash/80 leading-relaxed tracking-wide">
                      {order.shipping_address.line1}
                      {order.shipping_address.line2 && <>, {order.shipping_address.line2}</>}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.zip}
                      <br />
                      {order.shipping_address.country}
                    </address>
                  </div>
                )}
              </div>

              {/* Placed on mobile */}
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-ash/40 mt-5 sm:hidden">
                Placed {formatDate(order.created_at)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-cream/8 ${className}`} />
}

function OrdersSkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-cream/10 p-5">
          <div className="flex items-center gap-6">
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
            <div className="ml-auto space-y-1.5">
              <Skeleton className="h-2.5 w-10 ml-auto" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error: queryError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (queryError) {
        setError(queryError.message)
      } else {
        setOrders((data as Order[]) ?? [])
      }
      setLoading(false)
    })
  }, [router])

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-ash hover:text-gold transition-colors duration-300 mb-5"
        >
          <ArrowLeft className="w-3 h-3" />
          My Account
        </Link>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gold/70" strokeWidth={1.5} />
            <h1 className="font-heading font-black text-[clamp(28px,5vw,52px)] uppercase leading-none tracking-[0.05em] text-cream">
              Orders
            </h1>
          </div>
          {!loading && orders.length > 0 && (
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ash pb-1 hidden sm:block">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="h-px bg-cream/10 mt-5 origin-left"
        />
      </motion.div>

      {/* Content */}
      {loading ? (
        <OrdersSkeletonList />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-red-500/20 bg-red-500/5 p-6 text-center"
        >
          <p className="font-mono text-[11px] tracking-wide text-red-400">{error}</p>
        </motion.div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 border border-cream/10 flex items-center justify-center mb-6">
            <Package className="w-6 h-6 text-ash/50" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading font-black text-[28px] uppercase tracking-[0.08em] text-cream mb-2">
            No Orders Yet
          </h2>
          <p className="font-body text-ash text-[13px] tracking-wide mb-8 max-w-xs">
            You haven&apos;t placed any orders. Start shopping and your orders will appear here.
          </p>
          <Link href="/shop" className="btn-drip">
            <span>Explore the Collection</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
