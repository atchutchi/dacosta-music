import { pageMetadata } from '@/lib/page-metadata'
export const metadata = pageMetadata('Artist management and worldwide bookings','/','Artist management, worldwide bookings and official merchandise from Da Costa Music.')
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import RosterSection from "@/components/roster-section"
import MusicSection from "@/components/music-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <AboutSection />

      <RosterSection />

      <section aria-labelledby="merch-title" className="container mx-auto px-4 py-16">
        <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
          <h2 id="merch-title" className="text-3xl font-bold mb-4">Official merchandise</h2>
          <p className="text-white/70 mb-6">Discover AKHET and Caiiro limited edition t-shirts. Shipping from Amsterdam.</p>
          <Button asChild className="bg-white text-black hover:bg-white/90"><Link href="/shop">Shop merchandise</Link></Button>
        </div>
      </section>

      <MusicSection />

      <Suspense fallback={<div className="py-20 text-center">Loading contact form...</div>}><ContactSection /></Suspense>
    </div>
  )
}
