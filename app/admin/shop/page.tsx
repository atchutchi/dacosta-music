"use client"

import Link from "next/link"
import { ArrowLeft, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function AdminShopPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalValue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/products?active=all&limit=1000')
        const data = await response.json()
        
        if (data.products) {
          const products = data.products
          const activeProducts = products.filter((p: any) => p.active)
          const lowStockProducts = products.filter((p: any) => 
            p.active && p.stock_quantity <= p.low_stock_threshold
          )
          const totalValue = activeProducts.reduce((sum: number, p: any) => 
            sum + (p.price * p.stock_quantity), 0
          )
          
          setStats({
            totalProducts: products.length,
            activeProducts: activeProducts.length,
            lowStockProducts: lowStockProducts.length,
            totalValue
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const shopModules = [
    {
      title: "Products",
      description: "Manage product catalog, stock and pricing",
      icon: <Package className="h-8 w-8" />,
      link: "/admin/shop/products",
      color: "bg-blue-500/10 text-blue-400"
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      icon: <ShoppingCart className="h-8 w-8" />,
      link: "/admin/shop/orders",
      color: "bg-green-500/10 text-green-400"
    },
    {
      title: "Shipping",
      description: "Manage shipping and tracking",
      icon: <TrendingUp className="h-8 w-8" />,
      link: "/admin/shop/shipping",
      color: "bg-purple-500/10 text-purple-400",
      comingSoon: true
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Shop Management</h1>
          <p className="text-white/60 mt-2">Manage your online store, products and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white/60">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : stats.totalProducts}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white/60">Active Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {isLoading ? "..." : stats.activeProducts}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white/60">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {isLoading ? "..." : stats.lowStockProducts}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white/60">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                ${isLoading ? "..." : stats.totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopModules.map((module) => (
            <Link 
              key={module.title} 
              href={module.comingSoon ? "#" : module.link}
              className={`block rounded-lg border border-white/10 p-6 transition-colors ${
                module.comingSoon ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
              }`}
              onClick={(e) => module.comingSoon && e.preventDefault()}
            >
              <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${module.color}`}>
                {module.icon}
              </div>
              
              <h2 className="text-xl font-bold mb-2">
                {module.title}
                {module.comingSoon && (
                  <span className="ml-2 text-xs font-normal text-white/50 rounded-full bg-white/10 px-2 py-1">
                    Coming Soon
                  </span>
                )}
              </h2>
              
              <p className="text-white/70">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}




