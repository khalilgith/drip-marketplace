import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative bg-navy text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)",
        }}
      />
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
        <div className="max-w-xl">
          <p className="text-gold font-medium tracking-widest text-sm uppercase mb-4">
            New Season Collection
          </p>
          <h1 className="text-5xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            Define Your
            <br />
            <span className="text-gold">Style</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Premium streetwear and footwear curated for those who refuse to blend in.
          </p>
          <div className="flex gap-4">
            <Link href="/shop">
              <Button size="lg">Shop Now</Button>
            </Link>
            <Link href="/shop?category=Men">
              <Button variant="secondary" size="lg">
                Explore Men
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
