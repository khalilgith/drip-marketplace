"use client"

import { useEffect, useState } from "react"
import { HeroBanner } from "@/components/store/HeroBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { BrandCard } from "@/components/store/BrandCard"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => setProducts(data?.filter((p: any) => p.featured) || []))
      .catch(() => {})

    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => setBrands(data?.filter((b: any) => b.featured) || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <HeroBanner />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold">Featured Products</h2>
          <p className="text-gray-500 mt-2">Our most wanted pieces right now.</p>
        </div>
        <ProductGrid products={products} />
      </section>
      {brands.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold">Featured Brands</h2>
              <p className="text-gray-500 mt-2">The labels defining streetwear culture.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brands.map((brand: any) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
