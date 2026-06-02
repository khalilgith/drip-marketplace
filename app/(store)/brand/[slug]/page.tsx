import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { BrandProductGrid } from "./BrandProductGrid"

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  approved: boolean
  featured: boolean
}

interface PageProps {
  params: { slug: string }
}

/* ─── Metadata ──────────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: brand } = await supabase
    .from("brands")
    .select("name, description")
    .eq("slug", params.slug)
    .eq("approved", true)
    .single()

  if (!brand) {
    return { title: "Brand Not Found — DRIP" }
  }

  return {
    title: `${brand.name} — DRIP`,
    description:
      brand.description ??
      `Shop the full ${brand.name} collection on DRIP.`,
  }
}

/* ─── Server component ──────────────────────────────────────────────────────── */
export default async function BrandPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", params.slug)
    .eq("approved", true)
    .single<Brand>()

  if (!brand) notFound()

  /* Grab product count server-side */
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id)

  const productCount = count ?? 0

  /* Large decorative letter for hero background */
  const heroLetter = brand.name.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen">

      {/* ── Back link ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-ash hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Shop
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden mt-4" style={{ minHeight: 320 }}>

        {/* Banner image or gradient fallback */}
        {brand.banner_url ? (
          <div className="absolute inset-0">
            <Image
              src={brand.banner_url}
              alt={`${brand.name} banner`}
              fill
              className="object-cover"
              priority
            />
            {/* Dark veil */}
            <div className="absolute inset-0 bg-navy/70" />
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 120% 80% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%), #08080C",
              }}
            />
            {/* Ambient glows */}
            <div className="absolute top-[-40%] left-[-10%] w-[55%] h-[55%] rounded-full bg-gold/4 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-30%] right-[-8%] w-[40%] h-[40%] rounded-full bg-volt/3 blur-[120px] pointer-events-none" />
          </div>
        )}

        {/* Giant background letter */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-heading font-black text-cream/[0.03] leading-none"
            style={{ fontSize: "clamp(14rem, 28vw, 26rem)", letterSpacing: "-0.04em" }}
          >
            {heroLetter}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-5">

          {/* Logo */}
          {brand.logo_url && (
            <div className="w-16 h-16 relative mb-2">
              <Image
                src={brand.logo_url}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Brand name */}
          <h1
            className="font-heading font-black text-cream tracking-tight uppercase leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            {brand.name}
          </h1>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-1">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-2xl font-bold text-gold leading-none">
                {productCount}
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-ash">
                {productCount === 1 ? "Product" : "Products"}
              </span>
            </div>
            {brand.featured && (
              <>
                <div className="w-px h-8 bg-cream/10" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-heading text-2xl font-bold text-volt leading-none">★</span>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-ash">
                    Featured
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          {brand.description && (
            <p className="font-body text-sm text-ash max-w-lg leading-relaxed mt-1">
              {brand.description}
            </p>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-cream/5" />

      {/* ── Product grid (client component) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-heading font-bold text-xl uppercase tracking-wide text-cream/90">
            Collection
          </h2>
          <div className="flex-1 h-px bg-cream/5" />
          <span className="font-mono text-[10px] text-ash tracking-widest uppercase">
            {productCount} {productCount === 1 ? "item" : "items"}
          </span>
        </div>

        <BrandProductGrid brandSlug={params.slug} />
      </section>
    </div>
  )
}
