"use client"

import Link from "next/link"
import { useCartStore } from "@/lib/store/cartStore"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-3">Your cart is empty</h1>
        <p className="text-navy/50 mb-8 max-w-sm mx-auto">
          Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
        </p>
        <Link href="/shop">
          <Button className="group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const subtotal = total()
  const shipping = subtotal > 200 ? 0 : 9.99
  const orderTotal = subtotal + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-navy/50 hover:text-gold transition-colors mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">Shopping Cart</h1>
        </div>
        <p className="text-sm text-navy/50">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 bg-white border border-gray-100 p-5 group hover:border-gold/30 transition-colors"
            >
              <div className="w-24 h-28 bg-gray-50 shrink-0 overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-navy/40 mt-1">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-cream transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-4 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-cream transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-7 h-fit sticky top-28">
          <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-navy/50">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/50">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-navy/40">
                Free shipping on orders over $200
              </p>
            )}
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <Link href="/order-confirmation">
            <Button className="w-full mt-6 btn-shimmer" size="lg">
              Checkout — {formatPrice(orderTotal)}
            </Button>
          </Link>
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-navy/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure checkout via SSL
          </div>
        </div>
      </div>
    </div>
  )
}
