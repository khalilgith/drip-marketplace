"use client"

import Link from "next/link"
import { ShoppingBag, User, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cartStore"
import { CartDrawer } from "./CartDrawer"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const itemCount = useCartStore((s) => s.itemCount())
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
      <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-10">
              <button
                className="lg:hidden p-2 text-white/70 hover:text-gold transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link href="/" className="text-3xl font-heading font-bold tracking-[0.15em] text-gold-gradient">
                DRIP
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                {[
                  { href: "/shop", label: "Shop" },
                  { href: "/shop?category=Men", label: "Men" },
                  { href: "/shop?category=Women", label: "Women" },
                  { href: "/shop?category=Accessories", label: "Accessories" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-all duration-300 tracking-wider uppercase relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-white/70 hover:text-gold transition-colors rounded-full hover:bg-white/5"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-white/70 hover:text-gold transition-colors rounded-full hover:bg-white/5 relative"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <Link
                href="/account"
                className="p-2.5 text-white/70 hover:text-gold transition-colors rounded-full hover:bg-white/5"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/5 bg-navy/95 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-white/5 text-white border border-white/10 px-5 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/20"
                  autoFocus
                />
                <Button type="submit" size="sm" className="btn-shimmer">
                  Search
                </Button>
              </form>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-20 left-0 w-72 h-full bg-navy/95 backdrop-blur-xl border-r border-white/5 p-8 z-40">
            <div className="flex flex-col gap-1">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?category=Men", label: "Men" },
                { href: "/shop?category=Women", label: "Women" },
                { href: "/shop?category=Accessories", label: "Accessories" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:text-gold py-3 text-sm tracking-wider uppercase transition-colors border-b border-white/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
