"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ProductGrid } from "@/components/store/ProductGrid"
import { ProductCardSkeletonGrid } from "@/components/store/ProductCardSkeleton"

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

interface BrandProductGridProps {
  brandSlug: string
}

export function BrandProductGrid({ brandSlug }: BrandProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?brand=${encodeURIComponent(brandSlug)}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [brandSlug])

  if (loading) {
    return <ProductCardSkeletonGrid count={8} />
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-20 flex flex-col items-center text-center gap-4"
      >
        <div className="font-heading text-[72px] leading-none text-cream/5 select-none">∅</div>
        <p className="font-heading text-lg font-bold text-cream/40 uppercase tracking-wide">
          No products yet
        </p>
        <p className="font-mono text-[11px] text-ash tracking-widest uppercase">
          Check back soon
        </p>
      </motion.div>
    )
  }

  return <ProductGrid products={products} />
}
