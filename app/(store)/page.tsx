"use client"

import { useEffect, useRef, useState } from "react"
import { HeroBanner } from "@/components/store/HeroBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { BrandCard } from "@/components/store/BrandCard"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data?.filter((p: any) => p.featured) || []))
      .catch(() => {})

    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => setBrands(data?.filter((b: any) => b.featured) || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.15 }
    )

    const reveals = document.querySelectorAll(".reveal")
    reveals?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [products, brands])

  return (
    <>
      <HeroBanner />

      {/* Featured Products */}
      <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-gold text-xs tracking-[0.2em] uppercase font-semibold mb-3 reveal">
              Curated Selection
            </p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold reveal reveal-delay-1">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm text-navy/60 hover:text-gold transition-colors group reveal reveal-delay-2"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="reveal reveal-delay-2">
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Brands Marquee */}
      {brands.length > 0 && (
        <section className="bg-navy py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <p className="text-gold text-xs tracking-[0.2em] uppercase font-semibold text-center reveal">
              Featured Brands
            </p>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white text-center mt-3 reveal reveal-delay-1">
              The Labels Defining Streetwear
            </h2>
          </div>
          <div className="marquee">
            <div className="marquee-inner gap-8 px-4">
              {[...brands, ...brands].map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/brand/${brand.slug}`}
                  className="inline-flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors border border-white/10">
                    <span className="text-gold text-xl font-heading font-bold">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-heading font-semibold text-lg group-hover:text-gold transition-colors">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="text-white/40 text-xs mt-0.5">{brand.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-cream py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold text-xs tracking-[0.2em] uppercase font-semibold mb-4 reveal">
            Join the Movement
          </p>
          <h2 className="text-4xl lg:text-6xl font-heading font-bold leading-tight reveal reveal-delay-1">
            Ready to Elevate
            <br />
            <span className="text-gold-gradient">Your Wardrobe?</span>
          </h2>
          <p className="text-navy/50 mt-6 max-w-lg mx-auto reveal reveal-delay-2">
            Discover premium streetwear from the world&apos;s most sought-after brands.
          </p>
          <div className="mt-10 reveal reveal-delay-3">
            <Link href="/shop">
              <Button size="lg" className="btn-shimmer group">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
