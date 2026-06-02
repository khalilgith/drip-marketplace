"use client"

import Link from "next/link"
import { ShoppingBag, User, Search, X, Menu, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/store/cartStore"
import { useWishlistStore } from "@/lib/store/wishlistStore"
import { CartDrawer } from "./CartDrawer"
import { useRouter } from "next/navigation"

const NAV_LINKS = [
  { href: "/shop",                    label: "Shop"        },
  { href: "/shop?category=Men",       label: "Men"         },
  { href: "/shop?category=Women",     label: "Women"       },
  { href: "/shop?category=Accessories", label: "Accessories" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [cartOpen,   setCartOpen]     = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [scrolled,   setScrolled]     = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const itemCount      = useCartStore((s) => s.itemCount())
  const wishlistCount  = useWishlistStore((s) => s.count())
  const router    = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav ${scrolled ? "scrolled" : ""}`}>

        {/* ── Main bar ─────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[68px]">

            {/* Left: mobile toggle + logo */}
            <div className="flex items-center gap-6 lg:gap-10">
              <button
                className="lg:hidden p-1.5 text-cream/50 hover:text-cream transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen
                  ? <X className="h-4 w-4" />
                  : <Menu className="h-4 w-4" />}
              </button>

              <Link
                href="/"
                className="font-heading font-black text-[22px] tracking-[0.2em] uppercase"
              >
                <span className="text-gold-gradient">DRIP</span>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-cream/50 hover:text-cream transition-colors duration-300 group py-1"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gold transition-all duration-400 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-cream/40 hover:text-cream transition-colors rounded-full hover:bg-cream/5"
                aria-label="Search"
              >
                <Search className="h-[15px] w-[15px]" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-cream/40 hover:text-cream transition-colors rounded-full hover:bg-cream/5"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[15px] w-[15px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[9px] font-bold font-mono rounded-none h-4 w-4 flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 text-cream/40 hover:text-cream transition-colors rounded-full hover:bg-cream/5"
                aria-label="Wishlist"
              >
                <Heart className="h-[15px] w-[15px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[9px] font-bold font-mono rounded-none h-4 w-4 flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="p-2.5 text-cream/40 hover:text-cream transition-colors rounded-full hover:bg-cream/5"
                aria-label="Account"
              >
                <User className="h-[15px] w-[15px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Search bar ───────────────────────────────────────────── */}
        {searchOpen && (
          <div className="border-t border-cream/5 bg-navy/98">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-5">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search className="h-3.5 w-3.5 text-cream/25 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  autoFocus
                  className="flex-1 bg-transparent text-cream text-[13px] font-body placeholder:text-cream/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-cream/30 hover:text-cream transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[68px]" />

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[68px] left-0 w-72 h-full bg-navy border-r border-cream/5 p-8 z-40">
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-semibold text-[10px] tracking-[0.2em] uppercase text-cream/45 hover:text-cream transition-colors py-4 border-b border-cream/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6">
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="btn-drip"
                >
                  <span>Shop All</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
