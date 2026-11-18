import { getShippingDetails, PRODUCT_SHIPPING_GRAMS, SHIPPING_PACKAGING_GRAMS, ShippingQuoteRequiredError } from './shipping-rates.ts'
export { calculateShipping, SHIPPING_COUNTRIES } from './shipping-rates.ts'

type CheckoutItem = { productId: string; quantity: number; size?: string | null; color?: string | null }
type CheckoutProduct = {
  id: string; name: string; slug?: string; price: number; active: boolean; stock_quantity: number
  sizes: string[] | null; colors: string[] | null
  stock_by_size?: Record<string, number> | null
}

export function quoteCheckout(items: CheckoutItem[], products: CheckoutProduct[], country: string, method: string, postalCode = '') {
  if (method !== 'standard') throw new Error('Unsupported shipping method. Please refresh the checkout.')
  if (!items.length) throw new Error('Empty checkout')
  const quantities = new Map<string, number>()
  const sizeQuantities = new Map<string, number>()
  let subtotalCents = 0
  let weightGrams = SHIPPING_PACKAGING_GRAMS
  for (const item of items) {
    const product = products.find(entry => entry.id === item.productId)
    if (!product?.active) throw new Error('Product unavailable')
    if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error('Invalid quantity')
    if (!Number.isFinite(product.price) || product.price < 0) throw new Error('Invalid product price')
    if (product.sizes?.length && (!item.size || !product.sizes.includes(item.size))) throw new Error('Invalid product size')
    if (product.colors?.length && (!item.color || !product.colors.includes(item.color))) throw new Error('Invalid product color')
    const quantity = (quantities.get(product.id) ?? 0) + item.quantity
    quantities.set(product.id, quantity)
    if (quantity > product.stock_quantity) throw new Error(`Insufficient stock for ${product.name}`)
    if (product.stock_by_size) {
      const key = `${product.id}:${item.size}`
      const sizeQuantity = (sizeQuantities.get(key) ?? 0) + item.quantity
      sizeQuantities.set(key, sizeQuantity)
      if (!item.size || sizeQuantity > (product.stock_by_size[item.size] ?? 0)) throw new Error(`Insufficient size stock for ${product.name}`)
    }
    subtotalCents += Math.round(product.price * 100) * item.quantity
    const unitWeight = product.slug ? PRODUCT_SHIPPING_GRAMS[product.slug] : undefined
    if (!unitWeight) throw new ShippingQuoteRequiredError('A shipping quote is required for an item in your cart. Please contact us before payment.')
    weightGrams += unitWeight * item.quantity
  }
  const subtotal = subtotalCents / 100
  const shipping = getShippingDetails(country, weightGrams, postalCode)
  const shippingCost = shipping.shippingCost
  return { subtotal, shippingCost, total: (subtotalCents + Math.round(shippingCost * 100)) / 100, currency: 'EUR' as const, shipping }
}

export type CheckoutQuote = ReturnType<typeof quoteCheckout>

export function checkoutTotalsMatch(quote: Pick<CheckoutQuote, 'subtotal' | 'shippingCost' | 'total'>, supplied: {subtotal:number;shippingCost:number;total:number}) {
  return (['subtotal','shippingCost','total'] as const).every(key =>
    Number.isFinite(supplied[key]) && Math.round(quote[key] * 100) === Math.round(supplied[key] * 100))
}
