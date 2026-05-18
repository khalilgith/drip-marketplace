"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/store/ProductGrid"
import { FilterSidebar } from "@/components/store/FilterSidebar"

function ShopContent() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  const category = searchParams?.get("category") ?? null
  const brand = searchParams?.get("brand") ?? null
  const search = searchParams?.get("search") ?? null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (brand) params.set("brand", brand)
    if (search) params.set("search", search)
    const qs = params.toString()
    fetch(`/api/products${qs ? "?" + qs : ""}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
    fetch("/api/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {})
  }, [mounted, category, brand, search])

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-gold text-xs tracking-[0.2em] uppercase font-semibold mb-2">
          {category || "All Categories"}
        </p>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold">
          {category || "All Products"}
        </h1>
        {search && (
          <p className="text-navy/50 mt-2">
            Search results for &ldquo;<span className="text-gold">{search}</span>&rdquo;
          </p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <FilterSidebar brands={brands} />
        <div className="flex-1">
          <p className="text-sm text-navy/50 mb-8">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
