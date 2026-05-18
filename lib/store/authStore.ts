import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: "customer" | "brand_owner" | "admin"
}

interface AuthStore {
  user: User | null
  profile: Profile | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  isAdmin: () => get().profile?.role === "admin",
}))
