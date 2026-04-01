export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string | null
          price: number
          category: string
          artist_id: string | null
          sizes: string[] | null
          colors: string[] | null
          stock_quantity: number
          low_stock_threshold: number
          image_urls: string[] | null
          featured: boolean
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description?: string | null
          price: number
          category: string
          artist_id?: string | null
          sizes?: string[] | null
          colors?: string[] | null
          stock_quantity?: number
          low_stock_threshold?: number
          image_urls?: string[] | null
          featured?: boolean
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          category?: string
          artist_id?: string | null
          sizes?: string[] | null
          colors?: string[] | null
          stock_quantity?: number
          low_stock_threshold?: number
          image_urls?: string[] | null
          featured?: boolean
          active?: boolean
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string
          status: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          currency: string
          shipping_name: string
          shipping_email: string
          shipping_phone: string | null
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_state: string | null
          shipping_country: string
          shipping_postal_code: string
          payment_method: string | null
          payment_status: string
          payment_intent_id: string | null
          paypal_order_id: string | null
          shipping_method: string | null
          tracking_number: string | null
          tracking_url: string | null
          shipped_at: string | null
          delivered_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number: string
          status?: string
          subtotal: number
          shipping_cost: number
          tax?: number
          total: number
          currency?: string
          shipping_name: string
          shipping_email: string
          shipping_phone?: string | null
          shipping_address_line1: string
          shipping_address_line2?: string | null
          shipping_city: string
          shipping_state?: string | null
          shipping_country: string
          shipping_postal_code: string
          payment_method?: string | null
          payment_status?: string
          payment_intent_id?: string | null
          paypal_order_id?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string
          status?: string
          subtotal?: number
          shipping_cost?: number
          tax?: number
          total?: number
          currency?: string
          shipping_name?: string
          shipping_email?: string
          shipping_phone?: string | null
          shipping_address_line1?: string
          shipping_address_line2?: string | null
          shipping_city?: string
          shipping_state?: string | null
          shipping_country?: string
          shipping_postal_code?: string
          payment_method?: string | null
          payment_status?: string
          payment_intent_id?: string | null
          paypal_order_id?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_image_url: string | null
          size: string | null
          color: string | null
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_image_url?: string | null
          size?: string | null
          color?: string | null
          quantity: number
          unit_price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_image_url?: string | null
          size?: string | null
          color?: string | null
          quantity?: number
          unit_price?: number
          subtotal?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_history: {
        Row: {
          id: string
          product_id: string | null
          change_type: string
          quantity_change: number
          quantity_after: number
          reference_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          change_type: string
          quantity_change: number
          quantity_after: number
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          change_type?: string
          quantity_change?: number
          quantity_after?: number
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          bio: string | null
          photo_url: string | null
          logo_url: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_website: string | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          bio?: string | null
          photo_url?: string | null
          logo_url?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          bio?: string | null
          photo_url?: string | null
          logo_url?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          featured?: boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          location: string
          start_date: string
          end_date: string | null
          image_url: string | null
          ticket_url: string | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          location: string
          start_date: string
          end_date?: string | null
          image_url?: string | null
          ticket_url?: string | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          location?: string
          start_date?: string
          end_date?: string | null
          image_url?: string | null
          ticket_url?: string | null
          featured?: boolean
        }
        Relationships: []
      }
      event_artists: {
        Row: {
          event_id: string
          artist_id: string
        }
        Insert: {
          event_id: string
          artist_id: string
        }
        Update: {
          event_id?: string
          artist_id?: string
        }
        Relationships: []
      }
      albums: {
        Row: {
          id: string
          created_at: string
          title: string
          artist_id: string
          release_date: string
          cover_url: string | null
          description: string | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist_id: string
          release_date: string
          cover_url?: string | null
          description?: string | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist_id?: string
          release_date?: string
          cover_url?: string | null
          description?: string | null
          featured?: boolean
        }
        Relationships: []
      }
      tracks: {
        Row: {
          id: string
          created_at: string
          title: string
          album_id: string | null
          artist_id: string
          duration: number
          audio_url: string | null
          track_number: number | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          album_id?: string | null
          artist_id: string
          duration: number
          audio_url?: string | null
          track_number?: number | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          album_id?: string | null
          artist_id?: string
          duration?: number
          audio_url?: string | null
          track_number?: number | null
          featured?: boolean
        }
        Relationships: []
      }
      live_sets: {
        Row: {
          id: string
          created_at: string
          title: string
          artist_id: string
          event_id: string | null
          date: string
          duration: number
          audio_url: string | null
          cover_url: string | null
          description: string | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist_id: string
          event_id?: string | null
          date: string
          duration: number
          audio_url?: string | null
          cover_url?: string | null
          description?: string | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist_id?: string
          event_id?: string | null
          date?: string
          duration?: number
          audio_url?: string | null
          cover_url?: string | null
          description?: string | null
          featured?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<string, never>
        Returns: string
      }
      get_shop_statistics: {
        Args: Record<string, never>
        Returns: Json
      }
      get_top_selling_products: {
        Args: { limit_count: number }
        Returns: Json
      }
      get_monthly_sales: {
        Args: { months_back: number }
        Returns: Json
      }
      get_low_stock_products: {
        Args: Record<string, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type exports for easy usage
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type StockHistory = Database["public"]["Tables"]["stock_history"]["Row"]
export type Artist = Database["public"]["Tables"]["artists"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type Album = Database["public"]["Tables"]["albums"]["Row"]
export type Track = Database["public"]["Tables"]["tracks"]["Row"]
export type LiveSet = Database["public"]["Tables"]["live_sets"]["Row"]

// Helper types for cart items (frontend)
export interface CartItem {
  productId: string
  quantity: number
  size?: string
  color?: string
}

// Helper types for checkout
export interface CheckoutData {
  items: CartItem[]
  customer: {
    name: string
    email: string
    phone?: string
  }
  shipping: {
    name: string
    email: string
    phone?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    country: string
    postalCode: string
  }
  shippingMethod: 'manual' | 'dhl' | 'fedex'
  paymentMethod: 'stripe' | 'paypal'
}

// Order status types
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type ShippingMethod = 'manual' | 'dhl' | 'fedex'
export type PaymentMethod = 'stripe' | 'paypal'
