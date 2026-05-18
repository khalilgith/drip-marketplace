"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductDetailClient } from "./ProductDetailClient"

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((products) => {
        const found = products.find((p: any) => p.id === params.id)
        if (found) {
          setProduct(found)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
  }, [params.id])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold">Product not found</h1>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
