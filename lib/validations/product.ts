import { z } from "zod"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(slugRegex, "Invalid slug format"),
  price: z.coerce.number().min(0),
  category: z.string().min(1).max(100),
  description: z.string().max(5000).nullable().optional(),
  artist_id: z.string().uuid().nullable().optional(),
  sizes: z.array(z.string()).nullable().optional(),
  colors: z.array(z.string()).nullable().optional(),
  stock_quantity: z.coerce.number().int().min(0).optional(),
  low_stock_threshold: z.coerce.number().int().min(0).optional(),
  image_urls: z.array(z.string().max(2000)).nullable().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
})

export const productUpdateSchema = productCreateSchema.partial()

export type ProductCreateInput = z.infer<typeof productCreateSchema>
