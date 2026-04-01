import { z } from "zod"

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  size: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
})

const customerSchema = z.object({
  email: z.string().email().max(320),
  name: z.string().min(1).max(200),
  phone: z.string().max(50).optional().nullable(),
})

const shippingSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().nullable(),
  addressLine1: z.string().min(1).max(300),
  addressLine2: z.string().max(300).optional().nullable(),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional().nullable(),
  country: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(32),
})

export const checkoutBodySchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  customer: customerSchema,
  shipping: shippingSchema,
  shippingMethod: z.string().max(64),
  paymentMethod: z.enum(["stripe", "paypal"]).optional(),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0),
  total: z.number().min(0),
})

export type CheckoutBodyInput = z.infer<typeof checkoutBodySchema>
