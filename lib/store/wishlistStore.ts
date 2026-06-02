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
  toggle: (item: WishlistItem, userId?: string) => void
  has: (id: string) => boolean
  count: () => number
}

async function syncToSupabase(action: "add" | "remove", productId: string, userId: string) {
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (action === "add") {
      await supabase.from("wishlists").upsert({ user_id: userId, product_id: productId })
    } else {
      await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId)
    }
  } catch {
    // Silently fail — localStorage state is source of truth for UX
  }
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
      toggle: (item, userId?: string) => {
        const inList = get().has(item.id)
        if (inList) {
          get().remove(item.id)
          if (userId) syncToSupabase("remove", item.id, userId)
        } else {
          get().add(item)
          if (userId) syncToSupabase("add", item.id, userId)
        }
      },
      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "drip-wishlist" }
  )
)
