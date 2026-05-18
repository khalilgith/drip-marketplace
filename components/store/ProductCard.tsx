import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cartStore"
import { toast } from "sonner"

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
    toast.success("Added to cart")
  }

  return (
    <Card className="group">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {product.compare_price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium">
              {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {product.brands && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.brands.name}
          </p>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-base mb-1 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-navy">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
        <Button onClick={handleAddToCart} className="w-full" size="sm">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
