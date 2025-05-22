"use client";

import { ShowsSection } from "@/components/shows-section"

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Events</h1>
        <p className="text-white/80 max-w-2xl mx-auto mb-12 text-center">
          Check out upcoming performances and shows featuring our artists across the globe. Join us for unforgettable musical experiences.
        </p>
        
        <ShowsSection />
      </div>
    </div>
  )
}
