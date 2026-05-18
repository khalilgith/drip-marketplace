"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductGrid } from "@/components/store/ProductGrid"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-heading font-bold mb-3">Brand not found</h1>
        <Link href="/shop" className="text-gold text-sm hover:underline">
          Browse all products
        </Link>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-6 max-w-2xl mx-auto" />
          <div className="h-8 w-48 bg-gray-200 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-navy/50 hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Shop
      </Link>

      <div className="relative h-56 md:h-72 bg-navy overflow-hidden mb-8 flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gold/5 blur-[100px]" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-[100px]" />
        </div>
        <div className="text-center relative">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-gold tracking-tight">
            {brand.name}
          </h1>
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] mt-3">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {brand.description && (
        <p className="text-navy/60 max-w-2xl mx-auto text-center mb-10 leading-relaxed">
          {brand.description}
        </p>
      )}

      <ProductGrid products={products} />
    </div>
  )
}
