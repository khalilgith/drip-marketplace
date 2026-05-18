import { createClient } from "@/lib/supabase/server"
import { ProductDetailClient } from "./ProductDetailClient"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, brands(*), reviews(*, profiles(full_name))")
    .eq("id", params.id)
    .single()

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold">Product not found</h1>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
