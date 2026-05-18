"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cartStore"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, total } = useCartStore()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-heading font-bold text-lg">Cart ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button onClick={onClose} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {item.size} / {item.color}
                    </p>
                    <p className="font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total())}</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/cart" onClick={onClose}>
                  View Cart
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
