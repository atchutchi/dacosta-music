"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, LogIn, CreditCard, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import type { Product, CartItem as CartItemType } from "@/lib/database.types"
import { withCsrfHeaders } from "@/lib/fetch-with-csrf"

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
  const [userChoice, setUserChoice] = useState<'guest' | 'login' | null>(null)
  
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

  // Calculate shipping based on country and shipping method
  const calculateShippingByCountry = (country: string, method: string): number => {
    // If no country selected, return 0
    if (!country) return 0

    const countryUpper = country.toUpperCase()
    
    // Portugal Continental
    if (countryUpper === 'PT' || countryUpper === 'PORTUGAL') {
      return 5.50
    }
    
    // EU Countries (excluding Portugal and UK)
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'RO', 'SK', 'SI', 'ES', 'SE'
    ]
    if (euCountries.includes(countryUpper)) {
      return 12.50
    }
    
    // United Kingdom
    if (countryUpper === 'GB' || countryUpper === 'UK' || countryUpper === 'UNITED KINGDOM') {
      // Basic service: €10-15, using average €12.50
      return 12.50
    }
    
    // Africa (South Africa, etc.)
    const africaCountries = ['ZA', 'SOUTH AFRICA', 'EG', 'EGYPT', 'KE', 'KENYA', 'NG', 'NIGERIA']
    if (africaCountries.includes(countryUpper)) {
      // Realistic cost: €30-40+, using €35 as average
      return 35.00
    }
    
    // Rest of World (Non-EU)
    return 25.50
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    
    // Free shipping for orders over €100 in Portugal
    if (subtotal > 100 && (formData.country.toUpperCase() === 'PT' || formData.country.toUpperCase() === 'PORTUGAL')) {
      return 0
    }
    
    // Calculate shipping based on country only
    return calculateShippingByCountry(formData.country, 'manual')
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handleContinueAsGuest = () => {
    setUserChoice('guest')
    setStep('shipping')
    // Pre-fill shipping with customer info
    setFormData({
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
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsSubmitting(true)
    
    try {
      await fetch("/api/csrf", { credentials: "include" })

      // Create order first
      const orderData = {
        items: cartItems,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: `${formData.customerPhoneCode} ${formData.customerPhone}`
        },
        shipping: {
          name: formData.shippingName,
          email: formData.shippingEmail,
          phone: `${formData.shippingPhoneCode} ${formData.shippingPhone}`,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        },
        shippingMethod: 'manual',
        paymentMethod: formData.paymentMethod,
        subtotal: calculateSubtotal(),
        shippingCost: calculateShipping(),
        total: calculateTotal()
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
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === 'auth' ? 'bg-white text-black' : 'bg-white/20'
                }`}>
                  {step !== 'auth' ? <Check className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <span className="ml-2 text-sm">Account</span>
              </div>
              
              <div className="flex-1 h-px bg-white/20 mx-4" />
              
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === 'shipping' ? 'bg-white text-black' : step === 'payment' ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {step === 'payment' ? <Check className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>
                <span className="ml-2 text-sm">Shipping</span>
              </div>
              
              <div className="flex-1 h-px bg-white/20 mx-4" />
              
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === 'payment' ? 'bg-white text-black' : 'bg-white/10'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm">Payment</span>
              </div>
            </div>

            {/* Step 1: Auth Choice */}
            {step === 'auth' && (
              <motion.div
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
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="bg-gray-900 border-white/20"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="bg-gray-900 border-white/20"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">Phone</Label>
                      <div className="flex gap-2">
                        <Select 
                          value={formData.customerPhoneCode} 
                          onValueChange={(value) => setFormData({ ...formData, customerPhoneCode: value })}
                        >
                          <SelectTrigger className="bg-gray-900 border-white/20 w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-white/20 max-h-[300px]">
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.flag} {country.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="customerPhone"
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
                      onClick={handleContinueAsGuest}
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
                      onClick={handleLogin}
                      variant="outline"
                      className="w-full border-white/20"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login to Your Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
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
                      <div className="grid grid-cols-2 gap-4">
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
                      </div>
                      
                      <div>
                        <Label htmlFor="shippingPhone">Phone *</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={formData.shippingPhoneCode} 
                            onValueChange={(value) => setFormData({ ...formData, shippingPhoneCode: value })}
                          >
                            <SelectTrigger className="bg-gray-900 border-white/20 w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/20 max-h-[300px]">
                              {COUNTRY_CODES.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.flag} {country.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="shippingPhone"
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
                          id="addressLine1"
                          value={formData.addressLine1}
                          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                          className="bg-gray-900 border-white/20"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                          className="bg-gray-900 border-white/20"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
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
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="postalCode">Postal/Zip Code *</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="bg-gray-900 border-white/20"
                            required
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-base">Standard Shipping</Label>
                          <span className="font-semibold">
                            {formData.country && calculateSubtotal() > 100 && (formData.country.toUpperCase() === 'PT' || formData.country.toUpperCase() === 'PORTUGAL') 
                              ? 'FREE' 
                              : formData.country 
                                ? `€${calculateShippingByCountry(formData.country, 'manual').toFixed(2)}`
                                : 'Select country first'}
                          </span>
                        </div>
                        <p className="text-sm text-white/60">
                          Shipping cost calculated based on delivery country
                        </p>
                        {formData.country && (
                          <p className="text-xs text-white/40 mt-2">
                            Estimated delivery: 5-10 business days
                          </p>
                        )}
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
                        <Button type="submit" className="flex-1 bg-white text-black hover:bg-white/90">
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
                        disabled={isSubmitting}
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
                      <div key={item.productId} className="flex gap-4">
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
                    <span>€{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `€${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}




