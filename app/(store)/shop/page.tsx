import { createServiceClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/store/ProductGrid"
import { FilterSidebar } from "@/components/store/FilterSidebar"

export const dynamic = "force-dynamic"

interface ShopPageProps {
  searchParams: {
    category?: string
    brand?: string
    search?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createServiceClient()

  let productQuery = supabase
    .from("products")
    .select("*, brands(name, slug)")
    .order("created_at", { ascending: false })

  if (searchParams.category) {
    productQuery = productQuery.eq("category", searchParams.category)
  }
  if (searchParams.brand) {
    productQuery = productQuery.eq("brands.slug", searchParams.brand)
  }
  if (searchParams.search) {
    productQuery = productQuery.ilike("name", `%${searchParams.search}%`)
  }

  const { data: products } = await productQuery

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("approved", true)
    .order("name")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">
          {searchParams.category || "All Products"}
        </h1>
        {searchParams.search && (
          <p className="text-gray-500 mt-1">Search results for &ldquo;{searchParams.search}&rdquo;</p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar brands={(brands as any) || []} />
        <div className="flex-1">
          <ProductGrid products={(products as any) || []} />
        </div>
      </div>
    </div>
  )
}
