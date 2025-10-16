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

      <MusicSection />

      <ContactSection />
    </div>
  )
}
