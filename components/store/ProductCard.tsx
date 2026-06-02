"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

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
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  return (
    <div className="product-card group">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4] bg-cream/5">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/15 font-mono text-[10px] tracking-widest uppercase">
            No image
          </div>
        )}

        {/* Hover overlay */}
        <div className="product-card-overlay">
          <span className="product-card-cta">
            <span>View Item</span>
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 font-mono text-[9px] font-medium tracking-[0.12em] uppercase bg-volt text-navy px-2 py-1">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="pt-4 pb-1">
        {product.brands && (
          <Link
            href={`/brand/${product.brands.slug}`}
            className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold hover:text-gold/70 transition-colors"
          >
            {product.brands.name}
          </Link>
        )}
        <Link href={`/product/${product.id}`} className="block mt-1.5">
          <h3 className="font-body text-[13px] font-medium text-cream/80 hover:text-cream transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="font-mono text-[12px] text-cream/90">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="font-mono text-[11px] text-ash line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
