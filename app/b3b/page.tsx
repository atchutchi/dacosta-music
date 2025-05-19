"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Play } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Event {
  id: string
  name: string
  date: string
  location: string
  image: string
  ticketLink: string
}

export default function B3BPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("concept")

  const upcomingEvents: Event[] = [
    {
      id: "event1",
      name: "B3B London Showcase",
      date: "June 15, 2023",
      location: "Printworks, London",
      image: "/images/crowd-lights.png",
      ticketLink: "#",
    },
    {
      id: "event2",
      name: "B3B Berlin Experience",
      date: "July 22, 2023",
      location: "Berghain, Berlin",
      image: "/images/club-view.png",
      ticketLink: "#",
    },
    {
      id: "event3",
      name: "B3B Amsterdam Special",
      date: "August 5, 2023",
      location: "Shelter, Amsterdam",
      image: "/images/crowd-pattern.png",
      ticketLink: "#",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">B3B Concept</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            A revolutionary back-to-back-to-back experience featuring three of Africa's most innovative electronic music
            artists, creating a unique sonic journey that transcends boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-lg aspect-video"
          >
            <video
              src="/videos/video-hero-section.mov"
              className="w-full h-full object-cover"
              autoPlay={isVideoPlaying}
              muted
              loop
              playsInline
              controls={isVideoPlaying}
            />
            {!isVideoPlaying && (
              <>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={() => setIsVideoPlaying(true)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full h-16 w-16 flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">What is B3B?</h2>
            <p className="text-white/80 mb-6">
              B3B (Back-to-Back-to-Back) is a high-concept DJ collaboration series that brings together three of Da
              Costa Music's premier artists—Caiiro, Da Capo, and Enoo Napa—for an unparalleled musical experience.
            </p>
            <p className="text-white/80 mb-6">
              Unlike traditional back-to-back sets, B3B is meticulously curated, with each artist bringing their
              signature sound while maintaining a cohesive narrative throughout the performance. The result is a
              seamless journey through the diverse landscape of African electronic music, from deep, soulful house to
              energetic tribal rhythms and cutting-edge tech sounds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contact">
                <Button className="bg-white text-black hover:bg-white/90">Book B3B Experience</Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                View Upcoming Events
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <div className="flex border-b border-white/10 mb-8">
            <button
              onClick={() => setActiveTab("concept")}
              className={`px-6 py-3 font-medium ${
                activeTab === "concept" ? "border-b-2 border-white text-white" : "text-white/60 hover:text-white"
              }`}
            >
              The Concept
            </button>
            <button
              onClick={() => setActiveTab("artists")}
              className={`px-6 py-3 font-medium ${
                activeTab === "artists" ? "border-b-2 border-white text-white" : "text-white/60 hover:text-white"
              }`}
            >
              The Artists
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`px-6 py-3 font-medium ${
                activeTab === "experience" ? "border-b-2 border-white text-white" : "text-white/60 hover:text-white"
              }`}
            >
              The Experience
            </button>
          </div>

          {activeTab === "concept" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Musical Innovation</h3>
                <p className="text-white/80">
                  B3B pushes the boundaries of traditional DJ performances by creating a carefully orchestrated dialogue
                  between three distinct artistic voices. Each transition is thoughtfully planned, creating a seamless
                  musical narrative that evolves throughout the night.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Visual Artistry</h3>
                <p className="text-white/80">
                  The visual elements of B3B are as important as the music. Custom-designed visuals draw inspiration
                  from African art and symbolism, projected onto state-of-the-art LED setups that transform venues into
                  immersive experiences that complement the sonic journey.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Cultural Exchange</h3>
                <p className="text-white/80">
                  At its core, B3B represents a cultural exchange—bringing African electronic music to global audiences
                  while incorporating influences from around the world. It's a celebration of diversity and unity
                  through music, breaking down barriers between genres and cultures.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "artists" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white/5 p-6 rounded-lg">
                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                  <img
                    src="/images/Caiiro-VIII.jpg"
                    alt="Caiiro"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="h-12 flex items-center mb-4">
                  <img src="/images/caiiro-logo-branco.png" alt="Caiiro" className="h-full object-contain" />
                </div>
                {/* Nome removido */}
                <p className="text-white/80 mb-4">
                  Known for his emotionally charged soundscapes and powerful Afro-Tech sets, Caiiro brings depth and
                  soul to the B3B experience.
                </p>
                <Link href="/artists/caiiro">
                  <Button variant="link" className="p-0 h-auto text-white hover:text-white/80">
                    View Profile
                  </Button>
                </Link>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                  <img
                    src="/images/da-capo-X.jpg"
                    alt="Da Capo"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="h-12 flex items-center mb-4">
                  <img src="/images/logo-branco-da-capo.png" alt="Da Capo" className="h-full object-contain" />
                </div>
                {/* Nome removido */}
                <p className="text-white/80 mb-4">
                  A visionary in Afro House and Deep Tech, Da Capo's rich, layered productions and refined musical
                  storytelling form the backbone of many B3B sets.
                </p>
                <Link href="/artists/dacapo">
                  <Button variant="link" className="p-0 h-auto text-white hover:text-white/80">
                    View Profile
                  </Button>
                </Link>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                  <img
                    src="/images/Enoo-Napa0374.jpg"
                    alt="Enoo Napa"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="h-12 flex items-center mb-4">
                  <img src="/images/logo-branco-enoo-napa.png" alt="Enoo Napa" className="h-full object-contain" />
                </div>
                {/* Nome removido */}
                <p className="text-white/80 mb-4">
                  Delivering cutting-edge Afro-Electronic music with a signature edge, Enoo Napa brings raw energy and
                  futuristic sounds to the collective.
                </p>
                <Link href="/artists/enoonapa">
                  <Button variant="link" className="p-0 h-auto text-white hover:text-white/80">
                    View Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "experience" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <ul className="space-y-4 text-white/80">
                  <li className="flex items-start">
                    <span className="inline-block h-6 w-6 rounded-full bg-white text-black flex items-center justify-center mr-3 mt-0.5">
                      1
                    </span>
                    <span>
                      A 6-hour musical journey that seamlessly blends the unique styles of three master selectors
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-6 w-6 rounded-full bg-white text-black flex items-center justify-center mr-3 mt-0.5">
                      2
                    </span>
                    <span>
                      Exclusive unreleased tracks, special edits, and surprising collaborations between the artists
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-6 w-6 rounded-full bg-white text-black flex items-center justify-center mr-3 mt-0.5">
                      3
                    </span>
                    <span>
                      State-of-the-art visuals and lighting design that transforms venues into immersive environments
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-6 w-6 rounded-full bg-white text-black flex items-center justify-center mr-3 mt-0.5">
                      4
                    </span>
                    <span>
                      A global community of music lovers united by a passion for African electronic music and culture
                    </span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="/images/crowd-lights.png"
                    alt="B3B Experience"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="/images/concert-phones.png"
                    alt="B3B Experience"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="overflow-hidden rounded-lg col-span-2">
                  <img
                    src="/images/crowd-pattern.png"
                    alt="B3B Experience"
                    className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Upcoming B3B Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="bg-white/5 rounded-lg overflow-hidden group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2 text-white/60">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <div className="flex items-center mb-4 text-white/60">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-black hover:bg-white/90">Get Tickets</Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="bg-white/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Book B3B for Your Event</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Interested in bringing the B3B experience to your venue or festival? Get in touch with our booking team to
            discuss availability, technical requirements, and pricing.
          </p>
          <Link href="/#contact">
            <Button className="bg-white text-black hover:bg-white/90">Contact Booking Team</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="h-16 mb-4 flex items-center justify-center">
              <img src="/images/caiiro-logo-branco.png" alt="Caiiro" className="h-full object-contain" />
            </div>
            <p className="text-white/70">Emotionally charged soundscapes and powerful Afro-Tech sets</p>
          </div>
          <div className="text-center">
            <div className="h-16 mb-4 flex items-center justify-center">
              <img src="/images/logo-branco-da-capo.png" alt="Da Capo" className="h-full object-contain" />
            </div>
            <p className="text-white/70">Rich, layered productions and refined musical storytelling</p>
          </div>
          <div className="text-center">
            <div className="h-16 mb-4 flex items-center justify-center">
              <img src="/images/logo-branco-enoo-napa.png" alt="Enoo Napa" className="h-full object-contain" />
            </div>
            <p className="text-white/70">Raw energy and futuristic sounds with a signature edge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
