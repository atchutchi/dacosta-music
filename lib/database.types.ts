export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Artist = Database["public"]["Tables"]["artists"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type Album = Database["public"]["Tables"]["albums"]["Row"]
export type Track = Database["public"]["Tables"]["tracks"]["Row"]
export type LiveSet = Database["public"]["Tables"]["live_sets"]["Row"]
