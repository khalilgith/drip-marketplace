"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"

import { FilterSidebar } from "@/components/store/FilterSidebar"
import { ProductGrid } from "@/components/store/ProductGrid"
import { ProductCardSkeletonGrid } from "@/components/store/ProductCardSkeleton"
import { ScrollReveal } from "@/components/store/ScrollReveal"

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface Product {
  id: string
  name: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  created_at: string
  brands: { name: string; slug: string } | null
}

interface Brand {
  id: string
  name: string
  slug: string
}

type SortKey = "newest" | "price_asc" | "price_desc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest",     label: "Newest"              },
  { value: "price_asc",  label: "Price: Low to High"  },
  { value: "price_desc", label: "Price: High to Low"  },
]

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products]
  if (sort === "price_asc")  return copy.sort((a, b) => a.price - b.price)
  if (sort === "price_desc") return copy.sort((a, b) => b.price - a.price)
  // newest — keep original desc created_at order
  return copy
}

function buildSearchParams(params: {
  category?: string
  brand?: string
  search?: string
}): string {
  const p = new URLSearchParams()
  if (params.category) p.set("category", params.category)
  if (params.brand)    p.set("brand",    params.brand)
  if (params.search)   p.set("search",   params.search)
  return p.toString()
}

/* ─── Active filter chips ───────────────────────────────────────────────────── */
interface FilterChipsProps {
  category?: string
  brand?: string
  search?: string
  brandLabel?: string
  onClearCategory: () => void
  onClearBrand:    () => void
  onClearSearch:   () => void
}

function FilterChips({
  category,
  brand,
  search,
  brandLabel,
  onClearCategory,
  onClearBrand,
  onClearSearch,
}: FilterChipsProps) {
  if (!category && !brand && !search) return null
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <AnimatePresence>
        {category && (
          <motion.button
            key="chip-cat"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            onClick={onClearCategory}
            className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[11px] font-mono tracking-widest uppercase hover:bg-gold/20 transition-colors"
          >
            {category}
            <X className="h-2.5 w-2.5" />
          </motion.button>
        )}
        {brand && (
          <motion.button
            key="chip-brand"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            onClick={onClearBrand}
            className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[11px] font-mono tracking-widest uppercase hover:bg-gold/20 transition-colors"
          >
            {brandLabel ?? brand}
            <X className="h-2.5 w-2.5" />
          </motion.button>
        )}
        {search && (
          <motion.button
            key="chip-search"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1 bg-cream/5 border border-cream/10 text-cream/60 text-[11px] font-mono tracking-widest uppercase hover:bg-cream/8 transition-colors"
          >
            &ldquo;{search}&rdquo;
            <X className="h-2.5 w-2.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Sort dropdown ─────────────────────────────────────────────────────────── */
function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey
  onChange: (v: SortKey) => void
}) {
  const [open, setOpen] = useState(false)
  const current = SORT_OPTIONS.find((o) => o.value === value)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 border border-cream/10 text-[11px] font-mono tracking-widest uppercase text-ash hover:border-cream/20 hover:text-cream/80 transition-all"
      >
        {current.label}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-30 border border-cream/10 min-w-[180px]"
            style={{ background: "#0f0f14" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`block w-full text-left px-4 py-2.5 text-[11px] font-mono tracking-widest uppercase transition-colors ${
                  opt.value === value
                    ? "text-gold bg-gold/8"
                    : "text-ash hover:text-cream/80 hover:bg-cream/4"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Mobile filter drawer ──────────────────────────────────────────────────── */
function MobileFilterDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-navy border-r border-cream/8 overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream/8">
              <span className="font-heading font-bold text-base tracking-wide text-cream/90 uppercase">
                Filters
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-ash hover:text-cream/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Main shop content ─────────────────────────────────────────────────────── */
function ShopContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? undefined
  const brand    = searchParams.get("brand")    ?? undefined
  const search   = searchParams.get("search")   ?? undefined

  const [products, setProducts] = useState<Product[]>([])
  const [brands,   setBrands]   = useState<Brand[]>([])
  const [loading,  setLoading]  = useState(true)
  const [sort,     setSort]     = useState<SortKey>("newest")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  /* Fetch products whenever filters change */
  useEffect(() => {
    setLoading(true)
    const qs = buildSearchParams({ category, brand, search })
    fetch(`/api/products${qs ? "?" + qs : ""}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, brand, search])

  /* Fetch brands once */
  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data: Brand[]) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  /* Push updated URL when filters change */
  const handleCategoryChange = useCallback(
    (cat: string | undefined) => {
      const qs = buildSearchParams({ category: cat, brand, search })
      router.push(`/shop${qs ? "?" + qs : ""}`)
    },
    [brand, search, router]
  )

  const handleBrandChange = useCallback(
    (b: string | undefined) => {
      const qs = buildSearchParams({ category, brand: b, search })
      router.push(`/shop${qs ? "?" + qs : ""}`)
    },
    [category, search, router]
  )

  const clearAllFilters = useCallback(() => {
    router.push("/shop")
  }, [router])

  /* Sorted display list */
  const displayProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort]
  )

  /* Brand label for chip */
  const activeBrandLabel = useMemo(
    () => brands.find((b) => b.slug === brand)?.name,
    [brands, brand]
  )

  /* Heading copy */
  const heading = search
    ? "Search Results"
    : category ?? "All Products"

  const subheading = search
    ? `For "${search}"`
    : category
    ? `Showing ${category.toLowerCase()} collection`
    : "The full collection"

  /* Shared filter sidebar props */
  const filterSidebarProps = {
    activeCategory: category,
    activeBrand:    brand,
    onCategoryChange: handleCategoryChange,
    onBrandChange:    handleBrandChange,
    brands,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Page header ── */}
      <ScrollReveal>
        <p className="text-gold text-[10px] tracking-[0.25em] uppercase font-mono mb-2">
          {subheading}
        </p>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold tracking-tight text-cream/95 uppercase">
          {heading}
        </h1>
      </ScrollReveal>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Mobile filter trigger */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-cream/10 text-[11px] font-mono tracking-widest uppercase text-ash hover:border-cream/20 hover:text-cream/80 transition-all lg:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {(category || brand) && (
            <span className="flex items-center justify-center w-4 h-4 bg-gold text-navy text-[9px] font-bold rounded-full">
              {[category, brand].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Product count */}
        <p className="text-[11px] font-mono tracking-widest uppercase text-ash">
          {loading ? (
            <span className="inline-block w-24 h-3 bg-cream/8 animate-pulse" />
          ) : (
            <>
              {displayProducts.length}{" "}
              {displayProducts.length === 1 ? "product" : "products"} found
            </>
          )}
        </p>

        {/* Sort */}
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* ── Active filter chips ── */}
      <FilterChips
        category={category}
        brand={brand}
        search={search}
        brandLabel={activeBrandLabel}
        onClearCategory={() => handleCategoryChange(undefined)}
        onClearBrand={() => handleBrandChange(undefined)}
        onClearSearch={() => {
          const qs = buildSearchParams({ category, brand })
          router.push(`/shop${qs ? "?" + qs : ""}`)
        }}
      />

      {/* ── Layout: sidebar + grid ── */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar {...filterSidebarProps} />
        </div>

        {/* Mobile sidebar in drawer */}
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        >
          {/* Render sidebar without its own sticky wrapper inside drawer */}
          <FilterSidebar {...filterSidebarProps} />
        </MobileFilterDrawer>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductCardSkeletonGrid count={8} />
          ) : displayProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-24 flex flex-col items-center text-center gap-5"
            >
              <div className="font-heading text-[80px] leading-none text-cream/5 select-none">
                ∅
              </div>
              <p className="font-heading text-xl font-bold text-cream/40 uppercase tracking-wide">
                No products found
              </p>
              <p className="font-mono text-[11px] text-ash tracking-widest uppercase">
                Try adjusting your filters
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-6 py-2.5 border border-gold/30 text-gold text-[11px] font-mono tracking-[0.2em] uppercase hover:bg-gold/10 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <ScrollReveal delay={0.15} duration={0.6}>
              <ProductGrid products={displayProducts} />
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Page export ───────────────────────────────────────────────────────────── */
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            <div className="h-3 w-24 bg-cream/8 animate-pulse" />
            <div className="h-10 w-56 bg-cream/8 animate-pulse" />
            <div className="flex items-center justify-between mt-8">
              <div className="h-3 w-28 bg-cream/8 animate-pulse" />
              <div className="h-8 w-36 bg-cream/8 animate-pulse" />
            </div>
            <ProductCardSkeletonGrid count={8} />
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
