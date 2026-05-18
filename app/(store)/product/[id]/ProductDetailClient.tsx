"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cartStore"
import { toast } from "sonner"
import { Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import Link from "next/link"

interface ProductDetailClientProps {
  product: any
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "")
  const [quantity, setQuantity] = useState(1)
  const [zoomed, setZoomed] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"]

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
      image: images[selectedImage] || images[0],
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      quantity,
    })
    toast.success("Added to cart!", { position: "top-center" })
  }

  const nextImage = () => setSelectedImage((s) => (s + 1) % images.length)
  const prevImage = () => setSelectedImage((s) => (s - 1 + images.length) % images.length)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div>
          <div
            className="aspect-[4/5] bg-gray-50 overflow-hidden relative group cursor-crosshair"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                zoomed ? "scale-150" : "scale-100"
              }`}
              style={{ transformOrigin: "center center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 bg-gray-50 overflow-hidden border-2 transition-all ${
                    i === selectedImage ? "border-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.brands && (
            <Link
              href={`/brand/${product.brands.slug}`}
              className="text-xs text-gold uppercase tracking-[0.15em] font-semibold hover:underline mb-2"
            >
              {product.brands.name}
            </Link>
          )}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          <p className="text-navy/60 leading-relaxed mb-10">
            {product.description || "No description available."}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                Size: <span className="text-gold ml-1">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-3 border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-gold bg-gold text-white"
                        : "border-gray-200 text-navy hover:border-gold/50 hover:bg-cream"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                Color: <span className="text-gold ml-1">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color: { name: string; hex: string }) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-gold scale-110 shadow-lg shadow-gold/20"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3.5 hover:bg-cream transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="px-6 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3.5 hover:bg-cream transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1 btn-shimmer group" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Add to Cart — {formatPrice(product.price * quantity)}
            </Button>
            <Button variant="outline" size="icon" className="w-14 h-14 shrink-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-6 text-center text-xs text-navy/50">
              <div>
                <p className="font-semibold text-navy mb-1">Free Shipping</p>
                <p>On orders over $200</p>
              </div>
              <div>
                <p className="font-semibold text-navy mb-1">Easy Returns</p>
                <p>30-day return policy</p>
              </div>
              <div>
                <p className="font-semibold text-navy mb-1">Secure Checkout</p>
                <p>SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-100">
          <h3 className="text-2xl font-heading font-bold mb-8">Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="bg-white border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center">
                    <span className="text-xs font-bold text-navy">
                      {(review.profiles?.full_name || "A").charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{review.profiles?.full_name || "Anonymous"}</span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < review.rating ? "text-gold" : "text-gray-200"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-navy/60 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
