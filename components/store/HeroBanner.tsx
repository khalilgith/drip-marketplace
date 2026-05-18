"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const reveals = sectionRef.current?.querySelectorAll(".reveal")
    reveals?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex items-center bg-navy text-white overflow-hidden">
      <div className="hero-bg">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
        <img
          src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"
          alt=""
          className="floating-image"
          loading="lazy"
        />
        <img
          src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"
          alt=""
          className="floating-image"
          loading="lazy"
        />
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80"
          alt=""
          className="floating-image"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="reveal">
            <p className="text-gold font-medium tracking-[0.2em] text-sm uppercase mb-6 inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold" />
              New Season Collection
            </p>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-[0.95]">
            <span className="hero-title-line"><span>Define Your</span></span>
            <span className="hero-title-line"><span className="text-gold-gradient">Style</span></span>
          </h1>

          <div className="reveal reveal-delay-1">
            <p className="text-white/60 text-lg mb-10 max-w-md leading-relaxed">
              Premium streetwear and footwear curated for those who refuse to blend in.
            </p>
          </div>

          <div className="reveal reveal-delay-2 flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="lg" className="btn-shimmer group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop?category=Men">
              <Button variant="secondary" size="lg">
                Explore Men
              </Button>
            </Link>
          </div>

          <div className="reveal reveal-delay-3 mt-16 flex items-center gap-8 text-white/40 text-xs tracking-widest uppercase">
            <span>Nike</span>
            <span className="w-4 h-[1px] bg-white/20" />
            <span>Adidas</span>
            <span className="w-4 h-[1px] bg-white/20" />
            <span>Off-White</span>
            <span className="w-4 h-[1px] bg-white/20" />
            <span>+ more</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-20" />
    </section>
  )
}
