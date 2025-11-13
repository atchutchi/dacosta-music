"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Package, Truck, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Order, OrderItem } from "@/lib/database.types"

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const success = searchParams.get('success') === 'true'
  
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  useEffect(() => {
    // Clear cart on successful order
    if (success) {
      localStorage.removeItem('dacosta-cart')
      window.dispatchEvent(new Event('storage'))
    }
  }, [success])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      
      if (data.order) {
        setOrder(data.order)
        setOrderItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'text-green-400'
      case 'processing':
      case 'shipped':
        return 'text-blue-400'
      case 'pending':
        return 'text-yellow-400'
      case 'cancelled':
      case 'refunded':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {success && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-white/70">
              Thank you for your purchase. We've sent a confirmation email to {order.shipping_email}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card className="bg-black border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Details</CardTitle>
                  <span className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60">Order Number</p>
                    <p className="font-semibold">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Payment Status</p>
                    <p className={`font-semibold ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Payment Method</p>
                    <p className="font-semibold capitalize">
                      {order.payment_method || 'N/A'}
                    </p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div>
                    <p className="text-sm text-white/60 mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white/5 px-3 py-1 rounded font-mono text-sm">
                        {order.tracking_number}
                      </code>
                      {order.tracking_url && (
                        <a 
                          href={order.tracking_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-black border-white/10">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.product_image_url && (
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product_name}</h4>
                        <div className="text-sm text-white/60 mt-1">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span className="ml-2">Color: {item.color}</span>}
                        </div>
                        <p className="text-sm text-white/60 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                        <p className="text-sm text-white/60">
                          ${item.unit_price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-black border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{order.shipping_name}</p>
                <p className="text-white/70 mt-2">{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && (
                  <p className="text-white/70">{order.shipping_address_line2}</p>
                )}
                <p className="text-white/70">
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                </p>
                <p className="text-white/70">{order.shipping_country}</p>
                {order.shipping_phone && (
                  <p className="text-white/70 mt-2">Phone: {order.shipping_phone}</p>
                )}
                <p className="text-white/70">Email: {order.shipping_email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-black border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Shipping</span>
                    <span>
                      {order.shipping_cost === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `$${order.shipping_cost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Link href="/shop">
                    <Button className="w-full bg-white text-black hover:bg-white/90">
                      <Package className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  {order.status === 'paid' && !order.tracking_number && (
                    <p className="text-xs text-center text-white/60">
                      Your order is being processed. You'll receive tracking info soon.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}




