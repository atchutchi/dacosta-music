"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, LogIn, CreditCard, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import type { Product, CartItem as CartItemType } from "@/lib/database.types"
import { withCsrfHeaders } from "@/lib/fetch-with-csrf"
import { quoteCheckout, SHIPPING_COUNTRIES, type CheckoutQuote } from "@/lib/checkout-pricing"
import { getShippingDestination, ShippingQuoteRequiredError } from "@/lib/shipping-rates"

// Lista completa de indicativos telefônicos
const COUNTRY_CODES = [
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+1-809", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+1-876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+1-868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
].sort((a, b) => a.country.localeCompare(b.country))

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState<'auth' | 'shipping' | 'payment'>('auth')
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentsAvailable, setPaymentsAvailable] = useState<boolean | null>(null)
  const shippingMethod = 'standard'
  const [userChoice, setUserChoice] = useState<'guest' | 'login' | null>(null)
  const [differentRecipient, setDifferentRecipient] = useState(false)

  useEffect(() => {
    fetch('/api/checkout/status', {cache:'no-store'})
      .then(response => response.ok ? response.json() : {available:false})
      .then(data => setPaymentsAvailable(data.available === true))
      .catch(() => setPaymentsAvailable(false))
  }, [])

  // Form data
  const [formData, setFormData] = useState({
    // Customer info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerPhoneCode: '+351',

    // Shipping info
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingPhoneCode: '+351',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',

    // Payment method (apenas Stripe)
    paymentMethod: 'stripe' as 'stripe'
  })

  useEffect(() => {
    loadCart()
    try {
      const saved = JSON.parse(localStorage.getItem('dacosta-shipping-destination') || 'null')
      if (saved && typeof saved.country === 'string') {
        getShippingDestination(saved.country)
        setFormData(previous => ({...previous,country:saved.country,postalCode:typeof saved.postalCode === 'string' ? saved.postalCode : ''}))
      }
    } catch { /* Ignore an invalid saved estimate. */ }
  }, [])

  const loadCart = async () => {
    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem('dacosta-cart')
      if (!savedCart) {
        router.push('/shop')
        return
      }

      const cart: CartItemType[] = JSON.parse(savedCart)
      if (cart.length === 0) {
        router.push('/shop')
        return
      }

      setCartItems(cart)

      // Fetch product details
      const productIds = cart.map(item => item.productId)
      const response = await fetch(`/api/products?ids=${productIds.join(',')}`)
      const data = await response.json()

      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  let checkoutQuote: CheckoutQuote | null = null
  let shippingError = ''
  let needsShippingQuote = false
  if (formData.country && products.length && cartItems.length) {
    try {
      checkoutQuote = quoteCheckout(cartItems, products, formData.country, shippingMethod, formData.postalCode)
    } catch (error) {
      shippingError = error instanceof Error ? error.message : 'Unable to calculate shipping. Please try again.'
      needsShippingQuote = error instanceof ShippingQuoteRequiredError
    }
  }
  const requiresPostalCode = formData.country ? getShippingDestination(formData.country).requiresPostalCode : false
  const formatPhone = (code: string, number: string) => number.trim().startsWith('+') ? number.trim() : `${code} ${number}`.trim()

  const handleContinueAsGuest = () => {
    setUserChoice('guest')
    setStep('shipping')
    // Pre-fill shipping with customer info
    if (!differentRecipient) setFormData({
      ...formData,
      shippingName: formData.customerName,
      shippingEmail: formData.customerEmail,
      shippingPhone: formData.customerPhone,
      shippingPhoneCode: formData.customerPhoneCode
    })
  }

  const handleLogin = () => {
    // Store current cart and redirect to login
    router.push('/login?redirect=/shop/checkout')
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkoutQuote) return
    setStep('payment')
  }

  const handlePayment = async () => {
    if (!paymentsAvailable || !checkoutQuote) return
    setIsSubmitting(true)

    try {
      await fetch("/api/csrf", { credentials: "include" })

      // Create order first
      const orderData = {
        items: cartItems,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formatPhone(formData.customerPhoneCode, formData.customerPhone)
        },
        shipping: {
          name: differentRecipient ? formData.shippingName : formData.customerName,
          email: differentRecipient ? formData.shippingEmail : formData.customerEmail,
          phone: formatPhone(formData.shippingPhoneCode, formData.shippingPhone),
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        },
        shippingMethod,
        paymentMethod: formData.paymentMethod,
        subtotal: checkoutQuote.subtotal,
        shippingCost: checkoutQuote.shippingCost,
        total: checkoutQuote.total
      }

      // Redirect to payment gateway
      // Create Stripe checkout session
      const response = await fetch(
        '/api/checkout/stripe',
        withCsrfHeaders({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        })
      )

      const data = await response.json()
      if (response.status === 409) await loadCart()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading checkout...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/shop/cart">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Checkout</h1>
        </div>

        {paymentsAvailable === false && (
          <div role="status" className="mb-8 rounded-lg border border-white/20 bg-white/5 p-5">
            <p className="font-semibold">Online payments will be available soon</p>
            <p className="mt-2 text-sm text-white/70">You can keep the items in your cart and return to complete your purchase once payments are available.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full ${
                  step === 'auth' ? 'bg-white text-black' : 'bg-white/20'
                }`}>
                  {step !== 'auth' ? <Check className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Account</span>
              </div>

              <div className="flex-1 h-px bg-white/20 mx-1 sm:mx-4" />

              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full ${
                  step === 'shipping' ? 'bg-white text-black' : step === 'payment' ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {step === 'payment' ? <Check className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Shipping</span>
              </div>

              <div className="flex-1 h-px bg-white/20 mx-1 sm:mx-4" />

              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full ${
                  step === 'payment' ? 'bg-white text-black' : 'bg-white/10'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Payment</span>
              </div>
            </div>

            {/* Step 1: Auth Choice */}
            {step === 'auth' && (
              <motion.form onSubmit={event=>{event.preventDefault();handleContinueAsGuest()}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName" autoComplete="name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="bg-gray-900 border-white/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail" autoComplete="email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="bg-gray-900 border-white/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Phone</Label>
                      <p className="mb-2 text-xs text-white/60">You can enter a full international number starting with +.</p>
                      <div className="flex gap-2">
                        {!formData.customerPhone.trim().startsWith('+') && <Select
                          value={formData.customerPhoneCode}
                          onValueChange={(value) => setFormData({ ...formData, customerPhoneCode: value })}
                        >
                          <SelectTrigger aria-label="Customer phone country code" className="bg-gray-900 border-white/20 w-[140px] shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-white/20 max-h-[300px]">
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.flag} {country.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>}
                        <Input
                          id="customerPhone" autoComplete="tel"
                          type="tel"
                          placeholder="912345678"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="bg-gray-900 border-white/20 flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle>Continue as Guest or Login</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white/90"
                      disabled={!formData.customerName || !formData.customerEmail}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Continue as Guest
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-white/60">Or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleLogin}
                      variant="outline"
                      className="w-full border-white/20"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login to Your Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.form>
            )}

            {/* Step 2: Shipping */}
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <form onSubmit={handleShippingSubmit}>
                  <Card className="bg-black border-white/10">
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <label className="flex items-center gap-3 text-sm">
                        <input type="checkbox" checked={differentRecipient} onChange={event=>setDifferentRecipient(event.target.checked)} className="h-4 w-4"/>
                        Deliver to someone else
                      </label>
                      {!differentRecipient && <p className="text-sm text-white/70">Delivering to {formData.customerName} ({formData.customerEmail}).</p>}
                      {differentRecipient && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingName">Full Name *</Label>
                          <Input
                            id="shippingName"
                            value={formData.shippingName}
                            onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="shippingEmail">Email *</Label>
                          <Input
                            id="shippingEmail"
                            type="email"
                            value={formData.shippingEmail}
                            onChange={(e) => setFormData({ ...formData, shippingEmail: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required
                          />
                        </div>
                      </div>}

                      <div>
                        <Label htmlFor="shippingPhone">Phone *</Label>
                        <p className="mb-2 text-xs text-white/60">You can enter a full international number starting with +.</p>
                        <div className="flex gap-2">
                          {!formData.shippingPhone.trim().startsWith('+') && <Select
                            value={formData.shippingPhoneCode}
                            onValueChange={(value) => setFormData({ ...formData, shippingPhoneCode: value })}
                          >
                            <SelectTrigger aria-label="Delivery phone country code" className="bg-gray-900 border-white/20 w-[140px] shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20 max-h-[300px]">
                              {COUNTRY_CODES.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.flag} {country.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>}
                          <Input
                            id="shippingPhone" autoComplete="shipping tel"
                            type="tel"
                            placeholder="912345678"
                            value={formData.shippingPhone}
                            onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                            className="bg-gray-900 border-white/20 flex-1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input
                          id="addressLine1" autoComplete="shipping address-line1"
                          value={formData.addressLine1}
                          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                          className="bg-gray-900 border-white/20"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2" autoComplete="shipping address-line2"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                          className="bg-gray-900 border-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city" autoComplete="shipping address-level2"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="bg-gray-900 border-white/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <select
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="flex h-10 w-full min-w-0 rounded-md border bg-gray-900 border-white/20 px-3 py-2 text-sm"
                            required
                          >
                            <option value="">Select country</option>
                            {SHIPPING_COUNTRIES.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Postal/Zip Code{requiresPostalCode ? ' *' : ' (if applicable)'}</Label>
                          <Input
                            id="postalCode" autoComplete="shipping postal-code"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required={requiresPostalCode}
                          />
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-base">Tracked shipping</Label>
                          <span className="font-semibold">
                            {checkoutQuote ? `€${checkoutQuote.shippingCost.toFixed(2)}` : formData.country ? 'Quote required' : 'Select country first'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/60">Ships from Amsterdam, Netherlands. The country determines the shipping zone automatically.</p>
                        {checkoutQuote && <p className="mt-2 text-sm" aria-live="polite">Zone: {checkoutQuote.shipping.zoneName} · Parcel: {checkoutQuote.shipping.weightBand}</p>}
                        {checkoutQuote?.shipping.requiresCustoms && <p className="mt-2 text-xs text-white/60">Import duties, taxes and customs charges are not included in this total and may be payable on arrival.</p>}
                        <p className="mt-2 text-xs text-white/50">Delivery time varies by destination and customs processing.</p>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep('auth')}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={!checkoutQuote} className="flex-1 bg-white text-black hover:bg-white/90">
                          Continue to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 border-2 border-white rounded-md bg-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-white rounded flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Pay with Stripe</h4>
                            <p className="text-sm text-white/60">Secure card payment</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">VISA</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">MC</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">AMEX</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/40">
                        Your payment information is encrypted and secure. We use Stripe for payment processing.
                      </p>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isSubmitting || paymentsAvailable !== true || !checkoutQuote}
                        className="flex-1 bg-white text-black hover:bg-white/90"
                      >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-black border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null

                    return (
                      <div key={`${item.productId}:${item.size ?? ''}:${item.color ?? ''}`} className="flex gap-4">
                        <img
                          src={product.image_urls?.[0] || '/placeholder.svg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                          {item.size && <p className="text-xs text-white/60">Size: {item.size}</p>}
                          {item.color && <p className="text-xs text-white/60">Color: {item.color}</p>}
                        </div>
                        <span className="text-sm font-semibold">
                          €{(product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span>€{(checkoutQuote?.subtotal ?? calculateSubtotal()).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Shipping</span>
                    <span>
                      {!formData.country ? 'Select a delivery country' : checkoutQuote ? `€${checkoutQuote.shippingCost.toFixed(2)}` : 'Quote required'}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{checkoutQuote ? `€${checkoutQuote.total.toFixed(2)}` : formData.country ? 'Pending shipping quote' : 'Select a delivery country'}</span>
                  </div>
                </div>
                {shippingError && <div className="rounded border border-white/20 p-4 text-sm" role="status" aria-live="polite">
                  <p>{shippingError}</p>
                  {needsShippingQuote && <a className="mt-2 inline-block underline" href="mailto:cesar@dacosta-music.com?subject=Shipping%20quote">Request a shipping quote</a>}
                </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
