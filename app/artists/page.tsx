import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Artist {
  id: string
  name: string
  image: string
  bio: string
}

export default function ArtistsPage() {
  // Dados dos artistas (em um projeto real, esses dados viriam do Supabase)
  const artists: Artist[] = [
    {
      id: "caiiro",
      name: "Caiiro",
      image: "/images/Caiiro-VIII.jpg",
      bio: "Renowned for his emotionally charged soundscapes and powerful Afro-Tech sets, Caiiro is one of Africa's most prominent electronic music exports.",
    },
    {
      id: "dacapo",
      name: "Da Capo",
      image: "/images/da-capo-X.jpg",
      bio: "A visionary in Afro House and Deep Tech, Da Capo's rich, layered productions and refined musical storytelling form the backbone of many B3B sets.",
    },
    {
      id: "enoonapa",
      name: "Enoo Napa",
      image: "/images/Enoo-Napa0374.jpg",
      bio: "Delivering cutting-edge Afro-Electronic music with a signature edge, Enoo Napa brings raw energy and futuristic sounds to the collective.",
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Artists</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Representing the finest talent in African electronic music, our roster features boundary-pushing artists who
            are redefining the global dance music landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {artists.map((artist) => (
            <div key={artist.id} className="group">
              <div className="overflow-hidden rounded-lg mb-4 aspect-square">
                <img
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="h-16 mb-4 flex items-center">
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
              <p className="text-white/70 mb-4">{artist.bio}</p>
              <Link href={`/artists/${artist.id}`}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">B3B Concept</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Experience our revolutionary B3B (Back-to-Back-to-Back) concept featuring three of our top artists in a
            seamless, curated musical journey that transcends boundaries.
          </p>
          <Link href="/b3b">
            <Button className="bg-white text-black hover:bg-white/90">Learn More About B3B</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
