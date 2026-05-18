"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

const categories = ["Men", "Women", "Accessories"]

interface FilterSidebarProps {
  brands: { id: string; name: string; slug: string }[]
}

export function FilterSidebar({ brands }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")
  const currentBrand = searchParams.get("brand")

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const hasFilters = currentCategory || currentBrand

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white border border-gray-100 p-7 sticky top-28">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-lg">Filters</h3>
          {hasFilters && (
            <button
              onClick={() => router.push("/shop")}
              className="text-xs text-navy/40 hover:text-gold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        <div className="mb-7">
          <h4 className="text-xs font-semibold text-navy uppercase tracking-[0.15em] mb-4">Category</h4>
          <div className="space-y-1">
            <button
              onClick={() => setFilter("category", null)}
              className={`block text-sm w-full text-left px-3 py-2 transition-all ${
                !currentCategory
                  ? "bg-gold/10 text-gold font-medium border-l-2 border-gold"
                  : "text-navy/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter("category", cat)}
                className={`block text-sm w-full text-left px-3 py-2 transition-all ${
                  currentCategory === cat
                    ? "bg-gold/10 text-gold font-medium border-l-2 border-gold"
                    : "text-navy/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-navy uppercase tracking-[0.15em] mb-4">Brand</h4>
          <div className="space-y-1">
            <button
              onClick={() => setFilter("brand", null)}
              className={`block text-sm w-full text-left px-3 py-2 transition-all ${
                !currentBrand
                  ? "bg-gold/10 text-gold font-medium border-l-2 border-gold"
                  : "text-navy/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent"
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setFilter("brand", brand.slug)}
                className={`block text-sm w-full text-left px-3 py-2 transition-all ${
                  currentBrand === brand.slug
                    ? "bg-gold/10 text-gold font-medium border-l-2 border-gold"
                    : "text-navy/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
