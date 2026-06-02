"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowUpRight } from "lucide-react"

const SHOP_LINKS    = ["/shop", "/shop?category=Men", "/shop?category=Women", "/shop?category=Accessories"]
const SHOP_LABELS   = ["All Products", "Men", "Women", "Accessories"]
const SUPPORT       = ["Contact", "Shipping & Returns", "Size Guide", "FAQ"]
const CONNECT       = ["Instagram", "Twitter / X", "TikTok", "YouTube"]

export function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success("You're in. Welcome to DRIP.")
    setEmail("")
  }

  return (
    <footer className="bg-navy border-t border-cream/5">

      {/* ── Newsletter ─────────────────────────────────────────────── */}
      <div className="border-b border-cream/5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-3">
                Join the Movement
              </p>
              <h3 className="font-heading font-black text-[28px] lg:text-[36px] uppercase leading-none text-cream tracking-tight">
                Stay First to Know
              </h3>
            </div>
            <form
              onSubmit={handleNewsletter}
              className="flex items-stretch gap-0 max-w-sm w-full lg:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-cream/5 text-cream border border-cream/10 border-r-0 px-5 py-3.5 font-body text-[12px] placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button
                type="submit"
                className="px-5 bg-gold text-navy font-body text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-volt transition-colors flex items-center gap-1.5 shrink-0"
              >
                Subscribe
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Links grid ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span className="font-heading font-black text-[24px] tracking-[0.2em] uppercase text-gold-gradient">
                DRIP
              </span>
            </Link>
            <p className="font-body text-[12px] text-cream/30 leading-relaxed max-w-[200px]">
              Premium streetwear and footwear for those who refuse to blend in.
            </p>

            {/* Social — text style (editorial) */}
            <div className="flex items-center gap-5 mt-6">
              {["IG", "X", "TT", "YT"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/25 hover:text-gold transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono text-[9px] tracking-[0.28em] uppercase text-cream/35 mb-5">Shop</h4>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map((href, i) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[12px] text-cream/45 hover:text-cream transition-colors"
                  >
                    {SHOP_LABELS[i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-[9px] tracking-[0.28em] uppercase text-cream/35 mb-5">Support</h4>
            <ul className="space-y-3.5">
              {SUPPORT.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-body text-[12px] text-cream/45 hover:text-cream transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-[9px] tracking-[0.28em] uppercase text-cream/35 mb-5">Connect</h4>
            <ul className="space-y-3.5">
              {CONNECT.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-body text-[12px] text-cream/45 hover:text-cream transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────── */}
      <div className="border-t border-cream/5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/20">
            © {new Date().getFullYear()} DRIP. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-mono text-[9px] tracking-[0.18em] uppercase text-cream/20 hover:text-cream/50 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
