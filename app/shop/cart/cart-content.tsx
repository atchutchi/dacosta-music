"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product, CartItem } from '@/lib/database.types'
import { quoteCheckout, SHIPPING_COUNTRIES, type CheckoutQuote } from '@/lib/checkout-pricing'
import { getShippingDestination } from '@/lib/shipping-rates'
import { maxCartItemQuantity } from '@/lib/cart-stock'

const itemKey = (item: CartItem) => `${item.productId}:${item.size ?? ''}:${item.color ?? ''}`

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')

  async function loadCart() {
    setLoading(true)
    setLoadError('')
    try {
      const stored = JSON.parse(localStorage.getItem('dacosta-cart') || '[]')
      if (!Array.isArray(stored)) throw new Error('Invalid cart')
      const cart: CartItem[] = stored.map(item => ({...item, productId:item.productId || item.id}))
      if (cart.some(item => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) throw new Error('Invalid cart')
      setItems(cart)
      if (cart.length) {
        const response = await fetch(`/api/products?ids=${cart.map(item => item.productId).join(',')}`,{cache:'no-store'})
        if (!response.ok) throw new Error('Unable to load products')
        const data = await response.json()
        if (!Array.isArray(data.products) || cart.some(item => !data.products.some((p: Product) => p.id === item.productId))) throw new Error('A product in your cart is no longer available')
        setProducts(data.products)
      }
    } catch {
      setLoadError('Unable to load every item in your cart. Please try again before checking out.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    void loadCart()
    try {
      const saved = JSON.parse(localStorage.getItem('dacosta-shipping-destination') || 'null')
      if (saved && typeof saved.country === 'string') {
        getShippingDestination(saved.country)
        setCountry(saved.country)
        setPostalCode(typeof saved.postalCode === 'string' ? saved.postalCode : '')
      }
    } catch { /* Ignore an invalid saved estimate. */ }
  }, [])

  useEffect(() => {
    if (country) localStorage.setItem('dacosta-shipping-destination',JSON.stringify({country,postalCode}))
    else localStorage.removeItem('dacosta-shipping-destination')
  }, [country,postalCode])

  function saveCart(cart: CartItem[]) {
    setItems(cart)
    localStorage.setItem('dacosta-cart',JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
  }

  function changeQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return saveCart(items.filter(entry => itemKey(entry) !== itemKey(item)))
    const product = products.find(entry => entry.id === item.productId)
    if (!product) return
    const allowed = Math.max(1,maxCartItemQuantity(product,items,item))
    saveCart(items.map(entry => itemKey(entry) === itemKey(item) ? {...entry,quantity:Math.min(quantity,allowed)} : entry))
  }

  const subtotal = items.reduce((sum,item) => sum + Math.round((products.find(p=>p.id===item.productId)?.price || 0)*100)*item.quantity,0)/100
  const invalidStock = items.some(item => {
    const product=products.find(p=>p.id===item.productId)
    return !product || item.quantity > maxCartItemQuantity(product,items,item)
  })
  let quote: CheckoutQuote | null = null
  let quoteError = ''
  if (country && items.length && !loadError) {
    try { quote = quoteCheckout(items,products,country,'standard',postalCode) }
    catch (error) { quoteError = error instanceof Error ? error.message : 'Unable to calculate shipping' }
  }

  if (loading) return <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">Loading cart...</div>

  return <div className="min-h-screen pt-24 pb-20">
    <div className="container mx-auto px-4">
      <Button asChild variant="ghost" className="pl-0"><Link href="/shop"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Shop</Link></Button>
      <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-10">Your Cart</h1>
      {loadError && <div role="alert" className="mb-6 rounded border border-white/20 p-4"><p>{loadError}</p><Button onClick={()=>void loadCart()} variant="outline" className="mt-3">Try again</Button></div>}
      {!items.length && !loadError ? <div className="py-16 text-center"><p className="mb-6">Your cart is empty.</p><Button asChild className="bg-white text-black"><Link href="/shop">Continue Shopping</Link></Button></div> :
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white/5 divide-y divide-white/10">
            {items.map(item=>{
              const product=products.find(p=>p.id===item.productId)
              if(!product)return null
              const label=`${product.name}${item.size ? ', size '+item.size : ''}`
              const maximum=maxCartItemQuantity(product,items,item)
              return <div key={itemKey(item)} className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link href={`/shop/product/${product.slug}`} className="flex gap-4 flex-1 min-w-0">
                  <img src={product.image_urls?.[0] || '/placeholder.svg'} alt={product.name} className="w-20 h-20 rounded object-cover shrink-0"/>
                  <div><h2 className="font-semibold text-sm">{product.name}</h2><p className="text-sm text-white/60">{item.size && `Size: ${item.size}`} {item.color}</p><p className="text-sm mt-1">€{product.price.toFixed(2)} · VAT included</p></div>
                </Link>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center border border-white/20 rounded-md">
                    <button aria-label={`Decrease quantity for ${label}`} onClick={()=>changeQuantity(item,item.quantity-1)} className="p-3 hover:bg-white/10"><Minus className="h-4 w-4"/></button>
                    <span className="px-2" aria-label={`Quantity for ${label}`}>{item.quantity}</span>
                    <button aria-label={`Increase quantity for ${label}`} disabled={item.quantity>=maximum} onClick={()=>changeQuantity(item,item.quantity+1)} className="p-3 hover:bg-white/10 disabled:opacity-40"><Plus className="h-4 w-4"/></button>
                  </div>
                  <span className="font-semibold">€{(product.price*item.quantity).toFixed(2)}</span>
                  <button aria-label={`Remove ${label} from cart`} onClick={()=>saveCart(items.filter(entry=>itemKey(entry)!==itemKey(item)))} className="p-3 text-white/70 hover:text-white"><Trash2 className="h-4 w-4"/></button>
                </div>
              </div>
            })}
          </div>
          {invalidStock && !loadError && <p role="alert" className="mt-4">Some quantities exceed the available stock. Reduce them before checkout.</p>}
          <div className="mt-5 flex justify-between gap-4"><Button variant="outline" onClick={()=>saveCart([])}>Clear Cart</Button><Button asChild variant="outline"><Link href="/shop">Continue Shopping</Link></Button></div>
        </div>
        <aside className="rounded-lg bg-white/5 p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="flex justify-between mb-6"><span>Products · VAT included</span><span>{loadError ? 'Unavailable' : `€${subtotal.toFixed(2)}`}</span></div>
          <label htmlFor="cart-country" className="block text-sm mb-2">Delivery country</label>
          <select id="cart-country" value={country} onChange={e=>setCountry(e.target.value)} className="h-10 w-full min-w-0 rounded border border-white/20 bg-gray-900 px-3 text-sm">
            <option value="">Select country to estimate shipping</option>
            {SHIPPING_COUNTRIES.map(destination=><option key={destination.code} value={destination.code}>{destination.name}</option>)}
          </select>
          {country && <div className="mt-4"><label htmlFor="cart-postal-code" className="block text-sm mb-2">Postal/Zip code (if applicable)</label><input id="cart-postal-code" value={postalCode} onChange={e=>setPostalCode(e.target.value)} maxLength={32} className="h-10 w-full rounded border border-white/20 bg-gray-900 px-3 text-sm"/></div>}
          <div aria-live="polite" className="mt-5 space-y-4">
            <div className="flex justify-between gap-4 text-sm"><span>Shipping</span><span>{quote ? `€${quote.shippingCost.toFixed(2)}` : country ? 'Quote required' : 'Choose a country'}</span></div>
            <div className="border-t border-white/10 pt-4 flex justify-between gap-4 font-bold"><span>{quote ? 'Estimated total' : 'Total before shipping'}</span><span>{loadError ? 'Unavailable' : quote ? `€${quote.total.toFixed(2)}` : quoteError ? 'Pending quote' : `€${subtotal.toFixed(2)}`}</span></div>
            {quote && <p className="text-xs text-white/60">Tracked shipping from Amsterdam. {quote.shipping.weightBand}. Confirm your address at checkout.</p>}
            {quote?.shipping.requiresCustoms && <p className="text-xs text-white/60">Import duties, taxes and customs charges are not included and may be payable on arrival.</p>}
            {quoteError && <p className="text-sm" role="status">{quoteError} <a href="mailto:cesar@dacosta-music.com?subject=Shipping%20quote" className="underline">Contact the shop</a></p>}
          </div>
          <Button asChild disabled={!!loadError||invalidStock||!!quoteError} className="w-full mt-6 bg-white text-black"><Link href="/shop/checkout" aria-disabled={!!loadError||invalidStock||!!quoteError} tabIndex={loadError||invalidStock||quoteError ? -1 : undefined} onClick={e=>{if(loadError||invalidStock||quoteError)e.preventDefault()}}>Proceed to Checkout</Link></Button>
        </aside>
      </div>}
    </div>
  </div>
}
