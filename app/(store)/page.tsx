"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { HeroBanner } from "@/components/store/HeroBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useFeaturedProducts } from "@/lib/hooks/useProducts"
import { useBrands } from "@/lib/hooks/useBrands"

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

export default function HomePage() {
  const { products, loading: productsLoading } = useFeaturedProducts()
  const { brands }                              = useBrands(true)
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll reveal for non-Framer elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [products, brands])

  return (
    <>
      <HeroBanner />

      {/* ── Featured Products ─────────────────────────────────── */}
      <section ref={sectionRef} className="bg-navy py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="flex items-end justify-between mb-14 lg:mb-16">
            <div>
              <motion.p
                className="section-label mb-3"
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              >
                Curated Selection
              </motion.p>
              <motion.h2
                className="font-heading font-black text-[36px] lg:text-[52px] xl:text-[60px] uppercase leading-[0.9] tracking-tight text-cream"
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              >
                Featured<br />Products
              </motion.h2>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-1.5 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-cream/35 hover:text-gold transition-colors group"
              >
                View All
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProductGrid products={products} />
            </motion.div>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/shop" className="btn-ghost">
              <span>View All Products</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brands Marquee ─────────────────────────────────────── */}
      {brands.length > 0 && (
        <section className="bg-navy border-t border-cream/5 py-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mb-12 text-center">
            <motion.p
              className="section-label mb-3"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            >
              Featured Brands
            </motion.p>
            <motion.h2
              className="font-heading font-black text-[30px] lg:text-[42px] uppercase leading-none tracking-tight text-cream"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            >
              The Labels Defining Streetwear
            </motion.h2>
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
        </section>
      )}

      {/* ── Editorial CTA ───────────────────────────────────────── */}
      <section className="bg-cream relative overflow-hidden py-24 lg:py-32">
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 font-heading font-black leading-none select-none pointer-events-none text-navy/5"
          style={{ fontSize: "clamp(120px, 18vw, 240px)" }}
          aria-hidden="true"
        >
          01
        </span>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <motion.p
              className="section-label text-gold mb-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            >
              Join the Movement
            </motion.p>
            <motion.h2
              className="font-heading font-black text-[42px] sm:text-[56px] lg:text-[72px] xl:text-[88px] uppercase leading-[0.88] tracking-tight text-navy mb-6"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            >
              Ready to<br />
              <span style={{ WebkitTextStroke: "2px #08080C", color: "transparent" }}>
                Elevate?
              </span>
            </motion.h2>
            <motion.p
              className="font-body text-[13px] text-navy/45 max-w-sm leading-relaxed mb-10"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
            >
              Discover premium streetwear from the world&apos;s most sought-after brands.
              Limited drops. Zero compromises.
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}
            >
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
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
