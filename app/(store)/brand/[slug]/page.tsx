"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductGrid } from "@/components/store/ProductGrid"

export default function BrandPage() {
  const params = useParams()
  const [brand, setBrand] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((brands) => {
        const found = brands.find((b: any) => b.slug === params.slug)
        if (found) {
          setBrand(found)
          return fetch(`/api/products?brand=${found.slug}`).then((r) => r.json()).then(setProducts)
        }
        setNotFound(true)
      })
      .catch(() => setNotFound(true))
  }, [params.slug])

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold">Brand not found</h1>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-48 bg-navy rounded flex items-center justify-center mb-6">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gold">
            {brand.name}
          </h1>
        </div>
        {brand.description && (
          <p className="text-gray-600 max-w-2xl">{brand.description}</p>
        )}
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
