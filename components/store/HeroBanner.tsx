"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex flex-col">

      {/* ── Ambient orbs ─────────────────────────────────────────── */}
      <div className="hero-bg pointer-events-none">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      {/* ── Main split layout ────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 min-h-screen">

        {/* LEFT — typography */}
        <div className="relative flex flex-col justify-end pb-20 lg:pb-28 px-6 sm:px-10 lg:px-16 xl:px-20 pt-36 w-full lg:w-[58%] xl:w-[55%]">

          {/* Season label */}
          <div className="hero-clip mb-6 lg:mb-8">
            <span className="hero-text hero-d0 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-gold" />
              <span className="font-mono text-[9px] tracking-[0.32em] text-gold uppercase">
                SS &apos;26 — Collection 01
              </span>
            </span>
          </div>

          {/* Heading — three stacked lines */}
          <h1 className="font-heading font-black leading-[0.87] tracking-[-0.01em] mb-8 lg:mb-10">
            <span className="hero-clip block">
              <span className="hero-text hero-d1 block text-[20vw] sm:text-[16vw] lg:text-[11.5vw] text-cream uppercase">
                DEFINE
              </span>
            </span>
            <span className="hero-clip block">
              <span className="hero-text hero-d2 block text-[20vw] sm:text-[16vw] lg:text-[11.5vw] text-volt uppercase tracking-[0.06em]">
                YOUR
              </span>
            </span>
            <span className="hero-clip block">
              <span className="hero-text hero-d3 block text-[20vw] sm:text-[16vw] lg:text-[11.5vw] text-cream uppercase">
                STYLE
              </span>
            </span>
          </h1>

          {/* Divider */}
          <div className="w-14 h-[1px] bg-gold hero-line-grow mb-6 lg:mb-8 origin-left" />

          {/* Tagline */}
          <p className="hero-fade hero-fade-0 font-body text-cream/45 text-[13px] lg:text-[14px] max-w-xs leading-relaxed mb-8 lg:mb-10">
            Premium streetwear and footwear curated for those who refuse to blend in.
          </p>

          {/* CTAs */}
          <div className="hero-fade hero-fade-1 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-drip">
              <span>Shop Now</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/shop?category=Men"
              className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-cream/50 hover:text-gold transition-colors duration-300 flex items-center gap-1.5 group"
            >
              Explore Men
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Brand row */}
          <div className="hero-fade hero-fade-2 absolute bottom-8 left-6 sm:left-10 lg:left-16 xl:left-20 flex items-center gap-5 lg:gap-7">
            {["Nike", "Adidas", "Off-White", "Jordan", "+ more"].map((b, i, a) => (
              <span key={b} className="flex items-center gap-5 lg:gap-7">
                <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-cream/18">
                  {b}
                </span>
                {i < a.length - 1 && (
                  <span className="w-3 h-[1px] bg-cream/12" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — editorial image (desktop only) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[44%] xl:w-[47%] overflow-hidden">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1771711286856-765bdbca923f?w=1000&q=90"
            alt="Jordan 1 Retro High OG streetwear style"
            className="w-full h-full object-cover object-[center_30%] hero-image-enter"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-navy/20" />

          {/* Drop count badge */}
          <div className="absolute top-10 right-8 xl:right-12 hero-fade hero-fade-1">
            <div className="border border-cream/12 p-4 xl:p-5 bg-navy/40 backdrop-blur-sm">
              <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-cream/40 mb-1.5">
                New Arrivals
              </p>
              <p className="font-heading font-black text-[36px] xl:text-[44px] leading-none text-cream">
                48+
              </p>
              <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-gold mt-1">
                Items Dropped
              </p>
            </div>
          </div>

          {/* Second floating image */}
          <div className="absolute bottom-16 right-8 xl:right-12 w-32 xl:w-40 hero-fade hero-fade-2">
            <img
              src="https://images.unsplash.com/photo-1771445653477-8af04719436e?w=400&q=80"
              alt="Air Jordan 1 Retro High OG close-up"
              className="w-full aspect-[3/4] object-cover opacity-70"
            />
          </div>
        </div>
      </div>

      {/* ── Ticker bar ───────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-cream/5 bg-navy/80 backdrop-blur-sm py-3 overflow-hidden">
        <div className="marquee-inner gap-10 px-6 text-[9px] font-mono tracking-[0.3em] uppercase text-cream/25">
          {Array.from({ length: 4 }).flatMap(() =>
            ["Nike", "—", "Adidas", "—", "Off-White", "—", "Jordan", "—",
             "Kith", "—", "Supreme", "—", "Stüssy", "—", "Palace", "—",
             "New Balance", "—", "Carhartt WIP", "—"].map((item, i) => (
              <span key={i} className={item === "—" ? "text-cream/10" : "hover:text-gold transition-colors"}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
