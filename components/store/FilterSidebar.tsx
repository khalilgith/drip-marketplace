"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

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

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white border border-gray-200 p-6 sticky top-24">
        <h3 className="font-heading font-bold text-lg mb-4">Filters</h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Category
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => setFilter("category", null)}
              className={`block text-sm w-full text-left px-2 py-1 rounded ${
                !currentCategory ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:text-gold"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter("category", cat)}
                className={`block text-sm w-full text-left px-2 py-1 rounded ${
                  currentCategory === cat ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Brand
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => setFilter("brand", null)}
              className={`block text-sm w-full text-left px-2 py-1 rounded ${
                !currentBrand ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:text-gold"
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setFilter("brand", brand.slug)}
                className={`block text-sm w-full text-left px-2 py-1 rounded ${
                  currentBrand === brand.slug ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:text-gold"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {currentCategory || currentBrand ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-red-500"
            onClick={() => router.push("/shop")}
          >
            Clear Filters
          </Button>
        ) : null}
      </div>
    </aside>
  )
}
