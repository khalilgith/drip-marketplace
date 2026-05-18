"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProductTable } from "@/components/admin/ProductTable"
import { ProductModal } from "@/components/admin/ProductModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ProductFormData } from "@/lib/validations/productSchema"
import { toast } from "sonner"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const supabase = createClient()

  const loadData = async () => {
    const { data: productsData } = await supabase
      .from("products")
      .select("*, brands(name)")
      .order("created_at", { ascending: false })
    setProducts(productsData || [])

    const { data: brandsData } = await supabase
      .from("brands")
      .select("id, name")
      .order("name")
    setBrands(brandsData || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", editingProduct.id)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Product updated")
      }
    } else {
      const { error } = await supabase.from("products").insert(data)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Product created")
      }
    }
    setModalOpen(false)
    setEditingProduct(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Product deleted")
      loadData()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Products</h1>
        <Button onClick={() => { setEditingProduct(null); setModalOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      <div className="bg-white border border-gray-200">
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product)
            setModalOpen(true)
          }}
          onDelete={handleDelete}
        />
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null) }}
        onSubmit={handleSubmit}
        defaultValues={editingProduct}
        brands={brands}
      />
    </div>
  )
}
