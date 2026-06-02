import { notFound } from "next/navigation"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { ProductDetailClient } from "./ProductDetailClient"
import { ReviewSection } from "@/components/store/ReviewSection"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*, brands(name, slug)")
    .eq("id", params.id)
    .single()

  if (error || !product) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()

  const svc = createServiceClient()
  const { data: initialReviews } = await svc
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

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from("products")
    .select("name, description, images")
    .eq("id", params.id)
    .single()

  if (!data) return { title: "Product Not Found" }

  return {
    title: data.name,
    description: data.description ?? undefined,
    openGraph: {
      images: Array.isArray(data.images) ? data.images : [],
    },
  }
}
