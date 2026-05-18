import { z } from "zod"

export const orderSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  customer_email: z.string().email("Invalid email"),
  items: z.array(
    z.object({
      product_id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      size: z.string(),
      color: z.string(),
    })
  ),
  subtotal: z.number().positive(),
  shipping: z.number().default(0),
  total: z.number().positive(),
  shipping_address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
})

export type OrderFormData = z.infer<typeof orderSchema>
