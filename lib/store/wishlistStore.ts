import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  brand?: string
}

interface WishlistStore {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: string) => void
  toggle: (item: WishlistItem) => void
  has: (id: string) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (!get().has(item.id)) {
          set({ items: [...get().items, item] })
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggle: (item) => {
        if (get().has(item.id)) get().remove(item.id)
        else get().add(item)
      },
      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "drip-wishlist" }
  )
)
