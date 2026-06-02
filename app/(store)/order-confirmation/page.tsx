"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Package, MapPin, ArrowRight, ShoppingBag } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string
  description: string
  quantity: number
  amount_total: number
  image: string | null
  size: string | null
  color: string | null
}

interface ShippingAddress {
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

interface SessionData {
  id: string
  payment_status: string
  amount_total: number | null
  amount_subtotal: number | null
  currency: string
  customer_details: { name: string | null; email: string | null }
  shipping: {
    name: string | null
    address: ShippingAddress
  } | null
  line_items: LineItem[]
}

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const, delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
}

const itemFade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(cents: number | null, currency = "usd") {
  if (cents == null) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

function shortId(id: string) {
  return id.slice(-8).toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckmarkRing() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-24 h-24 mx-auto mb-8"
    >
      {/* Volt glow ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.15, opacity: 0.18 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute inset-0 rounded-full bg-volt"
      />
      <div className="relative w-24 h-24 border border-volt/30 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-volt" strokeWidth={1.5} />
      </div>
    </motion.div>
  )
}

function ItemRow({ item, currency }: { item: LineItem; currency: string }) {
  return (
    <motion.div
      variants={itemFade}
      className="flex items-center gap-4 py-4 border-b border-cream/8 last:border-b-0"
    >
      <div className="relative w-14 h-14 shrink-0 bg-cream/5 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.description}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-ash/40" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-body text-[12px] font-semibold text-cream leading-snug truncate">
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {item.size && (
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-navy bg-ash/60 px-1.5 py-0.5">
              {item.size}
            </span>
          )}
          {item.color && (
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-navy bg-ash/60 px-1.5 py-0.5">
              {item.color}
            </span>
          )}
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ash">
            Qty {item.quantity}
          </span>
        </div>
      </div>

      <span className="font-mono text-[12px] text-cream/80 tabular-nums shrink-0">
        {formatMoney(item.amount_total, currency)}
      </span>
    </motion.div>
  )
}

// ─── Generic success (no session_id) ─────────────────────────────────────────

function GenericSuccess() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <CheckmarkRing />
      <motion.h1
        custom={0.1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-heading font-black text-[clamp(36px,7vw,72px)] uppercase leading-none tracking-[0.06em] text-cream mb-4"
      >
        Order Confirmed
      </motion.h1>
      <motion.p
        custom={0.2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-body text-ash text-[13px] tracking-wide mb-10 max-w-xs"
      >
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </motion.p>
      <motion.div custom={0.3} variants={fadeUp} initial="hidden" animate="visible">
        <Link href="/shop" className="btn-drip">
          <span>Continue Shopping</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-cream/8 ${className}`} />
  )
}

function ConfirmationSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 space-y-10">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="border border-cream/10 p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-14 h-14" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Full confirmation ────────────────────────────────────────────────────────

function FullConfirmation({ data }: { data: SessionData }) {
  const shipping = data.amount_total != null && data.amount_subtotal != null
    ? data.amount_total - data.amount_subtotal
    : 0

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-20">

      {/* Header */}
      <div className="text-center mb-12">
        <CheckmarkRing />

        <motion.p
          custom={0.05}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-mono text-[9px] tracking-[0.3em] uppercase text-volt mb-3"
        >
          Payment Successful
        </motion.p>

        <motion.h1
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-heading font-black text-[clamp(36px,8vw,80px)] uppercase leading-none tracking-[0.04em] text-cream mb-3"
        >
          Order Confirmed
        </motion.h1>

        <motion.p
          custom={0.18}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-body text-ash text-[13px] tracking-wide"
        >
          A confirmation email is on its way to{" "}
          <span className="text-cream/70">{data.customer_details.email}</span>
        </motion.p>

        {/* Order number */}
        <motion.div
          custom={0.25}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-3 mt-6 border border-cream/10 px-5 py-2.5"
        >
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ash">
            Order
          </span>
          <span className="font-mono text-[13px] text-cream tabular-nums tracking-widest">
            #{shortId(data.id)}
          </span>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="h-px bg-cream/10 mb-10 origin-left"
      />

      {/* Items card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="border border-cream/10 bg-cream/[0.02] p-6 sm:p-8 mb-6"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <Package className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
          <h2 className="font-heading font-bold text-[14px] uppercase tracking-[0.14em] text-cream">
            Items Ordered
          </h2>
        </div>

        {data.line_items.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {data.line_items.map((item) => (
              <ItemRow key={item.id} item={item} currency={data.currency} />
            ))}
          </motion.div>
        ) : (
          <p className="font-mono text-[11px] text-ash tracking-wide">No item details available.</p>
        )}

        {/* Totals */}
        <div className="mt-6 pt-6 border-t border-cream/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ash">
              Subtotal
            </span>
            <span className="font-mono text-[12px] text-cream/80 tabular-nums">
              {formatMoney(data.amount_subtotal, data.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ash">
              Shipping
            </span>
            {shipping === 0 ? (
              <span className="font-mono text-[12px] text-volt tabular-nums tracking-wider">Free</span>
            ) : (
              <span className="font-mono text-[12px] text-cream/80 tabular-nums">
                {formatMoney(shipping, data.currency)}
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between pt-3 border-t border-cream/8">
            <span className="font-heading font-black text-[13px] uppercase tracking-[0.12em] text-cream">
              Total
            </span>
            <span className="font-mono text-[18px] text-cream tabular-nums">
              {formatMoney(data.amount_total, data.currency)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Shipping address */}
      <AnimatePresence>
        {data.shipping && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="border border-cream/10 bg-cream/[0.02] p-6 sm:p-8 mb-10"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <MapPin className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
              <h2 className="font-heading font-bold text-[14px] uppercase tracking-[0.14em] text-cream">
                Shipping To
              </h2>
            </div>
            {data.shipping.name && (
              <p className="font-body text-[13px] text-cream/90 mb-1">{data.shipping.name}</p>
            )}
            <address className="not-italic font-mono text-[11px] text-ash leading-relaxed tracking-wide">
              {data.shipping.address.line1}
              {data.shipping.address.line2 && <>, {data.shipping.address.line2}</>}
              <br />
              {data.shipping.address.city}, {data.shipping.address.state}{" "}
              {data.shipping.address.postal_code}
              <br />
              {data.shipping.address.country}
            </address>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link href="/shop" className="btn-drip w-full sm:w-auto justify-center">
          <span>Continue Shopping</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link href="/account/orders" className="btn-ghost w-full sm:w-auto justify-center">
          <span>View My Orders</span>
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

import { Suspense } from "react"

function OrderConfirmationInner() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: SessionData }
    | { status: "error"; message: string }
  >({ status: "idle" })

  useEffect(() => {
    if (!sessionId) return

    setState({ status: "loading" })

    fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error ?? "Failed to load session")
        return body as SessionData
      })
      .then((data) => setState({ status: "success", data }))
      .catch((err: Error) => setState({ status: "error", message: err.message }))
  }, [sessionId])

  // No session_id in URL → show generic success
  if (!sessionId) return <GenericSuccess />

  if (state.status === "idle" || state.status === "loading") {
    return <ConfirmationSkeleton />
  }

  // On error fall back to generic success (payment still completed)
  if (state.status === "error") return <GenericSuccess />

  return <FullConfirmation data={state.data} />
}


export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <OrderConfirmationInner />
    </Suspense>
  )
}
