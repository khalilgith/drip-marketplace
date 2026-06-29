"use client"

import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "@/lib/store/cartStore"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, total } = useCartStore()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-navy border-l border-cream/5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream/5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-cream/40" />
                <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-cream/70">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-cream/30 hover:text-cream transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-5 px-6">
                <div className="w-16 h-16 border border-cream/10 flex items-center justify-center bg-cream/3">
                  <ShoppingBag className="h-6 w-6 text-cream/20" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-[16px] uppercase tracking-wide text-cream/50 mb-1">
                    Your bag is empty
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/20">
                    Add some drip to get started
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-drip mt-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-5 border-b border-cream/5"
                    >
                      <div className="w-[72px] h-[90px] bg-cream/5 shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body text-[12px] font-medium text-cream/80 truncate">
                          {item.name}
                        </h3>
                        <p className="font-mono text-[9px] text-cream/30 tracking-[0.1em] uppercase mt-1">
                          {item.size} / {item.color}
                        </p>
                        <p className="font-mono text-[13px] text-cream/70 mt-1.5">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="inline-flex items-center border border-cream/10">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-7 text-center font-mono text-[11px] text-cream/70">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="font-mono text-[8px] tracking-[0.15em] uppercase text-cream/20 hover:text-cream/50 transition-colors ml-auto"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-cream/5 px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cream/50">
                      Subtotal
                    </span>
                    <span className="font-mono text-[16px] text-cream/90">
                      {formatPrice(total())}
                    </span>
                  </div>
                  <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-cream/20 text-right">
                    Shipping & taxes calculated at checkout
                  </p>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="btn-drip w-full justify-center"
                  >
                    <span>View Cart</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
