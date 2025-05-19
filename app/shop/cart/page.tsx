"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CartItem {
  id: string
  quantity: number
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch products (simulated)
    const fetchProducts = () => {
      const allProducts: Product[] = [
        {
          id: "product1",
          name: "Da Costa Logo T-Shirt",
          price: 29.99,
          image: "/images/dj-performance-1.png",
          category: "Apparel",
        },
        {
          id: "product2",
          name: "Afro House Vinyl Collection",
          price: 49.99,
          image: "/images/dj-red-light.png",
          category: "Music",
        },
        {
          id: "product3",
          name: "Caiiro Limited Edition Cap",
          price: 24.99,
          image: "/images/dj-white-shirt.png",
          category: "Accessories",
        },
        {
          id: "product4",
          name: "Da Capo Signature Headphones",
          price: 129.99,
          image: "/images/dj-duo.png",
          category: "Electronics",
        },
        {
          id: "product5",
          name: "African Rhythms Hoodie",
          price: 59.99,
          image: "/images/crowd-pattern.png",
          category: "Apparel",
        },
        {
          id: "product6",
          name: "Enoo Napa Digital Album",
          price: 14.99,
          image: "/images/club-view.png",
          category: "Music",
        },
        {
          id: "product7",
          name: "B3B Tour Poster (Signed)",
          price: 39.99,
          image: "/images/concert-phones.png",
          category: "Accessories",
        },
        {
          id: "product8",
          name: "Da Costa Music Tote Bag",
          price: 19.99,
          image: "/images/crowd-lights.png",
          category: "Accessories",
        },
        {
          id: "product9",
          name: "Limited Edition Vinyl Box Set",
          price: 99.99,
          image: "/images/dj-closeup.png",
          category: "Music",
        },
      ]

      setProducts(allProducts)

      // Load cart from localStorage
      const savedCart = localStorage.getItem("dacosta-cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }

      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setCartItems(updatedCart)
    localStorage.setItem("dacosta-cart", JSON.stringify(updatedCart))

    // Trigger storage event for navbar to update
    window.dispatchEvent(new Event("storage"))
  }

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("dacosta-cart", JSON.stringify(updatedCart))

    // Trigger storage event for navbar to update
    window.dispatchEvent(new Event("storage"))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("dacosta-cart")

    // Trigger storage event for navbar to update
    window.dispatchEvent(new Event("storage"))
  }

  const getProductDetails = (id: string) => {
    return products.find((product) => product.id === id)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductDetails(item.id)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 100 ? 0 : 9.99
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-48 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Your Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white/5 mb-6">
              <ShoppingBag className="h-12 w-12 text-white/60" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Explore our shop to find exclusive merchandise
              and music from Da Costa Music.
            </p>
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-white/90">Continue Shopping</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <h3 className="font-semibold">Product</h3>
                    </div>
                    <div className="col-span-2 text-center">
                      <h3 className="font-semibold">Price</h3>
                    </div>
                    <div className="col-span-2 text-center">
                      <h3 className="font-semibold">Quantity</h3>
                    </div>
                    <div className="col-span-2 text-right">
                      <h3 className="font-semibold">Total</h3>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {cartItems.map((item) => {
                    const product = getProductDetails(item.id)
                    if (!product) return null

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-4"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-6 flex items-center">
                            <div className="h-16 w-16 rounded overflow-hidden mr-4">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-white/60">{product.category}</p>
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            <span>${product.price.toFixed(2)}</span>
                          </div>
                          <div className="col-span-2 flex items-center justify-center">
                            <div className="flex items-center border border-white/20 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-white/10"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-white/10"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="col-span-2 text-right flex items-center justify-end">
                            <span className="mr-4">${(product.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-white/60 hover:text-white">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="p-4 border-t border-white/10 flex justify-between">
                  <Button variant="outline" className="border-white/20 text-white/70" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Link href="/shop">
                    <Button variant="outline" className="border-white text-white">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `$${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {calculateShipping() > 0 && (
                    <p className="text-sm text-white/60">Free shipping on orders over $100</p>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-white text-black hover:bg-white/90">Proceed to Checkout</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
