type CheckoutItem = { productId: string; quantity: number; size?: string | null; color?: string | null }
type CheckoutProduct = {
  id: string; name: string; price: number; active: boolean; stock_quantity: number
  sizes: string[] | null; colors: string[] | null
  stock_by_size?: Record<string, number> | null
}

export const SHIPPING_COUNTRIES = [
  { code: 'PT', name: 'Portugal' }, { code: 'ES', name: 'Spain' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' }, { code: 'NL', name: 'Netherlands' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'US', name: 'United States' },
  { code: 'BR', name: 'Brazil' }, { code: 'ZA', name: 'South Africa' },
] as const

// Tarifas existentes, confirmadas pelo titular para CTT e DHL.
export function calculateShipping(country: string, subtotal: number): number {
  if (!country) return 0
  if (country === 'PT') return subtotal > 100 ? 0 : 5.5
  if (['ES', 'FR', 'DE', 'IT', 'NL', 'GB'].includes(country)) return 12.5
  if (country === 'ZA') return 35
  return 25.5
}

export function quoteCheckout(items: CheckoutItem[], products: CheckoutProduct[], country: string, method: string) {
  if (!SHIPPING_COUNTRIES.some(entry => entry.code === country)) throw new Error('Unsupported shipping country')
  if (!['manual', 'ctt', 'dhl'].includes(method)) throw new Error('Unsupported shipping method')
  if (!items.length) throw new Error('Empty checkout')
  const quantities = new Map<string, number>()
  const sizeQuantities = new Map<string, number>()
  let subtotalCents = 0
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
  }
  const subtotal = subtotalCents / 100
  const shippingCost = calculateShipping(country, subtotal)
  return { subtotal, shippingCost, total: (subtotalCents + Math.round(shippingCost * 100)) / 100, currency: 'EUR' as const }
}
