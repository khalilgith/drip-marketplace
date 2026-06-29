"use client"

import { motion } from "framer-motion"
import { HeroBanner } from "@/components/store/HeroBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { ScrollReveal, revealItem, fadeSlideLeft, fadeSlideRight } from "@/components/store/ScrollReveal"
import { ArrowRight, ArrowUpRight, Shield, Sparkles, Package, Repeat } from "lucide-react"
import Link from "next/link"
import { useFeaturedProducts } from "@/lib/hooks/useProducts"
import { useBrands } from "@/lib/hooks/useBrands"

export default function HomePage() {
  const { products, loading: productsLoading } = useFeaturedProducts()
  const { brands } = useBrands(true)

  return (
    <>
      <HeroBanner />

      {/* ── Featured Products ─────────────────────────────────── */}
      <ScrollReveal className="bg-navy py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-14 lg:mb-16">
            <ScrollReveal direction="left" distance={24}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-3">
                Curated Selection
              </p>
              <h2 className="font-heading font-black text-[36px] lg:text-[52px] xl:text-[60px] uppercase leading-[0.9] tracking-tight text-cream">
                Featured<br />Products
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" distance={24} delay={0.15}>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-1.5 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-cream/35 hover:text-gold transition-colors group"
              >
                View All
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-cream/5 animate-pulse" />
                  <div className="h-2.5 w-16 bg-cream/5 animate-pulse" />
                  <div className="h-3 w-32 bg-cream/5 animate-pulse" />
                  <div className="h-2.5 w-20 bg-cream/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollReveal delay={0.25} duration={0.6}>
              <ProductGrid products={products} />
            </ScrollReveal>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/shop" className="btn-ghost">
              <span>View All Products</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Why DRIP ───────────────────────────────────────────── */}
      <section className="bg-navy border-t border-cream/5 py-24 lg:py-32 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-3">
              Why DRIP
            </p>
            <h2 className="font-heading font-black text-[30px] lg:text-[42px] uppercase leading-none tracking-tight text-cream">
              Built for the culture
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              { icon: Shield, title: "Authentic Only", desc: "Every item verified. No fakes, no knockoffs, no compromises." },
              { icon: Sparkles, title: "Limited Drops", desc: "Exclusive releases you won&apos;t find anywhere else. When it&apos;s gone, it&apos;s gone." },
              { icon: Package, title: "Premium Curation", desc: "Handpicked from the most sought-after brands across the globe." },
              { icon: Repeat, title: "Easy Returns", desc: "30-day hassle-free returns. Because fit should be perfect." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="text-center"
                custom={i}
                variants={revealItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 mx-auto mb-5 border border-cream/10 flex items-center justify-center bg-cream/3">
                  <item.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-heading font-bold text-[15px] uppercase tracking-wide text-cream mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-[12px] text-cream/35 leading-relaxed max-w-[220px] mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands Marquee ─────────────────────────────────────── */}
      {brands.length > 0 && (
        <ScrollReveal className="bg-navy border-t border-cream/5 py-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mb-12 text-center">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-3">
              Featured Brands
            </p>
            <h2 className="font-heading font-black text-[30px] lg:text-[42px] uppercase leading-none tracking-tight text-cream">
              The Labels Defining Streetwear
            </h2>
          </div>
          <div className="marquee">
            <div className="marquee-inner gap-10 px-6">
              {[...brands, ...brands].map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/brand/${brand.slug}`}
                  className="inline-flex items-center gap-5 group shrink-0"
                >
                  <div className="w-12 h-12 border border-cream/8 flex items-center justify-center group-hover:border-gold/40 transition-colors bg-cream/3">
                    <span className="font-heading font-black text-[16px] text-gold">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-heading font-black text-[18px] lg:text-[20px] uppercase tracking-tight text-cream/50 group-hover:text-cream transition-colors whitespace-nowrap">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ── Editorial CTA ───────────────────────────────────────── */}
      <ScrollReveal className="bg-cream relative overflow-hidden py-24 lg:py-32">
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 font-heading font-black leading-none select-none pointer-events-none text-navy/5"
          style={{ fontSize: "clamp(120px, 18vw, 240px)" }}
          aria-hidden="true"
        >
          01
        </span>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <ScrollReveal direction="left" distance={24}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-4">
                Join the Movement
              </p>
            </ScrollReveal>
            <ScrollReveal direction="left" distance={24} delay={0.1}>
              <h2 className="font-heading font-black text-[42px] sm:text-[56px] lg:text-[72px] xl:text-[88px] uppercase leading-[0.88] tracking-tight text-navy mb-6">
                Ready to<br />
                <span style={{ WebkitTextStroke: "2px #08080C", color: "transparent" }}>
                  Elevate?
                </span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" distance={24} delay={0.2}>
              <p className="font-body text-[13px] text-navy/45 max-w-sm leading-relaxed mb-10">
                Discover premium streetwear from the world&apos;s most sought-after brands.
                Limited drops. Zero compromises.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="left" distance={24} delay={0.3}>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/shop" className="btn-drip">
                  <span>Shop the Collection</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/shop?category=Women"
                  className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-navy/40 hover:text-navy transition-colors flex items-center gap-1.5 group"
                >
                  Explore Women
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="bg-navy border-t border-cream/5 py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold mb-3">
              Trusted by
            </p>
            <h2 className="font-heading font-black text-[30px] lg:text-[42px] uppercase leading-none tracking-tight text-cream">
              What our people say
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The quality is unreal. I've been buying sneakers for 15 years and nothing compares to the curation here.",
                name: "Marcus T.",
                role: "Verified Buyer",
              },
              {
                quote: "Finally a streetwear site that actually cares about authenticity. Every piece I've ordered has been flawless.",
                name: "Sarah K.",
                role: "VIP Member",
              },
              {
                quote: "Limited drops keep it exciting. I've copped some insane pieces that nobody else has. Love it.",
                name: "Jaylen R.",
                role: "Drop Notifications",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                className="border border-cream/8 p-8 bg-cream/3"
                custom={i}
                variants={revealItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-gold text-[10px]">★</span>
                  ))}
                </div>
                <p className="font-body text-[13px] text-cream/60 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-heading font-bold text-[13px] uppercase tracking-wide text-cream">
                    {testimonial.name}
                  </p>
                  <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-cream/25 mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
