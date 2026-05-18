import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BrandCardProps {
  brand: {
    id: string
    name: string
    slug: string
    description: string | null
    logo_url: string | null
    banner_url: string | null
  }
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brand/${brand.slug}`}>
      <Card className="group h-full">
        <div className="aspect-[3/2] bg-gray-100 overflow-hidden">
          {brand.banner_url ? (
            <img
              src={brand.banner_url}
              alt={brand.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy">
              <span className="text-gold text-3xl font-heading font-bold">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-heading font-bold text-lg">{brand.name}</h3>
          {brand.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{brand.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
