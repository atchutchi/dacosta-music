"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    
    // Load video after initial content is loaded
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Hero Video - YouTube Embed with Lazy Loading */}
      <div 
        ref={videoRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {shouldLoadVideo && (
          <iframe
            title="Da Costa Music Background Video"
            src="https://www.youtube.com/embed/M9Nr1uGgh_4?autoplay=1&mute=1&loop=1&playlist=M9Nr1uGgh_4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1"
            className="w-full h-full"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={handleVideoLoad}
          />
        )}
      </div>

      {/* Overlay with better gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full max-w-md mb-2">
            <Image
              src="/images/logo-branco-dacosta.webp"
              alt="Da Costa Music"
              width={800}
              height={450}
              className="w-full h-auto drop-shadow-2xl"
              priority
              quality={95}
              sizes="(max-width: 768px) 100vw, 400px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              fetchPriority="high"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
              }}
            />
          </div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90 font-light tracking-wide drop-shadow-lg">
            Where talent meets opportunity
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#roster" prefetch={true}>
              <Button className="bg-white text-black hover:bg-white/90 min-w-[150px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Our Roster
              </Button>
            </Link>
            <Link href="/#contact" prefetch={true}>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 min-w-[150px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Down Indicator with better animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ArrowDown className="h-6 w-6 drop-shadow-lg" />
          </div>
          <div className="text-xs mt-2 text-white/60 uppercase tracking-widest">Scroll</div>
        </div>
      </div>
    </section>
  )
}
