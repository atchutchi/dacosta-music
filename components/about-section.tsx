import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
            <p className="text-white/80 mb-6">
              Da Costa Music is a booking and management agency representing established and forward-thinking artists in electronic music. Built on strategy, integrity, and meaningful industry relationships, we focus on cultivating long-term careers and connecting exceptional talent with audiences around the world.
            </p>
            <p className="text-white/80 mb-6">
              Driven by authenticity and a commitment to excellence, we work closely with our artists to support their creative vision, professional growth, and global reach. Every partnership is guided by purpose—amplifying voices, building lasting connections, and shaping legacies that extend beyond the music.
            </p>
            
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg h-64 relative">
                <Image 
                  src="/images/dj-closeup.webp" 
                  alt="DJ Performance" 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                />
              </div>
              <div className="overflow-hidden rounded-lg h-48 relative">
                <Image 
                  src="/images/dj-duo.webp" 
                  alt="DJ Performance" 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="overflow-hidden rounded-lg h-48 relative">
                <Image 
                  src="/images/dj-red-light.webp" 
                  alt="DJ Performance" 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                />
              </div>
              <div className="overflow-hidden rounded-lg h-64 relative">
                <Image 
                  src="/images/crowd-pattern.webp" 
                  alt="Crowd" 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
