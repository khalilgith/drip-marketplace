"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useWishlistStore } from "@/lib/store/wishlistStore"
import { useAuthStore } from "@/lib/store/authStore"

/**
 * Mounts once in the root layout.
 * - Listens to Supabase auth state and syncs it to the Zustand auth store.
 * - When a user signs in, pulls their server-side wishlist into local state.
 * - When a user signs out, clears local wishlist.
 */
export function AuthSync() {
  const { setUser, setProfile } = useAuthStore()
  const { add, items } = useWishlistStore()
  const supabase = createClient()

  useEffect(() => {
    // Bootstrap: get current session on mount
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        await syncProfile(user.id)
        await syncWishlist(user.id)
      }
    })

    // Live subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null
      setUser(user)

      if (user) {
        await syncProfile(user.id)
        if (event === "SIGNED_IN") await syncWishlist(user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line

  async function syncProfile(userId: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (data) setProfile(data)
  }

  async function syncWishlist(userId: string) {
    const { data } = await supabase
      .from("wishlists")
      .select("product_id, products(id, name, price, images, brands(name))")
      .eq("user_id", userId)
    if (!data) return

    data.forEach((row: any) => {
      const p = row.products
      if (!p) return
      add({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] ?? "",
        brand: p.brands?.name,
      })
    })
  }

  return null
}
