"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { productSchema, type ProductFormData } from "@/lib/validations/productSchema"

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
  defaultValues?: Partial<ProductFormData>
  brands: { id: string; name: string }[]
}

export function ProductModal({ open, onClose, onSubmit, defaultValues, brands }: ProductModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      category: "Men",
      stock: 0,
      featured: false,
    },
  })

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Modal open={open} onClose={onClose} title={defaultValues ? "Edit Product" : "Add Product"}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock")} />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" {...register("category")}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Accessories">Accessories</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="brand_id">Brand</Label>
          <Select id="brand_id" {...register("brand_id")}>
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          {errors.brand_id && <p className="text-red-500 text-xs mt-1">{errors.brand_id.message}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" {...register("featured")} />
          <Label htmlFor="featured">Featured product</Label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : defaultValues ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
