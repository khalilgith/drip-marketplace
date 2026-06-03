"use client"

import { useState, useRef, useCallback } from "react"
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion"
import Link from "next/link"
import { ShoppingBag, Check, Minus, Plus, Ruler, Truck, RotateCcw, Shield } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/lib/store/cartStore"
import { useWishlistStore } from "@/lib/store/wishlistStore"
import { formatPrice } from "@/lib/utils"

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Product {
  id: string
  name: string
  price: number
  compare_price: number | null
  description: string | null
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  brands: { name: string; slug: string } | null
}

interface ProductDetailClientProps {
  product: Product
}

/* ─── Animation Variants ────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const slideFromLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const slideFromRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const fadeUp: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const shakeVariants: Variants = {
  rest: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45, ease: "easeInOut" },
  },
}

/* ─── Heart SVG (animated fill) ─────────────────────────────────────────── */

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        animate={{
          fill: filled ? "#C9A84C" : "transparent",
          stroke: filled ? "#C9A84C" : "currentColor",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  )
}

/* ─── Thumbnail ──────────────────────────────────────────────────────────── */

function Thumbnail({
  src,
  alt,
  active,
  onClick,
  index,
}: {
  src: string
  alt: string
  active: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-14 h-[4.5rem] shrink-0 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <motion.div
        className="absolute inset-0 border pointer-events-none"
        animate={{
          borderColor: active ? "#C9A84C" : "transparent",
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.22 }}
      />
      {!active && (
        <div className="absolute inset-0 bg-navy/40 pointer-events-none" />
      )}
    </motion.button>
  )
}

/* ─── Complete the Look Card ─────────────────────────────────────────────── */

function LookCard({ index }: { index: number }) {
  const placeholders = [
    {
      name: "Utility Cargo Pant",
      price: 285,
      brand: "Carhartt WIP",
      img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    },
    {
      name: "Heavy Gauge Knit",
      price: 320,
      brand: "Stone Island",
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    },
    {
      name: "Technical Shell Jacket",
      price: 490,
      brand: "Nike",
      img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    },
  ]
  const item = placeholders[index]
  return (
    <motion.div
      className="group relative bg-cream/5 border border-cream/10 overflow-hidden"
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="aspect-[3/4] w-full relative overflow-hidden bg-cream/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <motion.div
          className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        >
          <span className="text-[9px] font-body font-bold tracking-[0.2em] uppercase text-cream border border-cream/30 px-4 py-2">
            View Item
          </span>
        </motion.div>
      </div>
      <div className="p-4">
        <p className="font-mono text-[9px] text-gold tracking-[0.15em] uppercase mb-1">
          {item.brand}
        </p>
        <p className="font-heading text-sm text-cream tracking-wide uppercase leading-tight">
          {item.name}
        </p>
        <p className="font-mono text-xs text-cream/50 mt-1">{formatPrice(item.price)}</p>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"]

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name ?? ""
  )
  const [quantity, setQuantity] = useState(1)
  const [cartState, setCartState] = useState<"idle" | "success">("idle")

  const addItem = useCartStore((s) => s.addItem)
  const wishlistToggle = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.has(product.id))

  const shakeControls = useAnimation()
  const qtyRef = useRef<HTMLSpanElement>(null)

  /* ── quantity press feedback ── */
  const qtyY = useMotionValue(0)
  const qtyOpacity = useTransform(qtyY, [-6, 0, 6], [0.4, 1, 0.4])

  const handleChangeImage = useCallback((idx: number) => {
    setSelectedImage(idx)
  }, [])

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      await shakeControls.start("shake")
      shakeControls.set("rest")
      toast.error("Select a size first", {
        position: "top-center",
        style: {
          background: "#08080C",
          border: "1px solid rgba(237,233,223,0.1)",
          color: "#EDE9DF",
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
        },
      })
      return
    }

    addItem({
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: images[selectedImage] ?? images[0],
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      quantity,
    })

    setCartState("success")
    setTimeout(() => setCartState("idle"), 2200)

    toast.success("Added to bag", {
      position: "top-center",
      style: {
        background: "#08080C",
        border: "1px solid rgba(201,168,76,0.35)",
        color: "#C9A84C",
        fontFamily: "var(--font-syne), sans-serif",
        fontSize: "11px",
        letterSpacing: "0.1em",
      },
    })
  }, [selectedSize, selectedColor, quantity, selectedImage, product, images, addItem, shakeControls])

  const handleWishlist = useCallback(() => {
    wishlistToggle({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      brand: product.brands?.name,
    })
  }, [wishlistToggle, product, images])

  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  return (
    <div className="bg-navy min-h-screen">
      {/* ── Main product section ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 xl:gap-20">

          {/* ═══════════════════════════════════════════════════════════
              LEFT: Image Gallery
          ═══════════════════════════════════════════════════════════ */}
          <motion.div
            className="lg:w-[55%] xl:w-[58%] flex gap-3 sm:gap-4"
            variants={slideFromLeft}
            initial="hidden"
            animate="visible"
          >
            {/* Vertical thumbnail strip */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2.5 pt-1">
                {images.map((img, i) => (
                  <Thumbnail
                    key={i}
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    active={i === selectedImage}
                    onClick={() => handleChangeImage(i)}
                    index={i}
                  />
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-[#0e0e12]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Aspect ratio holder — tall fashion ratio */}
              <div className="aspect-[3/4] lg:aspect-auto lg:min-h-[680px] xl:min-h-[780px] w-full" />

              {/* Discount badge */}
              {discount && (
                <motion.div
                  className="absolute top-4 left-4 bg-volt text-navy font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  -{discount}%
                </motion.div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-cream/30 tracking-widest">
                  {String(selectedImage + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
                </div>
              )}

              {/* Subtle scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(237,233,223,0.4) 3px, rgba(237,233,223,0.4) 4px)",
                }}
              />
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT: Product Details
          ═══════════════════════════════════════════════════════════ */}
          <motion.div
            className="lg:w-[45%] xl:w-[42%] flex flex-col"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col gap-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Brand */}
              {product.brands && (
                <motion.div variants={fadeUp}>
                  <Link
                    href={`/brand/${product.brands.slug}`}
                    className="inline-block font-mono text-[10px] text-gold tracking-[0.22em] uppercase mb-3 hover:text-gold/70 transition-colors"
                  >
                    {product.brands.name}
                  </Link>
                </motion.div>
              )}

              {/* Product name */}
              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] leading-[0.92] uppercase tracking-tight text-cream mb-6"
              >
                {product.name}
              </motion.h1>

              {/* Price row */}
              <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-2xl text-cream tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && (
                  <span className="font-mono text-base text-cream/30 line-through tracking-tight">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </motion.div>

              {/* Thin divider */}
              <motion.div
                variants={fadeUp}
                className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-8"
              />

              {/* Color Selector */}
              {product.colors?.length > 0 && (
                <motion.div variants={fadeUp} className="mb-8">
                  <p className="font-mono text-[9px] text-cream/40 tracking-[0.2em] uppercase mb-4">
                    Color —{" "}
                    <span className="text-cream/80">{selectedColor}</span>
                  </p>
                  <motion.div className="flex gap-3" variants={staggerChildren}>
                    {product.colors.map((color) => (
                      <motion.button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className="relative w-8 h-8 rounded-full shrink-0"
                        title={color.name}
                        variants={fadeUp}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <AnimatePresence>
                          {selectedColor === color.name && (
                            <motion.span
                              key="ring"
                              className="absolute -inset-[3px] rounded-full border border-gold"
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <motion.div variants={fadeUp} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-[9px] text-cream/40 tracking-[0.2em] uppercase">
                      Size —{" "}
                      <span className={selectedSize ? "text-cream/80" : "text-cream/25"}>
                        {selectedSize || "Select"}
                      </span>
                    </p>
                    <button className="flex items-center gap-1.5 font-mono text-[9px] text-cream/30 tracking-[0.12em] uppercase hover:text-gold transition-colors">
                      <Ruler size={10} />
                      Size Guide
                    </button>
                  </div>
                  <motion.div className="flex flex-wrap gap-2" variants={staggerChildren}>
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="relative overflow-hidden"
                        variants={fadeUp}
                        animate={
                          selectedSize === size
                            ? { scale: 1.05 }
                            : { scale: 1 }
                        }
                        whileHover={{ scale: selectedSize === size ? 1.05 : 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      >
                        <span
                          className={[
                            "relative z-10 flex items-center justify-center min-w-[3rem] px-4 py-2.5",
                            "font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-200",
                            selectedSize === size
                              ? "text-navy"
                              : "text-cream/50 hover:text-cream/80",
                          ].join(" ")}
                        >
                          {size}
                        </span>
                        {/* Selected fill */}
                        <AnimatePresence>
                          {selectedSize === size && (
                            <motion.span
                              key="fill"
                              className="absolute inset-0 bg-gold z-0"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              exit={{ scaleX: 0, transition: { duration: 0.18 } }}
                              style={{ transformOrigin: "left" }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            />
                          )}
                        </AnimatePresence>
                        {/* Border */}
                        <span
                          className={[
                            "absolute inset-0 border transition-colors duration-200",
                            selectedSize === size
                              ? "border-gold"
                              : "border-white/10 hover:border-white/25",
                          ].join(" ")}
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Quantity selector */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="font-mono text-[9px] text-cream/40 tracking-[0.2em] uppercase mb-4">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-white/10">
                  <motion.button
                    className="w-10 h-10 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    whileTap={{ scale: 0.85 }}
                  >
                    <Minus size={12} />
                  </motion.button>
                  <motion.span
                    ref={qtyRef}
                    className="w-12 text-center font-mono text-sm text-cream"
                    style={{ opacity: qtyOpacity }}
                    key={quantity}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    className="w-10 h-10 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
                    onClick={() => setQuantity((q) => q + 1)}
                    whileTap={{ scale: 0.85 }}
                  >
                    <Plus size={12} />
                  </motion.button>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex gap-3 mb-8">
                {/* Add to Cart */}
                <motion.button
                  className="btn-drip flex-1 relative overflow-hidden"
                  variants={shakeVariants}
                  animate={shakeControls}
                  initial="rest"
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {cartState === "success" ? (
                      <motion.span
                        key="success"
                        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      >
                        <Check size={14} strokeWidth={2.5} />
                        Added to Bag
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      >
                        <ShoppingBag size={14} />
                        Add to Bag — {formatPrice(product.price * quantity)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  className={[
                    "w-14 h-14 shrink-0 flex items-center justify-center border transition-colors duration-200",
                    isWishlisted
                      ? "border-gold/50 text-gold bg-gold/5"
                      : "border-white/10 text-cream/40 hover:border-white/25 hover:text-cream/70",
                  ].join(" ")}
                  onClick={handleWishlist}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span
                    animate={isWishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  >
                    <HeartIcon filled={isWishlisted} />
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Description */}
              {product.description && (
                <motion.div variants={fadeUp} className="mb-8">
                  <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6" />
                  <p className="font-body text-sm text-cream/40 leading-[1.75] tracking-wide">
                    {product.description}
                  </p>
                </motion.div>
              )}

              {/* Trust strip */}
              <motion.div
                variants={fadeUp}
                className="border-t border-white/[0.06] pt-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Truck, label: "Free Shipping", sub: "Orders over $200" },
                    { icon: RotateCcw, label: "30-Day Returns", sub: "Easy & free" },
                    { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted" },
                  ].map(({ icon: Icon, label, sub }, i) => (
                    <motion.div
                      key={label}
                      className="flex flex-col items-center text-center gap-2"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.9 + i * 0.08,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                      }}
                    >
                      <Icon size={14} className="text-gold/60" />
                      <span className="font-mono text-[8px] text-cream/50 tracking-[0.1em] uppercase leading-tight">
                        {label}
                        <br />
                        <span className="text-cream/25">{sub}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BELOW THE FOLD: Complete the Look
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pb-24 mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-6">
            <div className="h-px w-8 bg-gold/40" />
            <span className="font-mono text-[9px] text-gold tracking-[0.3em] uppercase">
              Complete the Look
            </span>
          </div>
          <motion.div
            className="h-px bg-gradient-to-l from-transparent via-white/8 to-transparent flex-1 mx-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
            style={{ transformOrigin: "right" }}
          />
          <button className="font-mono text-[9px] text-cream/25 tracking-[0.2em] uppercase hover:text-cream/50 transition-colors">
            View All
          </button>
        </motion.div>

        {/* Look cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={staggerChildren}
        >
          {[0, 1, 2].map((i) => (
            <LookCard key={i} index={i} />
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}
