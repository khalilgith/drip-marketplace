import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      itemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "drip-cart" }
  )
)
