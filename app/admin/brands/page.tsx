"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BrandTable } from "@/components/admin/BrandTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "" })
  const supabase = createClient()

  const loadBrands = async () => {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("name")
    setBrands(data || [])
  }

  useEffect(() => { loadBrands() }, [])

  const openEdit = (brand: any) => {
    setEditingBrand(brand)
    setForm({ name: brand.name, slug: brand.slug, description: brand.description || "" })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (editingBrand) {
      const { error } = await supabase
        .from("brands")
        .update(form)
        .eq("id", editingBrand.id)
      if (error) { toast.error(error.message) } else { toast.success("Brand updated") }
    } else {
      const { error } = await supabase.from("brands").insert(form)
      if (error) { toast.error(error.message) } else { toast.success("Brand created") }
    }
    setModalOpen(false)
    setEditingBrand(null)
    setForm({ name: "", slug: "", description: "" })
    loadBrands()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("brands").delete().eq("id", id)
    if (error) { toast.error(error.message) } else { toast.success("Brand deleted"); loadBrands() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Brands</h1>
        <Button onClick={() => { setEditingBrand(null); setForm({ name: "", slug: "", description: "" }); setModalOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Brand
        </Button>
      </div>
      <div className="bg-white border border-gray-200">
        <BrandTable brands={brands} onEdit={openEdit} onDelete={handleDelete} />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingBrand ? "Edit Brand" : "Add Brand"}>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingBrand ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
