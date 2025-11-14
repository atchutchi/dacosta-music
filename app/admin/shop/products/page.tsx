"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { uploadFile, BUCKET_PRODUCTS } from "@/lib/supabase/storage"
import type { Product } from "@/lib/database.types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "Apparel",
    artist_id: "",
    sizes: [] as string[],
    colors: [] as string[],
    stock_quantity: "",
    low_stock_threshold: "5",
    image_urls: [] as string[],
    featured: false,
    active: true
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])

  const categories = ["Apparel", "Accessories", "Music", "Electronics", "Collectibles"]
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableColors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray"]

  useEffect(() => {
    fetchProducts()
    fetchArtists()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products?active=all&limit=100')
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists')
      const data = await response.json()
      if (data.artists) {
        setArtists(data.artists)
      }
    } catch (error) {
      console.error('Error fetching artists:', error)
    }
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category,
        artist_id: product.artist_id || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock_quantity: product.stock_quantity.toString(),
        low_stock_threshold: product.low_stock_threshold.toString(),
        image_urls: product.image_urls || [],
        featured: product.featured,
        active: product.active
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        category: "Apparel",
        artist_id: "",
        sizes: [],
        colors: [],
        stock_quantity: "",
        low_stock_threshold: "5",
        image_urls: [],
        featured: false,
        active: true
      })
    }
    setImageFiles([])
    setIsDialogOpen(true)
  }

  const handleGenerateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData({ ...formData, slug })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setImageFiles(Array.from(files))
  }

  const uploadImages = async () => {
    if (imageFiles.length === 0) return formData.image_urls

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      if (!formData.slug) {
        throw new Error('Por favor, gere um slug antes de fazer upload das imagens')
      }

      for (const file of imageFiles) {
        const timestamp = Date.now()
        const sanitizedSlug = formData.slug.replace(/[^a-z0-9-]/gi, '-')
        const sanitizedFileName = file.name.replace(/[^a-z0-9.-]/gi, '-')
        const fileName = `${sanitizedSlug}-${timestamp}-${sanitizedFileName}`
        const filePath = `${sanitizedSlug}/${fileName}`
        
        try {
          const url = await uploadFile(BUCKET_PRODUCTS, file, filePath)
          
          if (url) {
            uploadedUrls.push(url)
            toast({
              title: "Upload bem-sucedido",
              description: `${file.name} foi enviado com sucesso`,
            })
          } else {
            throw new Error(`Falha ao fazer upload de ${file.name}`)
          }
        } catch (uploadError: any) {
          console.error(`Erro ao fazer upload de ${file.name}:`, uploadError)
          toast({
            title: "Erro no Upload",
            description: uploadError.message || `Falha ao fazer upload de ${file.name}. Verifique se o bucket 'products' existe no Supabase Storage.`,
            variant: "destructive"
          })
          // Continuar com outros arquivos mesmo se um falhar
        }
      }
      
      if (uploadedUrls.length === 0) {
        throw new Error('Nenhuma imagem foi enviada com sucesso')
      }
      
      return [...formData.image_urls, ...uploadedUrls]
    } catch (error: any) {
      console.error('Error uploading images:', error)
      toast({
        title: "Erro no Upload",
        description: error.message || "Falha ao fazer upload de algumas imagens. Verifique o console para detalhes.",
        variant: "destructive"
      })
      return formData.image_urls
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        image_urls: imageUrls,
        artist_id: formData.artist_id && formData.artist_id !== 'none' ? formData.artist_id : null
      }

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${editingProduct ? 'updated' : 'created'} successfully`
        })
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        throw new Error(data.error || 'Failed to save product')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully"
        })
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const toggleSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size)
        ? formData.sizes.filter(s => s !== size)
        : [...formData.sizes, size]
    })
  }

  const toggleColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.includes(color)
        ? formData.colors.filter(c => c !== color)
        : [...formData.colors, color]
    })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/shop">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop Management
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Product Management</h1>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-white text-black hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-black border-white/10 overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                {product.image_urls && product.image_urls.length > 0 ? (
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/20" />
                  </div>
                )}
                {!product.active && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-bold">INACTIVE</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm">{product.name}</h3>
                  <span className="text-sm font-bold">€{product.price}</span>
                </div>
                <p className="text-xs text-white/60 mb-2">{product.category}</p>
                <p className="text-xs text-white/60 mb-3">
                  Stock: {product.stock_quantity}
                  {product.stock_quantity <= product.low_stock_threshold && (
                    <span className="text-yellow-400 ml-1">(Low)</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 mb-4">No products yet. Create your first product!</p>
            <Button onClick={() => handleOpenDialog()} className="bg-white text-black hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        )}

        {/* Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Create a new product in your store'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-900 border-white/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-gray-900 border-white/20"
                      required
                    />
                    <Button type="button" onClick={handleGenerateSlug} size="sm">
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-900 border-white/20"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (EUR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-900 border-white/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-900 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="artist">Artist (Optional)</Label>
                <Select value={formData.artist_id} onValueChange={(value) => setFormData({ ...formData, artist_id: value })}>
                  <SelectTrigger className="bg-gray-900 border-white/20">
                    <SelectValue placeholder="Select an artist" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="none">None</SelectItem>
                    {artists.map(artist => (
                      <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sizes (for apparel)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableSizes.map(size => (
                    <Button
                      key={size}
                      type="button"
                      size="sm"
                      variant={formData.sizes.includes(size) ? "default" : "outline"}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Colors</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableColors.map(color => (
                    <Button
                      key={color}
                      type="button"
                      size="sm"
                      variant={formData.colors.includes(color) ? "default" : "outline"}
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="bg-gray-900 border-white/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                    className="bg-gray-900 border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Product Images</Label>
                <div className="space-y-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="bg-gray-900 border-white/20"
                  />
                  <p className="text-xs text-white/60">
                    Upload multiple images. First image will be the main product image.
                  </p>
                  <div className="text-xs text-white/40 mt-2">
                    <p>Ou use URLs de imagens já existentes em /public/images/</p>
                    <p>Exemplo: /images/Mock-Up-Front-HQ.webp</p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar URL de imagem (ex: /images/foto.webp)"
                      className="bg-gray-900 border-white/20 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          if (input.value) {
                            setFormData({
                              ...formData,
                              image_urls: [...formData.image_urls, input.value]
                            })
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement)
                        if (input.value) {
                          setFormData({
                            ...formData,
                            image_urls: [...formData.image_urls, input.value]
                          })
                          input.value = ''
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
                {formData.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Product ${index + 1}`} className="h-20 w-20 object-cover rounded-md" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || uploadingImages}
                  className="bg-white text-black hover:bg-white/90"
                >
                  {isSubmitting || uploadingImages ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}




