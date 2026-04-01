import { z } from "zod"

/** Payload for order confirmation / shipped emails (matches OrderEmailData shape). */
export const orderEmailPayloadSchema = z.object({
  orderNumber: z.string().min(1).max(100),
  customerName: z.string().max(200).optional(),
  customerEmail: z.string().email().max(320),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number(),
        price: z.number(),
        size: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        image: z.string().optional().nullable(),
      })
    )
    .optional(),
  subtotal: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number().optional(),
  shippingAddress: z
    .object({
      name: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional().nullable(),
      city: z.string().optional(),
      state: z.string().optional().nullable(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  trackingNumber: z.string().max(200).optional(),
  trackingUrl: z.string().max(2000).optional(),
})
