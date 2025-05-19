"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import Link from "next/link"

interface Artist {
  id: string
  name: string
  logo: string
  image: string
  bio: string
  socials: {
    instagram: string
    twitter: string
    website: string
  }
}

export default function RosterSection() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null)

  const artists: Artist[] = [
    {
      id: "caiiro",
      name: "Caiiro",
      logo: "/images/caiiro-logo-branco.png",
      image: "/images/Caiiro-VIII.jpg",
      bio: "Renowned for his emotionally charged soundscapes and powerful Afro-Tech sets, Caiiro is one of Africa’s most prominent electronic music exports. With a global fan base and standout performances across Europe, the Americas, and beyond, Caiiro continues to shape the narrative of modern African dance music.",
      socials: {
        instagram: "https://www.instagram.com/caiirosa/",
        facebook:"https://www.facebook.com/CaiiroSA",
        twitter: "https://x.com/caiirosa",
        youtube: "http://www.youtube.com/@caiiromusic2445",
      },
    },
    {
      id: "dacapo",
      name: "Da Capo",
      logo: "/images/logo-branco-da-capo.png",
      image: "/images/da-capo-X.jpg",
      bio: "A visionary in Afro House and Deep Tech, Da Capo is known for his rich, layered productions and genre-defining DJ sets. A true craftsman of sound, his artistry bridges underground energy with refined musical storytelling—earning him global recognition and a dedicated audience.",
      socials: {
        instagram: "https://instagram.com/dacapo",
        twitter: "https://twitter.com/dacapo",
        website: "https://dacapo.com",
      },
    },
    {
      id: "enoonapa",
      name: "Enoo Napa",
      logo: "/images/logo-branco-enoo-napa.png",
      image: "/images/Enoo-Napa0374.jpg",
      bio: "Enoo Napa delivers cutting-edge Afro-Electronic music with a signature edge. Fusing raw energy with intricate production, his work is celebrated in clubs and festivals around the world. Bold, futuristic, and uniquely African—Enoo’s sound commands attention and respect.",
      socials: {
        instagram: "https://instagram.com/enoonapa",
        twitter: "https://twitter.com/enoonapa",
        website: "https://enoonapa.com",
      },
    },
  ]

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const imageVariants = {
    normal: {
      scale: 1,
      filter: "grayscale(0%)",
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.1,
      filter: "grayscale(0%)",
      transition: { duration: 0.5 },
    },
    initial: {
      filter: "grayscale(100%)",
      scale: 1,
    },
  }

  return (
    <section id="roster" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Artist Roster
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Representing the finest talent in African electronic music, our roster features boundary-pushing artists who
            are redefining the global dance music landscape.
          </motion.p>
        </div>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="artists">Individual Artists</TabsTrigger>
            <TabsTrigger value="b3b">B3B Concept</TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <div key={artist.id} className="group">
                  <div className="overflow-hidden rounded-lg mb-4 aspect-square">
                    <img
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="h-12 mb-4 flex items-center">
                    <img
                      src={
                        artist.id === "caiiro"
                          ? "/images/caiiro-logo-branco.png"
                          : artist.id === "dacapo"
                            ? "/images/logo-branco-da-capo.png"
                            : "/images/logo-branco-enoo-napa.png"
                      }
                      alt={`${artist.name} logo`}
                      className="h-full object-contain"
                    />
                  </div>
                  <p className="text-white/70 mb-4 line-clamp-3">{artist.bio}</p>
                  <Link href={`/artists/${artist.id}`}>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      View Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/artists">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Artists
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="b3b">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="bg-black border border-white/10">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">B3B (Back 3 Back)</h3>
                      <p className="text-white/80 mb-6">
                        A high-concept DJ collaboration series merging art, visuals, and curated sound experiences. Our
                        B3B concept brings together three of our roster artists for unique, boundary-pushing
                        performances that showcase the diversity and innovation of African electronic music.
                      </p>
                      <Link href="/b3b">
                        <Button className="bg-white text-black hover:bg-white/90">Book B3B Experience</Button>
                      </Link>
                    </div>
                    <div className="overflow-hidden rounded-lg">
                      <motion.img
                        src="/images/club-view.png"
                        alt="B3B Concept"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                        animate={{ scale: 1, filter: "grayscale(0%)" }}
                        transition={{ duration: 1 }}
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
