import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { ProductDetailClient } from "./ProductDetailClient"
import { ReviewSection } from "@/components/store/ReviewSection"

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface PageProps {
  params: { id: string }
}

/* ─── Metadata ──────────────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images")
    .eq("id", params.id)
    .single()

  if (!product) {
    return { title: "Product Not Found — DRIP" }
  }

  return {
    title: `${product.name} — DRIP`,
    description: product.description ?? undefined,
    openGraph: {
      title: `${product.name} — DRIP`,
      description: product.description ?? undefined,
      images: Array.isArray(product.images) ? product.images : [],
    },
  }
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default async function ProductPage({ params }: PageProps) {
  const supabase = createClient()

  // Fetch product server-side for SEO + performance
  const { data: product, error } = await supabase
    .from("products")
    .select("*, brands(name, slug)")
    .eq("id", params.id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Check if the current user is authenticated (non-blocking)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Prefetch reviews server-side using service client (no RLS restrictions)
  const serviceSupabase = createServiceClient()
  const { data: initialReviews } = await serviceSupabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("product_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <ProductDetailClient product={product} />
      <ReviewSection
        productId={params.id}
        initialReviews={initialReviews ?? []}
        isLoggedIn={!!user}
      />
    </>
  )
}
