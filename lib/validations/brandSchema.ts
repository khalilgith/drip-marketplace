import { z } from "zod"

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  banner_url: z.string().url().optional().or(z.literal("")),
  approved: z.boolean().default(false),
  featured: z.boolean().default(false),
})

export type BrandFormData = z.infer<typeof brandSchema>
