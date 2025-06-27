"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Video - YouTube Embed */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/M9Nr1uGgh_4?autoplay=1&mute=1&loop=1&playlist=M9Nr1uGgh_4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1"
          className="w-full h-full"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '56.25vw', // 16:9 aspect ratio
            minHeight: '100vh',
            minWidth: '177.78vh', // 16:9 aspect ratio
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div
          className={`transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full max-w-md mb-2">
            <Image
              src="/images/logo-branco-dacosta.png"
              alt="Da Costa Music"
              width={800}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/80">Where talent meets oportunity</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#roster">
              <Button className="bg-white text-black hover:bg-white/90 min-w-[150px]">Our Roster</Button>
            </Link>
            <Link href="/#contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 min-w-[150px]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6" />
        </div>
      </div>
    </section>
  )
}
