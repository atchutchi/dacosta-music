"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Ticket, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Event {
  id: string
  name?: string
  title?: string
  date?: string
  start_date?: string
  location: string
  ticketLink?: string
  ticket_url?: string
  description?: string
  image?: string
  image_url?: string
  artistId?: string
  event_artists?: any[]
}

export default function EventPage() {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to fetch event from localStorage first
    const fetchEvent = async () => {
      try {
        // Try localStorage first
        const savedEvents = localStorage.getItem("dacosta-events")
        if (savedEvents) {
          const allEvents = JSON.parse(savedEvents)
          const foundEvent = allEvents.find((e: Event) => e.id === id)
          
          if (foundEvent) {
            setEvent(foundEvent)
            setLoading(false)
            return
          }
        }
        
        // If not found in localStorage, try the API
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch event data')
        }
        
        const data = await res.json();
        if (data) {
          setEvent(data)
        } else {
          notFound()
        }
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Couldn't load event data")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-48 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }
  
  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8">{error || "Sorry, we couldn't find the event you're looking for."}</p>
          <Link href="/events">
            <Button>View All Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Format date if it exists in either format
  let formattedDate = event.date || ''
  let formattedTime = ''

  if (event.start_date) {
    try {
      const startDate = new Date(event.start_date)
      formattedDate = startDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      
      formattedTime = startDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
    }
  }

  // Decide which field to use for various properties
  const eventTitle = event.title || event.name || 'Untitled Event'
  const eventImage = event.image_url || event.image
  const eventDescription = event.description || ''
  const eventTicketUrl = event.ticket_url || event.ticketLink

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/events">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Event Image */}
          <div className="overflow-hidden rounded-lg">
            {eventImage ? (
              <img 
                src={eventImage} 
                alt={eventTitle} 
                className="h-full w-full object-cover aspect-video"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-black/30 border border-white/10">
                <Calendar className="h-16 w-16 text-white/20" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{eventTitle}</h1>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white/70">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>

              {formattedTime && (
                <div className="flex items-center space-x-2 text-white/70">
                  <Clock className="h-5 w-5" />
                  <span>{formattedTime}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-white/70">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            </div>

            {eventDescription && (
              <div className="prose max-w-none text-white/80">
                <h2 className="text-xl font-semibold">About the event</h2>
                <p>{eventDescription}</p>
              </div>
            )}

            {eventTicketUrl && eventTicketUrl !== "#" && (
              <div>
                <Button asChild className="w-full">
                  <a href={eventTicketUrl} target="_blank" rel="noopener noreferrer">
                    <Ticket className="mr-2 h-4 w-4" />
                    Get Tickets
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Artists Section - only show if event has event_artists */}
        {event.event_artists && event.event_artists.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Artists</h2>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {event.event_artists.map(({ artists }) => (
                <Link
                  key={artists.id}
                  href={`/artists/${artists.slug}`}
                  className="group overflow-hidden rounded-lg border border-white/10 transition-all hover:bg-white/5"
                >
                  <div className="aspect-square overflow-hidden bg-black/30">
                    {artists.photo_url ? (
                      <img
                        src={artists.photo_url}
                        alt={artists.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-black/50">
                        {artists.logo_url ? (
                          <img
                            src={artists.logo_url}
                            alt={artists.name}
                            className="h-16 w-16 object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white/30">{artists.name.charAt(0)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium">{artists.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Artist section - for localStorage events with artistId */}
        {event.artistId && !event.event_artists && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Artist</h2>
            
            <Link 
              href={`/artists/${event.artistId}`}
              className="inline-block overflow-hidden rounded-lg border border-white/10 transition-all hover:bg-white/5"
            >
              <div className="p-4">
                <h3 className="font-medium">
                  {event.artistId === "caiiro" ? "Caiiro" : 
                   event.artistId === "dacapo" ? "Da Capo" : 
                   event.artistId === "enoonapa" ? "Enoo Napa" : event.artistId}
                </h3>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
