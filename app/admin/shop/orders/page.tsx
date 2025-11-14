"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Truck, Clock, CheckCircle, XCircle, Eye, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total: number
  subtotal: number
  shipping_cost: number
  currency: string
  shipping_name: string
  shipping_email: string
  shipping_phone: string
  shipping_address_line1: string
  shipping_address_line2?: string
  shipping_city: string
  shipping_state?: string
  shipping_country: string
  shipping_postal_code: string
  tracking_number?: string
  tracking_url?: string
  carrier?: string
  created_at: string
  shipped_at?: string
  order_items?: Array<{
    product_name: string
    quantity: number
    unit_price: number
    size?: string
    color?: string
    product_image_url?: string
  }>
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isShipDialogOpen, setIsShipDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isShipping, setIsShipping] = useState(false)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Form de tracking
  const [trackingData, setTrackingData] = useState({
    trackingNumber: "",
    trackingUrl: "",
    carrier: "DHL"
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchQuery])

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
        title: "Erro",
        description: "Falha ao carregar pedidos",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]
    
    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(query) ||
        order.shipping_name.toLowerCase().includes(query) ||
        order.shipping_email.toLowerCase().includes(query) ||
        order.tracking_number?.toLowerCase().includes(query)
      )
    }
    
    setFilteredOrders(filtered)
  }

  const handleOpenShipDialog = (order: Order) => {
    setSelectedOrder(order)
    setTrackingData({
      trackingNumber: order.tracking_number || "",
      trackingUrl: order.tracking_url || "",
      carrier: order.carrier || "DHL"
    })
    setIsShipDialogOpen(true)
  }

  const handleOpenDetailsDialog = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  const handleMarkAsShipped = async () => {
    if (!selectedOrder) return
    
    setIsShipping(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      })
      
      if (response.ok) {
        toast({
          title: "Pedido Despachado! 📦",
          description: "Email de notificação enviado ao cliente",
        })
        setIsShipDialogOpen(false)
        fetchOrders() // Recarregar lista
      } else {
        throw new Error('Failed to ship order')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao marcar pedido como enviado",
        variant: "destructive"
      })
    } finally {
      setIsShipping(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: Clock, label: "Pendente" },
      paid: { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: CheckCircle, label: "Pago" },
      shipped: { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: Truck, label: "Enviado" },
      delivered: { color: "bg-purple-500/20 text-purple-300 border-purple-500/50", icon: Package, label: "Entregue" },
      cancelled: { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: XCircle, label: "Cancelado" }
    }
    
    const variant = variants[status] || variants.pending
    const Icon = variant.icon
    
    return (
      <Badge className={`${variant.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    )
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return orders.length
    return orders.filter(o => o.status === status).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Gerenciar Pedidos</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-sm text-white/60">Total</div>
              <div className="text-2xl font-bold">{getStatusCount("all")}</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="text-sm text-yellow-300">Pendentes</div>
              <div className="text-2xl font-bold text-yellow-300">{getStatusCount("pending")}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="text-sm text-blue-300">Pagos</div>
              <div className="text-2xl font-bold text-blue-300">{getStatusCount("paid")}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="text-sm text-green-300">Enviados</div>
              <div className="text-2xl font-bold text-green-300">{getStatusCount("shipped")}</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="text-sm text-purple-300">Entregues</div>
              <div className="text-2xl font-bold text-purple-300">{getStatusCount("delivered")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="search"
                    placeholder="Número, nome, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900 border-white/20 pl-9"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Filtrar por Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-900 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="all">Todos ({getStatusCount("all")})</SelectItem>
                    <SelectItem value="pending">Pendentes ({getStatusCount("pending")})</SelectItem>
                    <SelectItem value="paid">Pagos ({getStatusCount("paid")})</SelectItem>
                    <SelectItem value="shipped">Enviados ({getStatusCount("shipped")})</SelectItem>
                    <SelectItem value="delivered">Entregues ({getStatusCount("delivered")})</SelectItem>
                    <SelectItem value="cancelled">Cancelados ({getStatusCount("cancelled")})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full border-white/20"
                  onClick={() => {
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-semibold">Pedido</th>
                      <th className="text-left p-4 text-sm font-semibold">Cliente</th>
                      <th className="text-left p-4 text-sm font-semibold">Data</th>
                      <th className="text-left p-4 text-sm font-semibold">Total</th>
                      <th className="text-left p-4 text-sm font-semibold">Status</th>
                      <th className="text-left p-4 text-sm font-semibold">Tracking</th>
                      <th className="text-right p-4 text-sm font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-mono text-sm">{order.order_number}</div>
                          <div className="text-xs text-white/40">
                            {order.order_items?.length || 0} item(s)
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{order.shipping_name}</div>
                          <div className="text-sm text-white/60">{order.shipping_email}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {new Date(order.created_at).toLocaleDateString('pt-PT')}
                          </div>
                          <div className="text-xs text-white/40">
                            {new Date(order.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold">€{order.total.toFixed(2)}</div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-4">
                          {order.tracking_number ? (
                            <div>
                              <div className="text-sm font-mono">{order.tracking_number}</div>
                              <div className="text-xs text-white/40">{order.carrier}</div>
                            </div>
                          ) : (
                            <span className="text-white/40 text-sm">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20"
                              onClick={() => handleOpenDetailsDialog(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === 'paid' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleOpenShipDialog(order)}
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Enviar
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog: Order Details */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
              <DialogDescription>
                {selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Customer Info */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Informações do Cliente</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-white/60">Nome:</span>
                      <div className="font-medium">{selectedOrder.shipping_name}</div>
                    </div>
                    <div>
                      <span className="text-white/60">Email:</span>
                      <div className="font-medium">{selectedOrder.shipping_email}</div>
                    </div>
                    {selectedOrder.shipping_phone && (
                      <div>
                        <span className="text-white/60">Telefone:</span>
                        <div className="font-medium">{selectedOrder.shipping_phone}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Endereço de Envio</h3>
                  <div className="text-sm">
                    <div>{selectedOrder.shipping_address_line1}</div>
                    {selectedOrder.shipping_address_line2 && <div>{selectedOrder.shipping_address_line2}</div>}
                    <div>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}</div>
                    <div className="font-medium mt-1">{selectedOrder.shipping_country}</div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item, index) => (
                      <div key={index} className="flex gap-3 bg-white/5 p-3 rounded-lg">
                        {item.product_image_url && (
                          <img 
                            src={item.product_image_url} 
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-sm text-white/60">
                            {item.size && <span>Size: {item.size} </span>}
                            {item.color && <span>• {item.color}</span>}
                          </div>
                          <div className="text-sm">Qtd: {item.quantity} × €{item.unit_price.toFixed(2)}</div>
                        </div>
                        <div className="font-semibold">
                          €{(item.quantity * item.unit_price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Subtotal:</span>
                      <span>€{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Envio:</span>
                      <span>€{selectedOrder.shipping_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total:</span>
                      <span>€{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                {selectedOrder.tracking_number && (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-green-300">Informações de Rastreamento</h3>
                    <div className="text-sm space-y-1">
                      <div><span className="text-white/60">Número:</span> <span className="font-mono">{selectedOrder.tracking_number}</span></div>
                      {selectedOrder.carrier && <div><span className="text-white/60">Transportadora:</span> {selectedOrder.carrier}</div>}
                      {selectedOrder.tracking_url && (
                        <div>
                          <a href={selectedOrder.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            Rastrear Encomenda →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog: Mark as Shipped */}
        <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Marcar como Enviado</DialogTitle>
              <DialogDescription>
                Pedido {selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="carrier">Transportadora *</Label>
                <Select 
                  value={trackingData.carrier} 
                  onValueChange={(value) => setTrackingData({ ...trackingData, carrier: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="DHL">DHL Express</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="CTT">CTT Correios</SelectItem>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="GLS">GLS</SelectItem>
                    <SelectItem value="Chronopost">Chronopost</SelectItem>
                    <SelectItem value="Other">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trackingNumber">Número de Rastreamento</Label>
                <Input
                  id="trackingNumber"
                  placeholder="Ex: 1234567890"
                  value={trackingData.trackingNumber}
                  onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
                  className="bg-gray-900 border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="trackingUrl">URL de Rastreamento</Label>
                <Input
                  id="trackingUrl"
                  placeholder="https://track.dhl.com/..."
                  value={trackingData.trackingUrl}
                  onChange={(e) => setTrackingData({ ...trackingData, trackingUrl: e.target.value })}
                  className="bg-gray-900 border-white/20"
                />
                <p className="text-xs text-white/40 mt-1">
                  URL completa para o cliente rastrear a encomenda
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-sm">
                <p className="text-blue-300">
                  ℹ️ Ao marcar como enviado, um email será automaticamente enviado ao cliente com as informações de rastreamento.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsShipDialogOpen(false)}
                className="border-white/20"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleMarkAsShipped}
                disabled={isShipping || !trackingData.carrier}
                className="bg-green-600 hover:bg-green-700"
              >
                <Truck className="mr-2 h-4 w-4" />
                {isShipping ? 'Enviando...' : 'Marcar como Enviado'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

