"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Lock,
  RotateCcw,
  ShoppingBag,
  Loader2,
} from "lucide-react"
import { useCartStore } from "@/lib/store/cartStore"
import { formatPrice } from "@/lib/utils"

/* ─────────────────────────── animation variants ─────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    x: -80,
    scale: 0.96,
    transition: { duration: 0.36, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

const summaryVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 },
  },
}

/* ─────────────────────────────── component ──────────────────────────────── */

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQty, total } = useCartStore()
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const subtotal = total()
  const shipping = subtotal >= 200 ? 0 : 14.99
  const orderTotal = subtotal + shipping

  const handleCheckout = useCallback(async () => {
    if (!items.length) return
    setLoadingCheckout(true)
    setCheckoutError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            size: i.size,
            color: i.color,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed")
      router.push(data.url)
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong")
      setLoadingCheckout(false)
    }
  }, [items, router])

  /* ── empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Giant monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative mb-8 select-none"
        >
          <span
            className="font-heading font-black text-[clamp(120px,22vw,220px)] leading-none tracking-[0.05em] uppercase"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DRIP
          </span>
          {/* Centered bag icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border border-cream/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-ash" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="font-heading font-black text-[clamp(28px,5vw,48px)] uppercase tracking-[0.12em] text-cream mb-3">
            Your bag is empty
          </h1>
          <p className="font-body text-ash text-[13px] tracking-wide mb-10 max-w-xs mx-auto">
            Nothing here yet. Explore the collection and find pieces that speak to you.
          </p>
          <Link href="/shop" className="btn-drip">
            <span>Explore the collection</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mb-12"
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-ash hover:text-gold transition-colors duration-300 mb-5"
        >
          <ArrowLeft className="w-3 h-3" />
          Continue Shopping
        </Link>
        <div className="flex items-end justify-between">
          <h1 className="font-heading font-black text-[clamp(38px,7vw,72px)] uppercase leading-none tracking-[0.04em] text-cream">
            Your Bag
          </h1>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ash pb-2 hidden sm:block">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
          className="h-px bg-cream/10 mt-6 origin-left"
        />
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">

        {/* ── Left: item list (2/3) ── */}
        <div className="lg:col-span-2">
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-0"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="group border-b border-cream/8 last:border-b-0"
                >
                  <div className="flex gap-5 sm:gap-7 py-7">

                    {/* Product image */}
                    <Link
                      href={`/product/${item.product_id}`}
                      className="shrink-0 relative w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] overflow-hidden bg-cream/5 block"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-ash/40" strokeWidth={1.5} />
                        </div>
                      )}
                    </Link>

                    {/* Item details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link href={`/product/${item.product_id}`} className="block">
                            <h3 className="font-body text-[13px] font-semibold text-cream hover:text-gold transition-colors leading-snug line-clamp-2 pr-2">
                              {item.name}
                            </h3>
                          </Link>
                          {/* Size / Color badges */}
                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-navy bg-ash/60 px-2 py-0.5">
                              {item.size}
                            </span>
                            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-navy bg-ash/60 px-2 py-0.5">
                              {item.color}
                            </span>
                          </div>
                        </div>
                        {/* Unit price */}
                        <span className="font-mono text-[13px] text-cream/90 shrink-0 tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Controls row */}
                      <div className="flex items-center justify-between mt-5">
                        {/* Qty stepper */}
                        <div className="flex items-center border border-cream/12 h-8">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-ash hover:text-cream hover:bg-cream/5 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center font-mono text-[11px] text-cream/80 tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-ash hover:text-cream hover:bg-cream/5 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-5">
                          {/* Line total */}
                          <span className="font-mono text-[12px] text-gold tabular-nums hidden sm:block">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-ash/60 hover:text-cream transition-colors duration-300 group/rm"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-3 h-3 group-hover/rm:text-cream transition-colors" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        {/* ── Right: Order summary (1/3) ── */}
        <motion.div
          variants={summaryVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
          <div className="sticky top-28">
            {/* Summary panel */}
            <div className="border border-cream/10 bg-cream/[0.03] p-8">
              <h2 className="font-heading font-black text-[20px] uppercase tracking-[0.1em] text-cream mb-7">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-4 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono tracking-[0.15em] uppercase text-ash">
                    Subtotal
                  </span>
                  <span className="font-mono text-cream/80 tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono tracking-[0.15em] uppercase text-ash">
                    Shipping
                  </span>
                  {shipping === 0 ? (
                    <span className="font-mono text-volt tabular-nums tracking-wider">
                      Free
                    </span>
                  ) : (
                    <span className="font-mono text-cream/80 tabular-nums">
                      {formatPrice(shipping)}
                    </span>
                  )}
                </div>

                {shipping > 0 && (
                  <p className="font-mono text-[9px] tracking-[0.14em] text-ash/60 uppercase border-l-2 border-gold/30 pl-3">
                    Free shipping on orders over $200
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-cream/10 my-6" />

              {/* Total */}
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-heading font-black text-[15px] uppercase tracking-[0.12em] text-cream">
                  Total
                </span>
                <span className="font-mono text-[18px] text-cream tabular-nums">
                  {formatPrice(orderTotal)}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={loadingCheckout}
                className="btn-drip w-full justify-center disabled:opacity-60 disabled:pointer-events-none"
              >
                {loadingCheckout ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Redirecting…</span>
                  </>
                ) : (
                  <>
                    <span>Checkout with Stripe</span>
                    <span className="font-mono text-[9px] opacity-60">—</span>
                    <span className="font-mono text-[10px] tabular-nums opacity-80">
                      {formatPrice(orderTotal)}
                    </span>
                  </>
                )}
              </button>

              {/* Error */}
              <AnimatePresence>
                {checkoutError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 font-mono text-[10px] text-red-400 tracking-wide text-center"
                  >
                    {checkoutError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-cream/8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-ash">
                  <Lock
                    className="w-3.5 h-3.5 shrink-0 text-gold/60"
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase">
                    Secure checkout
                  </span>
                </div>
                <div className="flex items-center gap-3 text-ash">
                  <RotateCcw
                    className="w-3.5 h-3.5 shrink-0 text-gold/60"
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase">
                    Free returns within 30 days
                  </span>
                </div>
              </div>
            </div>

            {/* Promo note */}
            <p className="mt-4 font-mono text-[9px] tracking-[0.15em] uppercase text-ash/40 text-center">
              Taxes calculated at checkout
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
