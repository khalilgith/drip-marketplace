import { HeroBanner } from "@/components/store/HeroBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { BrandCard } from "@/components/store/BrandCard"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = createClient()

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, brands(name, slug)")
    .eq("featured", true)
    .limit(8)

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("approved", true)
    .eq("featured", true)
    .limit(4)

  return (
    <>
      <HeroBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold">Featured Products</h2>
          <p className="text-gray-500 mt-2">Our most wanted pieces right now.</p>
        </div>
        <ProductGrid products={(featuredProducts as any) || []} />
      </section>

      {brands && brands.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold">Featured Brands</h2>
              <p className="text-gray-500 mt-2">The labels defining streetwear culture.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
