"use client";

import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Event {
  id: string;
  name?: string;
  title?: string;
  date?: string;
  start_date?: string;
  location: string;
  ticketLink?: string;
  ticket_url?: string;
  image?: string;
  image_url?: string;
  artistId?: string;
  description?: string;
}

export function ShowsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch events from local storage or API
    const fetchEvents = async () => {
      try {
        // Try to get events from localStorage first
        const savedEvents = localStorage.getItem("dacosta-events");
        
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
          setLoading(false);
          return;
        }

        // If no events in localStorage, try API
        try {
          const res = await fetch('/api/events');
          if (!res.ok) {
            throw new Error('Failed to fetch events from API');
          }
          
          const data = await res.json();
          if (Array.isArray(data)) {
            const transformedEvents = data.map(event => ({
              id: event.id,
              name: event.title,
              date: event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '',
              location: event.location,
              ticketLink: event.ticket_url,
              image: event.image_url,
              description: event.description
            }));
            
            setEvents(transformedEvents);
            // Save to localStorage for future access
            localStorage.setItem("dacosta-events", JSON.stringify(transformedEvents));
          }
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
          // Não usamos dados de exemplo como fallback
          setEvents([]); // Array vazio - sem eventos
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Couldn't load events data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto my-8 text-center">
        <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>
        <div className="flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-48 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Upcoming Shows</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  // Se não houver eventos, mostrar mensagem
  if (events.length === 0) {
    return (
      <div className="container mx-auto my-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>
        <div className="bg-white/5 rounded-lg p-12 mb-8">
          <h3 className="text-2xl font-semibold mb-4">Nenhum evento disponível no momento</h3>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Fique atento para novos eventos que serão adicionados em breve.
          </p>
          <Link href="/#contact">
            <Button className="bg-white text-black hover:bg-white/90">Entre em Contato</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date();
    const dateB = b.date ? new Date(b.date) : new Date();
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Shows</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedEvents.map((event) => (
          <div 
            key={event.id} 
            className="overflow-hidden rounded-lg border border-white/10 bg-black/50 hover:bg-white/5 transition-colors group"
          >
            {(event.image || event.image_url) && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={event.image || event.image_url}
                  alt={event.name || event.title || "Event"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{event.name || event.title}</h3>
              
              <div className="flex items-center mb-3 text-white/70">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{event.date || (event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBA')}</span>
              </div>
              
              <div className="flex items-center mb-6 text-white/70">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              
              {(event.ticketLink || event.ticket_url) && (event.ticketLink !== "#" || event.ticket_url !== "#") ? (
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/events">
          <Button variant="outline" className="group">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 