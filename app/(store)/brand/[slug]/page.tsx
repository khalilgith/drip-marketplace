import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/store/ProductGrid"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface BrandPageProps {
  params: { slug: string }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const supabase = createClient()

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!brand) notFound()

  const { data: products } = await supabase
    .from("products")
    .select("*, brands(name, slug)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-48 bg-navy rounded flex items-center justify-center mb-6">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gold">
            {brand.name}
          </h1>
        </div>
        {brand.description && (
          <p className="text-gray-600 max-w-2xl">{brand.description}</p>
        )}
      </div>
      <ProductGrid products={(products as any) || []} />
    </div>
  )
}
