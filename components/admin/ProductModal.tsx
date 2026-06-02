"use client"

import { useCallback, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { productSchema, type ProductFormData } from "@/lib/validations/productSchema"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
  defaultValues?: Partial<ProductFormData>
  brands: { id: string; name: string }[]
}

export function ProductModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
  brands,
}: ProductModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      category: "Men",
      stock: 0,
      featured: false,
      images: [],
    },
  })

  // Image state — derived from form field so validation stays in sync
  const images: string[] = watch("images") || []

  const [uploadingCount, setUploadingCount] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data)
    reset()
  }

  // ── Upload helpers ──────────────────────────────────────────────────────────

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`)
        return
      }

      setUploadingCount((c) => c + 1)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }))
          toast.error(err.error ?? "Upload failed")
          return
        }

        const { url } = (await res.json()) as { url: string }
        setValue("images", [...(watch("images") || []), url], {
          shouldValidate: true,
        })
        toast.success("Image uploaded")
      } catch {
        toast.error("Network error — upload failed")
      } finally {
        setUploadingCount((c) => c - 1)
      }
    },
    [setValue, watch]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(uploadFile)
    // Reset input so the same file can be re-selected if needed
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(uploadFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const removeImage = (url: string) => {
    setValue(
      "images",
      (watch("images") || []).filter((u) => u !== url),
      { shouldValidate: true }
    )
  }

  const isUploading = uploadingCount > 0

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={defaultValues ? "Edit Product" : "Add Product"}
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock")} />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" {...register("category")}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Accessories">Accessories</option>
          </Select>
        </div>

        {/* Brand */}
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
          {errors.brand_id && (
            <p className="text-red-500 text-xs mt-1">{errors.brand_id.message}</p>
          )}
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" {...register("featured")} />
          <Label htmlFor="featured">Featured product</Label>
        </div>

        {/* ── Product Images ──────────────────────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Product Images</Label>
            {images.length > 0 && (
              <span className="text-xs text-gray-400 font-mono">
                {images.length} image{images.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Existing thumbnails */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="group relative h-20 w-20 overflow-hidden rounded border border-gray-200 bg-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Product image ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}

              {/* Uploading placeholder(s) */}
              {Array.from({ length: uploadingCount }).map((_, i) => (
                <div
                  key={`uploading-${i}`}
                  className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={[
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed p-6 transition-colors",
              isDragOver
                ? "border-[#C9A84C] bg-[#C9A84C]/5"
                : "border-gray-300 bg-gray-50 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/5",
            ].join(" ")}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
                <p className="text-xs text-gray-500 font-body">
                  Uploading {uploadingCount} file{uploadingCount !== 1 ? "s" : ""}…
                </p>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {images.length === 0 ? (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {images.length === 0 ? "Upload images" : "Add more images"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Drag &amp; drop or click to browse
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload button (alternative to clicking the drop zone) */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-3.5 w-3.5" />
                Choose Files
              </>
            )}
          </Button>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting
              ? "Saving…"
              : isUploading
              ? "Wait for upload…"
              : defaultValues
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
