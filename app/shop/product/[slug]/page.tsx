'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/database.types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?search=${slug}`)
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        const foundProduct = data.products.find((p: Product) => p.slug === slug) || data.products[0]
        setProduct(foundProduct)
        
        // Set default selections
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0])
        }
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0])
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return

    const cartItem = {
      id: product.id,
      productId: product.id,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    }

    const savedCart = localStorage.getItem('dacosta-cart')
    const cart = savedCart ? JSON.parse(savedCart) : []
    
    // Check if item already exists with same size/color
    const existingIndex = cart.findIndex((item: any) => 
      item.productId === product.id && 
      item.size === selectedSize && 
      item.color === selectedColor
    )

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem('dacosta-cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  const nextImage = () => {
    if (product && product.image_urls) {
      setSelectedImage((prev) => (prev + 1) % product.image_urls!.length)
    }
  }

  const prevImage = () => {
    if (product && product.image_urls) {
      setSelectedImage((prev) => (prev - 1 + product.image_urls!.length) % product.image_urls!.length)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <Link href="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="bg-black border-white/10 overflow-hidden">
              <div className="relative aspect-square bg-white/5 flex items-center justify-center">
                <img
                  src={product.image_urls?.[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => window.open(product.image_urls?.[selectedImage], '_blank')}
                />
                
                {product.image_urls && product.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </Card>

            {/* Thumbnails */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image_urls.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === index ? 'border-white' : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-white/5"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">€{product.price.toFixed(2)}</span>
                <span className="text-sm text-white/60">{product.category}</span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-white/70 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md border transition-all ${
                        selectedColor === color
                          ? 'bg-white text-black border-white'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
                <span className="text-sm text-white/60">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Stock Info */}
            {product.stock_quantity < product.low_stock_threshold && product.stock_quantity > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-md text-sm">
                Only {product.stock_quantity} left in stock!
              </div>
            )}

            {product.stock_quantity === 0 && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2 rounded-md text-sm">
                Out of stock
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <Button
                className="w-full bg-white text-black hover:bg-white/90 text-lg py-6"
                onClick={addToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20"
                  onClick={() => {
                    addToCart()
                    router.push('/shop/cart')
                  }}
                  disabled={product.stock_quantity === 0}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-white/10 pt-6 space-y-2 text-sm text-white/60">
              <p>✓ Free shipping on orders over €100</p>
              <p>✓ Secure payment with Stripe</p>
              <p>✓ Ships worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

