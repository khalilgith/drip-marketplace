import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  compare_price: z.coerce.number().positive().optional(),
  category: z.enum(["Men", "Women", "Accessories"]),
  sizes: z.array(z.string()).optional(),
  colors: z
    .array(z.object({ name: z.string(), hex: z.string() }))
    .optional(),
  images: z.array(z.string()).optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  brand_id: z.string().uuid(),
})

export type ProductFormData = z.infer<typeof productSchema>
