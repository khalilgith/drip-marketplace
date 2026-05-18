"use client"

import Link from "next/link"
import { ShoppingBag, User, Menu, X, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cartStore"
import { CartDrawer } from "./CartDrawer"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const itemCount = useCartStore((s) => s.itemCount())
  const router = useRouter()

  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <nav className="bg-navy text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="text-2xl font-heading font-bold tracking-wider text-gold">
                DRIP
              </Link>
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/shop" className="text-sm hover:text-gold transition-colors">
                  Shop
                </Link>
                <Link href="/shop?category=Men" className="text-sm hover:text-gold transition-colors">
                  Men
                </Link>
                <Link href="/shop?category=Women" className="text-sm hover:text-gold transition-colors">
                  Women
                </Link>
                <Link href="/shop?category=Accessories" className="text-sm hover:text-gold transition-colors">
                  Accessories
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold">
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:text-gold relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <Link href="/account" className="p-2 hover:text-gold">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-700 bg-navy py-4">
            <div className="max-w-3xl mx-auto px-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-gray-800 text-white border border-gray-600 px-4 py-2 text-sm focus:outline-none focus:border-gold"
                  autoFocus
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-16 left-0 w-64 bg-navy h-full p-6 z-40">
            <div className="flex flex-col gap-4">
              <Link href="/shop" className="text-white hover:text-gold" onClick={() => setMobileOpen(false)}>
                Shop All
              </Link>
              <Link href="/shop?category=Men" className="text-white hover:text-gold" onClick={() => setMobileOpen(false)}>
                Men
              </Link>
              <Link href="/shop?category=Women" className="text-white hover:text-gold" onClick={() => setMobileOpen(false)}>
                Women
              </Link>
              <Link href="/shop?category=Accessories" className="text-white hover:text-gold" onClick={() => setMobileOpen(false)}>
                Accessories
              </Link>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
