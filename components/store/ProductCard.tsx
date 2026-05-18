"use client"

import { useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cartStore"
import { toast } from "sonner"
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
  const addItem = useCartStore((s) => s.addItem)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    const inner = card.querySelector(".tilt-card-inner") as HTMLElement
    if (inner) {
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
  }

  const handleMouseLeave = () => {
    const inner = cardRef.current?.querySelector(".tilt-card-inner") as HTMLElement
    if (inner) {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)"
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: "M",
      color: "Default",
      quantity: 1,
    })
    toast.success("Added to cart", { position: "top-center" })
  }

  return (
    <div
      ref={cardRef}
      className="tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="group card-glow-border overflow-hidden bg-white">
        <div className="tilt-card-inner">
          <div className="tilt-card-glow" />
          <Link href={`/product/${product.id}`}>
            <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  No image
                </div>
              )}
              {product.compare_price && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase">
                  -{Math.round((1 - product.price / product.compare_price) * 100)}%
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>
          <CardContent className="p-5">
            {product.brands && (
              <p className="text-[10px] text-gold uppercase tracking-[0.15em] font-semibold mb-1.5">
                {product.brands.name}
              </p>
            )}
            <Link href={`/product/${product.id}`}>
              <h3 className="font-heading font-semibold text-sm mb-1.5 hover:text-gold transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-sm text-navy">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full group/btn"
              size="sm"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-2 group-hover/btn:scale-110 transition-transform" />
              Add to Cart
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
