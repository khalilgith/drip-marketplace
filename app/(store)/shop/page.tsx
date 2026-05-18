"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/store/ProductGrid"
import { FilterSidebar } from "@/components/store/FilterSidebar"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  const category = searchParams.get("category")
  const brand = searchParams.get("brand")
  const search = searchParams.get("search")

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (brand) params.set("brand", brand)
    if (search) params.set("search", search)

    fetch(`/api/products${params.toString() ? "?" + params.toString() : ""}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})

    fetch("/api/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {})
  }, [category, brand, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">
          {category || "All Products"}
        </h1>
        {search && (
          <p className="text-gray-500 mt-1">Search results for &ldquo;{search}&rdquo;</p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar brands={brands} />
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
