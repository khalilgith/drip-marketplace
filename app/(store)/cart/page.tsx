"use client"

import Link from "next/link"
import { useCartStore } from "@/lib/store/cartStore"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  const subtotal = total()
  const shipping = subtotal > 200 ? 0 : 9.99
  const orderTotal = subtotal + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/shop" className="text-gray-500 hover:text-gold">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-heading font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border border-gray-200 p-4"
            >
              <div className="w-24 h-24 bg-gray-100 shrink-0">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.size} / {item.color}
                </p>
                <p className="font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-4 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 p-6 h-fit">
          <h2 className="font-heading font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Free shipping on orders over $200</p>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <Link href="/order-confirmation">
            <Button className="w-full mt-6" size="lg">
              Checkout
            </Button>
          </Link>
          <Link
            href="/shop"
            className="block text-center text-sm text-gray-500 mt-4 hover:text-gold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
