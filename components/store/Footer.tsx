"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowRight, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success("Subscribed to newsletter!")
      setEmail("")
    }
  }

  return (
    <footer className="bg-navy text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-16 border-b border-white/5">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">Stay in the Loop</h3>
            <p className="text-sm text-white/40 mb-6">Be the first to know about new drops, exclusive releases, and early access.</p>
            <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/5 text-white border border-white/10 px-5 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/20"
              />
              <button
                type="submit"
                className="px-6 bg-gold text-white hover:bg-gold/90 transition-colors flex items-center justify-center group"
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-3xl font-heading font-bold tracking-[0.15em] text-gold-gradient">
              DRIP
            </Link>
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              Premium streetwear and footwear curated for those who refuse to blend in.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=Men", label: "Men" },
                { href: "/shop?category=Women", label: "Women" },
                { href: "/shop?category=Accessories", label: "Accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Support</h4>
            <ul className="space-y-3">
              {["Contact", "Shipping", "Returns", "FAQ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Connect</h4>
            <ul className="space-y-3">
              {["Instagram", "Twitter / X", "TikTok", "YouTube"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} DRIP. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
