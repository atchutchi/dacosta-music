"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, Package, Truck, Check, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Order, OrderItem } from "@/lib/database.types"

interface OrderWithItems extends Order {
  items?: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Update form state
  const [updateData, setUpdateData] = useState({
    status: "",
    payment_status: "",
    tracking_number: "",
    tracking_url: "",
    notes: ""
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  const handleViewOrder = async (order: Order) => {
    // Fetch full order details with items
    try {
      const response = await fetch(`/api/orders/${order.id}`)
      const data = await response.json()
      
      if (data.order) {
        setSelectedOrder({ ...data.order, items: data.items })
        setUpdateData({
          status: data.order.status,
          payment_status: data.order.payment_status,
          tracking_number: data.order.tracking_number || "",
          tracking_url: data.order.tracking_url || "",
          notes: data.order.notes || ""
        })
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive"
      })
    }
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateData.status,
          payment_status: updateData.payment_status,
          tracking_number: updateData.tracking_number || null,
          tracking_url: updateData.tracking_url || null,
          notes: updateData.notes || null,
          shipped_at: updateData.status === 'shipped' && !selectedOrder.shipped_at ? new Date().toISOString() : selectedOrder.shipped_at,
          delivered_at: updateData.status === 'delivered' && !selectedOrder.delivered_at ? new Date().toISOString() : selectedOrder.delivered_at
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order updated successfully"
        })
        setIsDialogOpen(false)
        fetchOrders()
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: { variant: "secondary", label: "Pending" },
      paid: { variant: "default", label: "Paid" },
      processing: { variant: "default", label: "Processing" },
      shipped: { variant: "default", label: "Shipped" },
      delivered: { variant: "default", label: "Delivered" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      refunded: { variant: "destructive", label: "Refunded" }
    }

    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: any = {
      pending: { variant: "secondary", label: "Pending" },
      paid: { variant: "default", label: "Paid" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "destructive", label: "Refunded" }
    }

    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin/shop">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop Management
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Order Management</h1>
          <p className="text-white/60 mt-2">View and manage customer orders</p>
        </div>

        {/* Filters */}
        <Card className="bg-black border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search by order #, email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-white/20"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-900 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-right">
                <p className="text-sm text-white/60">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-black border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-white/60">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-mono text-sm">{order.order_number}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{order.shipping_name}</p>
                            <p className="text-sm text-white/60">{order.shipping_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/70">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4">{getPaymentStatusBadge(order.payment_status)}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle>Order Details - {selectedOrder.order_number}</DialogTitle>
                  <DialogDescription>
                    View and update order information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3 bg-white/5 p-4 rounded-lg">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.product_image_url && (
                            <img
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-white/60">
                              Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>${selectedOrder.shipping_cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="bg-white/5 p-4 rounded-lg text-sm">
                      <p className="font-medium">{selectedOrder.shipping_name}</p>
                      <p className="text-white/70 mt-1">{selectedOrder.shipping_address_line1}</p>
                      {selectedOrder.shipping_address_line2 && (
                        <p className="text-white/70">{selectedOrder.shipping_address_line2}</p>
                      )}
                      <p className="text-white/70">
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}
                      </p>
                      <p className="text-white/70">{selectedOrder.shipping_country}</p>
                      {selectedOrder.shipping_phone && (
                        <p className="text-white/70 mt-2">Phone: {selectedOrder.shipping_phone}</p>
                      )}
                      <p className="text-white/70">Email: {selectedOrder.shipping_email}</p>
                    </div>
                  </div>

                  {/* Update Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Order Status</Label>
                      <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                        <SelectTrigger className="bg-gray-900 border-white/20 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="payment_status">Payment Status</Label>
                      <Select value={updateData.payment_status} onValueChange={(value) => setUpdateData({ ...updateData, payment_status: value })}>
                        <SelectTrigger className="bg-gray-900 border-white/20 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tracking_number">Tracking Number</Label>
                      <Input
                        id="tracking_number"
                        value={updateData.tracking_number}
                        onChange={(e) => setUpdateData({ ...updateData, tracking_number: e.target.value })}
                        className="bg-gray-900 border-white/20 mt-1"
                        placeholder="Enter tracking number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tracking_url">Tracking URL</Label>
                      <Input
                        id="tracking_url"
                        value={updateData.tracking_url}
                        onChange={(e) => setUpdateData({ ...updateData, tracking_url: e.target.value })}
                        className="bg-gray-900 border-white/20 mt-1"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Input
                      id="notes"
                      value={updateData.notes}
                      onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                      className="bg-gray-900 border-white/20 mt-1"
                      placeholder="Add notes about this order..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateOrder}
                    disabled={isUpdating}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    {isUpdating ? 'Updating...' : 'Update Order'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}




