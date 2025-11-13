"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, ArrowRight, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import type { Product } from "@/lib/database.types"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [maxPrice, setMaxPrice] = useState(200)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Carregar produtos do Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          sortBy: sortBy === 'featured' ? 'featured' : sortBy === 'newest' ? 'created_at' : 'price',
          sortOrder: sortBy === 'price-high' ? 'desc' : 'asc'
        })
        
        if (activeCategory !== 'all') {
          params.append('category', activeCategory)
        }
        
        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        
        if (data.products) {
          setProducts(data.products)
          setFilteredProducts(data.products)
          
          // Extrair categorias únicas
          const uniqueCategories = [...new Set(data.products.map((p: Product) => p.category))]
          setCategories(uniqueCategories)
          
          // Calcular preço máximo
          const prices = data.products.map((p: Product) => p.price)
          const max = Math.max(...prices, 200)
          setMaxPrice(Math.ceil(max / 10) * 10) // Arredondar para cima
          
          if (priceRange[1] === 200 && max > 200) {
            setPriceRange([0, max])
          }
          
          setTotalPages(data.pagination.pages)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem("dacosta-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [currentPage, sortBy, activeCategory])

  // Filtrar produtos por preço
  useEffect(() => {
    let result = [...products]
    
    // Filtrar por preço
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
    
    setFilteredProducts(result)
  }, [priceRange, products])

  const addToCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId)

    let newCart
    if (existingItem) {
      newCart = cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      newCart = [...cart, { id: productId, productId: productId, quantity: 1 }]
    }

    setCart(newCart)
    localStorage.setItem("dacosta-cart", JSON.stringify(newCart))
    
    // Disparar evento para atualizar navbar
    window.dispatchEvent(new Event("storage"))
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
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeCategory === "all" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      activeCategory === category ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, maxPrice]}
                  max={maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>€{priceRange[0]}</span>
                  <span>€{priceRange[1]}</span>
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
                    setPriceRange([0, maxPrice])
                    setSortBy("featured")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <Card className="bg-black border border-white/10 overflow-hidden h-full group">
                        <Link href={`/shop/product/${product.slug}`}>
                          <div className="h-80 overflow-hidden relative cursor-pointer">
                            <img
                              src={product.image_urls?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-contain bg-white/5 transition-transform duration-500 group-hover:scale-105"
                            />
                            {product.featured && (
                              <span className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                                FEATURED
                              </span>
                            )}
                            {product.stock_quantity < product.low_stock_threshold && product.stock_quantity > 0 && (
                              <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                                LOW STOCK
                              </span>
                            )}
                            {product.stock_quantity === 0 && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                SOLD OUT
                              </span>
                            )}
                          </div>
                        </Link>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-white/60">{product.category}</span>
                            <span className="font-semibold">€{product.price.toFixed(2)}</span>
                          </div>
                          <Link href={`/shop/product/${product.slug}`}>
                            <h3 className="text-xl font-bold mb-4 hover:text-white/80 transition-colors cursor-pointer">{product.name}</h3>
                          </Link>
                          <Button
                            className="w-full bg-white text-black hover:bg-white/90"
                            onClick={() => addToCart(product.id)}
                            disabled={product.stock_quantity === 0}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="border-white/20 text-white/60"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant="outline"
                          className={currentPage === i + 1 ? "border-white text-white bg-white/10" : "border-white/20 text-white/60"}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        className="border-white/20 text-white/60"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
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
