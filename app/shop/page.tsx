"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, ArrowRight, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isFeatured?: boolean
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])

  useEffect(() => {
    // Simulate fetching products
    const fetchProducts = () => {
      const allProducts: Product[] = [
        {
          id: "product1",
          name: "Da Costa Logo T-Shirt",
          price: 29.99,
          image: "/images/dj-performance-1.png",
          category: "Apparel",
          isNew: true,
        },
        {
          id: "product2",
          name: "Afro House Vinyl Collection",
          price: 49.99,
          image: "/images/dj-red-light.png",
          category: "Music",
          isFeatured: true,
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
          isFeatured: true,
        },
        {
          id: "product5",
          name: "African Rhythms Hoodie",
          price: 59.99,
          image: "/images/crowd-pattern.png",
          category: "Apparel",
          isNew: true,
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
          isFeatured: true,
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
          isNew: true,
        },
      ]

      setProducts(allProducts)
      setFilteredProducts(allProducts)
      setIsLoading(false)
    }

    fetchProducts()

    // Load cart from localStorage
    const savedCart = localStorage.getItem("dacosta-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Filter and sort products
    let result = [...products]

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory)
    }

    // Filter by price range
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1))
        break
      case "featured":
      default:
        result.sort((a, b) => (a.isFeatured ? -1 : 1) - (b.isFeatured ? -1 : 1))
        break
    }

    setFilteredProducts(result)
  }, [activeCategory, priceRange, sortBy, products])

  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  const addToCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId)

    let newCart
    if (existingItem) {
      newCart = cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      newCart = [...cart, { id: productId, quantity: 1 }]
    }

    setCart(newCart)
    localStorage.setItem("dacosta-cart", JSON.stringify(newCart))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Exclusive merchandise, music, and collectibles from Da Costa Music and our roster of artists.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Mobile Filters Toggle */}
          <div className="md:hidden w-full">
            <Button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters & Sorting
              </span>
              {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Sidebar Filters */}
          <div
            className={`${
              isFiltersOpen ? "block" : "hidden"
            } md:block md:w-1/4 space-y-8 bg-black md:bg-transparent p-4 md:p-0 rounded-lg border border-white/10 md:border-0`}
          >
            <div className="md:hidden flex justify-between items-center mb-4">
              <h3 className="font-bold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsFiltersOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      activeCategory === category ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {category === "all" ? "All Products" : category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 150]}
                  max={150}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy("featured")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    sortBy === "featured" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    sortBy === "newest" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("price-low")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    sortBy === "price-low" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy("price-high")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    sortBy === "price-high" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-white/70 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <Button
                  onClick={() => {
                    setActiveCategory("all")
                    setPriceRange([0, 150])
                    setSortBy("featured")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Card className="bg-black border border-white/10 overflow-hidden h-full group">
                      <div className="h-64 overflow-hidden relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.isNew && (
                          <span className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-white/60">{product.category}</span>
                          <span className="font-semibold">${product.price.toFixed(2)}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">{product.name}</h3>
                        <Button
                          className="w-full bg-white text-black hover:bg-white/90"
                          onClick={() => addToCart(product.id)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-white/20 text-white/60" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="border-white text-white bg-white/10">
                    1
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white/60">
                    2
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white/60">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Looking for something specific?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Contact us for custom merchandise, bulk orders, or special requests.
          </p>
          <Link href="/#contact">
            <Button className="bg-white text-black hover:bg-white/90">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
