"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    compare_price: number | null
    images: string[]
    category: string
    brands: { name: string; slug: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-200 bg-white hover:border-gold hover:shadow-lg transition-all group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
          {product.compare_price && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1">
              -{Math.round((1 - product.price / product.compare_price) * 100)}%
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        {product.brands && (
          <p className="text-[11px] text-gold uppercase tracking-wider font-semibold mb-1">
            {product.brands.name}
          </p>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm leading-snug text-navy hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="font-bold text-sm text-navy">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>
        <button className="w-full bg-navy text-white text-xs font-medium py-2.5 px-4 hover:bg-navy/90 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
