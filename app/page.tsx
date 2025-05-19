import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import RosterSection from "@/components/roster-section"
import MusicSection from "@/components/music-section"
import ContactSection from "@/components/contact-section"
import MarqueeText from "@/components/marquee-text"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <MarqueeText />

      <AboutSection />

      <RosterSection />

      <MusicSection />

      <ContactSection />
    </div>
  )
}
