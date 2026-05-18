"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cartStore"
import { toast } from "sonner"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface ProductDetailClientProps {
  product: any
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "")
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size")
      return
    }
    addItem({
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      quantity,
    })
    toast.success("Added to cart!")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 bg-gray-100 overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brands && (
            <Link
              href={`/brand/${product.brands.slug}`}
              className="text-sm text-gold uppercase tracking-wider hover:underline"
            >
              {product.brands.name}
            </Link>
          )}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mt-2 mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-8">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      selectedSize === size
                        ? "border-gold bg-gold text-white"
                        : "border-gray-300 hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">
                Color: <span className="text-gray-500">{selectedColor}</span>
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color: { name: string; hex: string }) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? "border-gold scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart — {formatPrice(product.price * quantity)}
          </Button>

          {product.reviews?.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-heading font-bold mb-6">Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {review.profiles?.full_name || "Anonymous"}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-gold text-sm">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
