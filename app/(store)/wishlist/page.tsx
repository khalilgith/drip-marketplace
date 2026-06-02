"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowUpRight, Trash2, ShoppingBag } from "lucide-react"
import { useWishlistStore } from "@/lib/store/wishlistStore"
import { formatPrice } from "@/lib/utils"

/* ─────────────────────────── animation variants ─────────────────────────── */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.93,
    y: -12,
    transition: { duration: 0.32, ease: [0.4, 0, 1, 1] as [number, number, number, number] as [number, number, number, number] },
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] as [number, number, number, number] },
  },
}

/* ─────────────────────────────── component ──────────────────────────────── */

export default function WishlistPage() {
  const { items, remove } = useWishlistStore()

  /* ── empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative mb-8 select-none"
        >
          {/* Giant ghost heart */}
          <div
            className="font-heading font-black leading-none uppercase"
            style={{ fontSize: "clamp(120px, 22vw, 200px)" }}
          >
            <Heart
              className="mx-auto"
              style={{
                width: "clamp(100px, 18vw, 180px)",
                height: "clamp(100px, 18vw, 180px)",
                color: "rgba(201,168,76,0.08)",
                strokeWidth: 1,
              }}
            />
          </div>
          {/* Centered heart fill */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart
              className="text-ash/25"
              style={{
                width: "clamp(32px, 5vw, 48px)",
                height: "clamp(32px, 5vw, 48px)",
                strokeWidth: 1.5,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="font-heading font-black text-[clamp(26px,5vw,46px)] uppercase tracking-[0.1em] text-cream mb-3">
            Your wishlist is empty
          </h1>
          <p className="font-body text-ash text-[13px] tracking-wide mb-10 max-w-xs mx-auto leading-relaxed">
            Save pieces you love and come back to them whenever you&apos;re ready.
          </p>
          <Link href="/shop" className="btn-drip">
            <span>Browse the collection</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20">

      {/* ── Page header ── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-gold mb-3 block">
              — Saved Items
            </span>
            <h1 className="font-heading font-black text-[clamp(38px,7vw,72px)] uppercase leading-none tracking-[0.04em] text-cream">
              Wishlist
            </h1>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ash pb-2 hidden sm:block">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {/* Animated rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.12 }}
          className="h-px bg-cream/10 mt-6 origin-left"
        />
      </motion.div>

      {/* ── Product grid ── */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              variants={cardVariants}
              exit="exit"
              className="group flex flex-col"
            >
              {/* ── Image block ── */}
              <div className="relative overflow-hidden aspect-[3/4] bg-cream/5">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ash/20">
                    <ShoppingBag className="w-8 h-8" strokeWidth={1} />
                  </div>
                )}

                {/* Hover overlay with "View Item" CTA */}
                <div className="product-card-overlay">
                  <Link
                    href={`/product/${item.id}`}
                    className="product-card-cta"
                  >
                    <span>View Item</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Remove from wishlist — top-right corner */}
                <button
                  onClick={() => remove(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-navy/70 backdrop-blur-sm text-cream hover:text-gold hover:bg-navy/90 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* ── Card info ── */}
              <div className="pt-4 pb-1 flex-1 flex flex-col">
                {item.brand && (
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold mb-1.5 block">
                    {item.brand}
                  </span>
                )}

                <Link
                  href={`/product/${item.id}`}
                  className="font-body text-[13px] font-medium text-cream/80 hover:text-cream transition-colors leading-snug line-clamp-2 flex-1"
                >
                  {item.name}
                </Link>

                <div className="flex items-center justify-between mt-3 gap-2">
                  <span className="font-mono text-[12px] text-cream/90 tabular-nums">
                    {formatPrice(item.price)}
                  </span>

                  {/* Actions: remove + move to cart */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-mono text-[9px] tracking-[0.16em] uppercase text-ash hover:text-cream transition-colors flex items-center gap-1"
                      title="View product to add to cart"
                    >
                      <ShoppingBag className="w-3 h-3" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Add</span>
                    </Link>

                    <button
                      onClick={() => remove(item.id)}
                      className="font-mono text-[9px] tracking-[0.16em] uppercase text-ash/50 hover:text-cream transition-colors flex items-center gap-1 group/rm"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3 h-3 group-hover/rm:text-cream transition-colors" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mt-20 pt-10 border-t border-cream/8 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <p className="font-body text-[13px] text-ash text-center sm:text-left">
          Ready to make it yours?{" "}
          <span className="text-cream/60">Visit each product to add to your bag.</span>
        </p>
        <Link href="/shop" className="btn-ghost shrink-0">
          <span>Continue browsing</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  )
}
