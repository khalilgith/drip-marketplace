"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, RotateCcw, Check } from "lucide-react"

const CATEGORIES = ["Men", "Women", "Accessories"] as const

interface FilterSidebarProps {
  activeCategory?: string
  activeBrand?: string
  onCategoryChange: (cat: string | undefined) => void
  onBrandChange: (brand: string | undefined) => void
  brands: { id: string; name: string; slug: string }[]
}

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full group"
    >
      <span className="text-[10px] font-mono font-semibold text-ash uppercase tracking-[0.2em]">
        {title}
      </span>
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-3.5 w-3.5 text-ash group-hover:text-cream/60 transition-colors" />
      </motion.div>
    </button>
  )
}

export function FilterSidebar({
  activeCategory,
  activeBrand,
  onCategoryChange,
  onBrandChange,
  brands,
}: FilterSidebarProps) {
  const [catOpen, setCatOpen] = useState(true)
  const [brandOpen, setBrandOpen] = useState(true)

  const hasFilters = !!activeCategory || !!activeBrand

  const handleCategoryClick = (cat: string) => {
    onCategoryChange(activeCategory === cat ? undefined : cat)
  }

  const handleBrandClick = (slug: string) => {
    onBrandChange(activeBrand === slug ? undefined : slug)
  }

  const clearAll = () => {
    onCategoryChange(undefined)
    onBrandChange(undefined)
  }

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div
        className="sticky top-28 border border-cream/5 p-6"
        style={{ background: "rgba(237,233,223,0.03)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-base tracking-wide text-cream/90 uppercase">
            Filters
          </h3>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
                onClick={clearAll}
                className="flex items-center gap-1 text-[10px] text-ash hover:text-gold transition-colors font-mono tracking-widest uppercase"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Category ── */}
        <div className="mb-6">
          <SectionHeader
            title="Category"
            open={catOpen}
            onToggle={() => setCatOpen((v) => !v)}
          />
          <AnimatePresence initial={false}>
            {catOpen && (
              <motion.div
                key="cat-section"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const active = activeCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`
                          group flex items-center justify-between w-full px-3 py-2 text-sm
                          transition-all duration-150
                          ${
                            active
                              ? "border-l-2 border-gold bg-gold/8 text-gold font-medium"
                              : "border-l-2 border-transparent text-ash hover:text-cream/80 hover:border-cream/20 hover:bg-cream/4"
                          }
                        `}
                      >
                        <span>{cat}</span>
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.12 }}
                            >
                              <Check className="h-3 w-3 text-gold" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/5 mb-6" />

        {/* ── Brand ── */}
        <div className="mb-6">
          <SectionHeader
            title="Brand"
            open={brandOpen}
            onToggle={() => setBrandOpen((v) => !v)}
          />
          <AnimatePresence initial={false}>
            {brandOpen && (
              <motion.div
                key="brand-section"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-0.5 max-h-64 overflow-y-auto scrollbar-thin">
                  {brands.length === 0 && (
                    <p className="text-[11px] text-ash/50 px-3 py-1 font-mono">
                      No brands
                    </p>
                  )}
                  {brands.map((brand) => {
                    const active = activeBrand === brand.slug
                    return (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.slug)}
                        className={`
                          group flex items-center justify-between w-full px-3 py-2 text-sm
                          transition-all duration-150
                          ${
                            active
                              ? "border-l-2 border-gold bg-gold/8 text-gold font-medium"
                              : "border-l-2 border-transparent text-ash hover:text-cream/80 hover:border-cream/20 hover:bg-cream/4"
                          }
                        `}
                      >
                        <span>{brand.name}</span>
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.12 }}
                            >
                              <Check className="h-3 w-3 text-gold" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear all */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              <button
                onClick={clearAll}
                className="w-full py-2 border border-cream/10 text-[11px] font-mono tracking-[0.15em] uppercase text-ash hover:border-gold/40 hover:text-gold transition-all duration-150"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
