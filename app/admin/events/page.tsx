"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Save, 
  Plus, 
  Trash, 
  ImagePlus,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  name?: string;
  title?: string;
  date?: string;
  start_date?: string;
  location: string;
  ticketLink?: string;
  ticket_url?: string;
  description?: string;
  image?: string;
  image_url?: string;
  artistId?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    name: "",
    date: "",
    location: "",
    ticketLink: "",
    image: "",
    artistId: "",
    description: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabase, setIsSupabase] = useState(false);
  const { toast } = useToast();

  // Load events from localStorage on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Try from localStorage first
        const savedEvents = localStorage.getItem("dacosta-events");
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
          setLoading(false);
          return;
        }
        
        // If none, try from Supabase API
        try {
          const res = await fetch('/api/events');
          if (!res.ok) {
            throw new Error('Failed to fetch events from API');
          }
          
          const data = await res.json();
          if (Array.isArray(data)) {
            setIsSupabase(true);
            const transformedEvents = data.map(event => ({
              id: event.id,
              name: event.title,
              title: event.title,
              date: event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '',
              start_date: event.start_date,
              location: event.location,
              ticketLink: event.ticket_url,
              ticket_url: event.ticket_url,
              image: event.image_url,
              image_url: event.image_url,
              description: event.description
            }));
            
            setEvents(transformedEvents);
            // Save to localStorage for future access
            localStorage.setItem("dacosta-events", JSON.stringify(transformedEvents));
          }
        } catch (error) {
          // Start with empty array if no events exist yet
          setEvents([]);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Generate a unique ID for new event
  const generateId = () => {
    return `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Handle input changes for new event form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // Se o valor for "none", definir como string vazia no estado
    const actualValue = value === "none" ? "" : value;
    setNewEvent(prev => ({ ...prev, [name]: actualValue }));
  };

  // Add new event
  const handleAddEvent = async () => {
    // Validate required fields
    if (!newEvent.name && !newEvent.title) {
      toast({
        title: "Missing event name",
        description: "Please enter an event name or title.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEvent.date && !newEvent.start_date) {
      toast({
        title: "Missing event date",
        description: "Please enter an event date.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEvent.location) {
      toast({
        title: "Missing location",
        description: "Please specify the event location.",
        variant: "destructive"
      });
      return;
    }

    try {
      const eventToAdd = {
        ...newEvent,
        id: generateId(),
        title: newEvent.name || newEvent.title,
        name: newEvent.name || newEvent.title,
        ticket_url: newEvent.ticketLink || newEvent.ticket_url,
        ticketLink: newEvent.ticketLink || newEvent.ticket_url,
        image_url: newEvent.image || newEvent.image_url,
        image: newEvent.image || newEvent.image_url
      };

      if (isSupabase) {
        // Try to save to Supabase
        try {
          const res = await fetch('/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: eventToAdd.title,
              start_date: eventToAdd.start_date || new Date(eventToAdd.date || "").toISOString(),
              location: eventToAdd.location,
              ticket_url: eventToAdd.ticket_url,
              image_url: eventToAdd.image_url,
              description: eventToAdd.description,
              artists: eventToAdd.artistId ? [eventToAdd.artistId] : []
            }),
          });
          
          if (!res.ok) {
            throw new Error('Failed to save to Supabase');
          }
          
          const savedEvent = await res.json();
          eventToAdd.id = savedEvent.id;
        } catch (error) {
          console.error("Error saving to Supabase, saving to localStorage only:", error);
          // Continue with localStorage save
        }
      }

      const updatedEvents = [...events, eventToAdd];
      setEvents(updatedEvents);
      localStorage.setItem("dacosta-events", JSON.stringify(updatedEvents));
      
      // Reset form
      setNewEvent({
        id: "",
        name: "",
        date: "",
        location: "",
        ticketLink: "",
        image: "",
        artistId: "",
        description: ""
      });

      toast({
        title: "Event added",
        description: "The event has been added successfully."
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error adding event",
        description: "There was a problem adding the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Start editing an event
  const handleEditEvent = (event: Event) => {
    setEditingId(event.id);
    setNewEvent({
      ...event,
      name: event.name || event.title || '',
      date: event.date || (event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : ''),
      ticketLink: event.ticketLink || event.ticket_url || '',
      image: event.image || event.image_url || ''
    });
  };

  // Update an event
  const handleUpdateEvent = async () => {
    if (!editingId) return;

    try {
      const updatedEvent = {
        ...newEvent,
        title: newEvent.name || newEvent.title,
        name: newEvent.name || newEvent.title,
        ticket_url: newEvent.ticketLink || newEvent.ticket_url,
        ticketLink: newEvent.ticketLink || newEvent.ticket_url,
        image_url: newEvent.image || newEvent.image_url,
        image: newEvent.image || newEvent.image_url
      };

      if (isSupabase) {
        // Try to update in Supabase
        try {
          const res = await fetch(`/api/events/${editingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: updatedEvent.title,
              start_date: updatedEvent.start_date || new Date(updatedEvent.date || "").toISOString(),
              location: updatedEvent.location,
              ticket_url: updatedEvent.ticket_url,
              image_url: updatedEvent.image_url,
              description: updatedEvent.description,
              artists: updatedEvent.artistId ? [updatedEvent.artistId] : []
            }),
          });
          
          if (!res.ok) {
            throw new Error('Failed to update in Supabase');
          }
        } catch (error) {
          console.error("Error updating in Supabase, updating localStorage only:", error);
        }
      }

      const updatedEvents = events.map(event => 
        event.id === editingId ? updatedEvent : event
      );
      
      setEvents(updatedEvents);
      localStorage.setItem("dacosta-events", JSON.stringify(updatedEvents));
      
      // Reset form and editing state
      setNewEvent({
        id: "",
        name: "",
        date: "",
        location: "",
        ticketLink: "",
        image: "",
        artistId: "",
        description: ""
      });
      setEditingId(null);

      toast({
        title: "Event updated",
        description: "The event has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event",
        description: "There was a problem updating the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Delete an event
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        if (isSupabase) {
          // Try to delete from Supabase
          try {
            const res = await fetch(`/api/events/${id}`, {
              method: 'DELETE'
            });
            
            if (!res.ok) {
              throw new Error('Failed to delete from Supabase');
            }
          } catch (error) {
            console.error("Error deleting from Supabase, updating localStorage only:", error);
          }
        }

        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
        localStorage.setItem("dacosta-events", JSON.stringify(updatedEvents));
        
        if (editingId === id) {
          setEditingId(null);
          setNewEvent({
            id: "",
            name: "",
            date: "",
            location: "",
            ticketLink: "",
            image: "",
            artistId: "",
            description: ""
          });
        }

        toast({
          title: "Event deleted",
          description: "The event has been deleted successfully."
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error deleting event",
          description: "There was a problem deleting the event. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-48 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Event Management</h1>
            {isSupabase && (
              <p className="text-sm text-white/60 mt-1">Connected to Supabase database</p>
            )}
          </div>
          <Link href="/events">
            <Button variant="outline">View Public Events</Button>
          </Link>
        </div>

        {/* Event Form */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Update Event" : "Add New Event"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Event Name*</Label>
              <Input
                id="name"
                name="name"
                value={newEvent.name}
                onChange={handleInputChange}
                placeholder="Enter event name"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date">Event Date*</Label>
              <Input
                id="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                placeholder="e.g., June 15, 2023"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                placeholder="e.g., London, UK"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ticketLink">Ticket Link</Label>
              <Input
                id="ticketLink"
                name="ticketLink"
                value={newEvent.ticketLink}
                onChange={handleInputChange}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={newEvent.image}
                onChange={handleInputChange}
                placeholder="/images/..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="artistId">Artist</Label>
              <Select 
                value={newEvent.artistId === "" ? "none" : newEvent.artistId || "none"} 
                onValueChange={(value) => handleSelectChange('artistId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an artist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="caiiro">Caiiro</SelectItem>
                  <SelectItem value="dacapo">Da Capo</SelectItem>
                  <SelectItem value="enoonapa">Enoo Napa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEvent.description || ''}
                onChange={handleInputChange}
                placeholder="Event description..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            {editingId ? (
              <>
                <Button variant="outline" onClick={() => {
                  setEditingId(null);
                  setNewEvent({
                    id: "",
                    name: "",
                    date: "",
                    location: "",
                    ticketLink: "",
                    image: "",
                    artistId: "",
                    description: ""
                  });
                }} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={handleUpdateEvent}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Event
                </Button>
              </>
            ) : (
              <Button onClick={handleAddEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Event List */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Existing Events ({events.length})</h2>
          
          {events.length === 0 ? (
            <p className="text-white/70 text-center py-8">No events found. Add your first event above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="overflow-hidden rounded-lg border border-white/10 bg-black/50 group"
                >
                  {(event.image || event.image_url) ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image || event.image_url}
                        alt={event.name || event.title || "Event"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gray-800">
                      <ImagePlus className="h-12 w-12 text-white/20" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{event.name || event.title}</h3>
                    
                    <div className="flex items-center mb-3 text-white/70">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.date || (event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBA')}</span>
                    </div>
                    
                    <div className="flex items-center mb-3 text-white/70">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.artistId && (
                      <div className="mb-3 text-white/70 text-sm">
                        Artist: {event.artistId === "caiiro" ? "Caiiro" : 
                                event.artistId === "dacapo" ? "Da Capo" : 
                                event.artistId === "enoonapa" ? "Enoo Napa" : event.artistId}
                      </div>
                    )}
                    
                    {(event.ticketLink || event.ticket_url) && (event.ticketLink !== "#" || event.ticket_url !== "#") && (
                      <div className="mb-4 text-white/70 flex items-center text-sm">
                        <LinkIcon className="h-3 w-3 mr-2" />
                        <span className="truncate">{event.ticketLink || event.ticket_url}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 