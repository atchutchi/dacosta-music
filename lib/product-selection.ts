import type { Product } from './database.types'

export function findProductBySlug(products: Product[], slug: string): Product | null {
  return products.find(product => product.slug === slug) ?? null
}

export function availableStock(product: Product, size?: string): number {
  if (!product.stock_by_size) return product.stock_quantity
  return Math.min(product.stock_quantity, size ? product.stock_by_size[size] ?? 0 : 0)
}
