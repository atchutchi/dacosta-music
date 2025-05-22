"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Instagram, Twitter, Globe, Facebook, Music, Headphones, Youtube, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Event {
  id: string
  name: string
  date: string
  location: string
  ticketLink: string
  image?: string
  artistId?: string
  description?: string
}

interface Artist {
  id: string
  name: string
  logo: string
  image: string
  secondaryImage: string
  bio: string
  longBio: string
  genres: string[]
  stats: {
    streams?: string
    views?: string
    youtube?: string
    subscribers?: string
    followers: {
      instagram?: string
      twitter?: string
      facebook?: string
      spotify?: string
      youtube?: string
      soundcloud?: string
    }
  }
  discography: {
    albums?: Array<{
      title: string
      year: string
    }>
    eps?: Array<{
      title: string
      year: string
    }>
    tracks: Array<{
      title: string
      featuring?: string
      type?: string
    }>
  }
  liveSets: Array<{
    title: string
    url: string
  }>
  socials: {
    instagram: string
    twitter: string
    website: string
    facebook?: string
    spotify?: string
    soundcloud?: string
    youtube?: string
  }
  tracks: {
    id: string
    title: string
    duration: string
  }[]
  events: {
    id: string
    name: string
    date: string
    location: string
    ticketLink: string
  }[]
  gallery: string[]
}

export default function ArtistPage() {
  const params = useParams()
  const artistSlug = params.slug as string
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artistEvents, setArtistEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Fetch artist data
    const fetchArtist = () => {
      const artists: Artist[] = [
        {
          id: "caiiro",
          name: "Caiiro",
          logo: "/images/caiiro-logo-branco.png",
          image: "/images/dj-performance-1.png",
          secondaryImage: "/images/caiiro-photo-profile.png",
          bio: "Renowned for his emotionally charged soundscapes and powerful Afro-Tech sets.",
          longBio:
            'Patrick Dumisani Mahlangu, known as Caiiro, is a leading South African DJ and producer in the global house music scene. Inspired by Egyptian history and diverse cultures, his unique sound has attracted a worldwide audience. His third album, Pyramids (2022), was a breakthrough success, cementing his status in electronic music.\n\nCaiiro has performed in 30+ countries across five continents, with his track "The Akan" becoming a viral sensation on major electronic stages. His remix collaboration with Adam Port on "Your Voice" became one of the year\'s biggest house hits, earning him recognition as one of 1001 Tracklists\' most influential producers in 2022.\n\nHis latest release, the self-titled album Caiiro (July 2024), has gained strong industry and listener support. It surpassed one million streams in its first month and exceeded 10 million Spotify streams in six months. Mixmag named him among the "DJs Who Defined the Year".',
          genres: ["Afro House", "Deep Tech", "Afro Tech"],
          stats: {
            streams: "90M",
            youtube: "116M",
            followers: {
              instagram: "150K",
              facebook: "467K",
            },
          },
          discography: {
            albums: [
              { title: "Agora", year: "2020" },
              { title: "Pyramids", year: "2022" },
              { title: "Caiiro", year: "2024" },
            ],
            tracks: [
              { title: "The Akan" },
              { title: "Your Voice Remix", featuring: "AWEN, Adam Port" },
              { title: "Bayede (Caiiro Remix)", featuring: "DJ Kabila" },
              { title: "Ndisize", featuring: "Amu Fati" },
            ],
          },
          liveSets: [
            { title: "Live From Descendants New York 2024", url: "https://youtu.be/aFdXXor046w" },
            { title: "Live From Defected HQ", url: "https://youtu.be/NZYPi8SCR_s" },
          ],
          socials: {
            instagram: "https://www.instagram.com/caiirosa/",
            twitter: "https://x.com/caiirosa",
            website: "https://caiiro.com",
            facebook: "https://www.facebook.com/CaiiroSA",
            spotify: "https://open.spotify.com/intl-pt/artist/0fs9otT9TtwXUOcFXZomZY",
            soundcloud: "https://soundcloud.com/caiirosa",
            youtube: "http://www.youtube.com/@caiiromusic2445"
          },
          tracks: [
            { id: "track1", title: "The Akan", duration: "6:24" },
            { id: "track2", title: "Your Voice (Remix)", duration: "7:15" },
            { id: "track3", title: "Bayede (Remix)", duration: "5:48" },
            { id: "track4", title: "Ndisize ft. Amu Fati", duration: "6:52" },
            { id: "track5", title: "Pyramids", duration: "8:10" },
          ],
          events: [
            {
              id: "event1",
              name: "Afro House Experience",
              date: "June 15, 2023",
              location: "London, UK",
              ticketLink: "#",
            },
            {
              id: "event2",
              name: "Summer Vibes Festival",
              date: "July 22, 2023",
              location: "Berlin, Germany",
              ticketLink: "#",
            },
            {
              id: "event3",
              name: "Club Night Special",
              date: "August 5, 2023",
              location: "Johannesburg, SA",
              ticketLink: "#",
            },
          ],
          gallery: [
            "/images/caiiro-photo-profile.png",
            "/images/Caiiro-VIII.jpg",
            "/images/caiiro-new-photo.jpeg",
            "/images/Caiiro-IV.jpg",
          ],
        },
        {
          id: "dacapo",
          name: "Da Capo",
          logo: "/images/logo-branco-da-capo.png",
          image: "/images/dj-white-shirt.png",
          secondaryImage: "/images/da-capo-photo-profile.png",
          bio: "A visionary in Afro House and Deep Tech, known for rich, layered productions.",
          longBio:
            "Da Capo, born Nicodimas Mogashoa, is a self-taught South African DJ and producer renowned for his innovative approach to music. His stage name, 'Da Capo,' signifies a commitment to constant evolution.\n\nHaving signed with DNH Records at 20, Da Capo quickly made his mark in the Afro House scene. His 2014 debut album featured collaborations with notable vocalists. Joining Soulistic Music in 2015, he released the acclaimed 'Touched' EP in 2016.\n\nIn 2017, the highly anticipated 'Indigo Child Part I' album showcased his versatile sound, garnering over 38 million streams. Platinum-certified singles like 'Africa' and 'Kelaya' solidified his global impact. In 2020, Da Capo founded Genesys Entity, releasing hits like 'Yehla Moja.'\n\nHis international presence is evident in performances at iconic venues like OUTPUT in New York and Hï Ibiza in Ibiza. Da Capo's unwavering commitment to musical excellence continues to redefine the global house music landscape.",
          genres: ["Afro House", "Deep House", "Electronic"],
          stats: {
            streams: "85M",
            views: "14M",
            followers: {
              instagram: "250K",
              facebook: "663K",
            },
          },
          discography: {
            albums: [
              { title: "Da Capo", year: "2014" },
              { title: "Indigo Child Part I", year: "2017" },
              { title: "Genesys", year: "2020" },
              { title: "Return To The Beginning", year: "2021" },
              { title: "Bakone", year: "2023" },
            ],
            eps: [{ title: "Kunye EP6 Da Capo", year: "2023" }],
            tracks: [
              { title: "Afrika", featuring: "Tshepo King" },
              { title: "Umbovukazi" },
              { title: "Mama (Da Capo's Touch)" },
              { title: "Secret ID", featuring: "Moojo" },
            ],
          },
          liveSets: [{ title: "Kunye EP6 Da Capo", url: "https://youtu.be/j8w9SSlSk3I" }],
          socials: {
            instagram: "https://www.instagram.com/dacaposa/",
            twitter: "https://x.com/DacapoSA",
            website: "https://dacapo.com",
            facebook: "https://www.facebook.com/DaCapoSA",
            spotify: "https://open.spotify.com/intl-pt/artist/4YuviELTmYBvDR66ThrMy9?si=_bnI4mQKSuiOBBau8elOjQ",
            soundcloud: "https://soundcloud.com/da-capo",
            youtube: "https://www.youtube.com/@dacapo9380"
          },
          tracks: [
            { id: "track6", title: "Afrika ft. Tshepo King", duration: "7:15" },
            { id: "track7", title: "Umbovukazi", duration: "8:10" },
            { id: "track8", title: "Mama (Da Capo's Touch)", duration: "8:20" },
            { id: "track9", title: "Secret ID ft. Moojo", duration: "7:05" },
            { id: "track10", title: "Indigo Child", duration: "6:18" },
          ],
          events: [
            {
              id: "event4",
              name: "Deep House Sessions",
              date: "May 28, 2023",
              location: "Amsterdam, Netherlands",
              ticketLink: "#",
            },
            {
              id: "event5",
              name: "Electronic Nights",
              date: "June 10, 2023",
              location: "Barcelona, Spain",
              ticketLink: "#",
            },
            {
              id: "event6",
              name: "African Beats Festival",
              date: "July 15, 2023",
              location: "Cape Town, SA",
              ticketLink: "#",
            },
          ],
          gallery: [
            "/images/Da-Capo-IX.jpg",
            "/images/dj-white-shirt.png",
            "/images/da-capo-photo-profile.png",
            "/images/dj-closeup.png",
          ],
        },
        {
          id: "enoonapa",
          name: "Enoo Napa",
          logo: "/images/logo-branco-enoo-napa.png",
          image: "/images/dj-red-light.png",
          secondaryImage: "/images/enoo-napa-photo-profile.png",
          bio: "Delivers cutting-edge Afro-Electronic music with a signature edge.",
          longBio:
            "Enoo Napa, the self-taught Afro House and Afro Tech maestro from Durban, South Africa, made his mark in 2013 with a distinctive fusion of Afro House basslines and tech synths. His transformative remix of Jackie Queen's \"Conqueror\" in 2015, catching the ears of international DJs, notably Black Coffee, marked a pivotal moment in his career.\n\nOver the last 5 years, Enoo Napa has not only remixed for industry giants like Black Coffee, Mi Casa, and others but also graced prestigious stages such as Hi Ibiza, Circoloco Ibiza, and Scorpios Mykonos. His tracks, released on acclaimed labels like MoBlack and Offering Recordings, position him as a rising star in the global house music scene.\n\nAnticipation is building for Enoo Napa's highly awaited debut album, set to release in mid-2024. As a key contributor to the exposure and evolution of the Afro House/Tech sound, he is not just reshaping the cultural definition of house music but also building a movement and promising further innovation for the global house music scene.",
          genres: ["Afro Tech", "Tribal House", "Progressive"],
          stats: {
            streams: "10M",
            followers: {
              instagram: "105K",
              facebook: "238K",
              soundcloud: "12K",
            },
          },
          discography: {
            eps: [
              { title: "Behind These Walls", year: "2019" },
              { title: "Elements", year: "2019" },
              { title: "Drones", year: "2020" },
              { title: "Mind Control", year: "2021" },
              { title: "Two Zulu Men In Ibiza", year: "2022" },
            ],
            tracks: [
              { title: "Your Voice (Enoo Napa Remix)", featuring: "Caiiro x Awen" },
              { title: "Brocode", featuring: "DJ Merlon x Enoo Napa" },
            ],
          },
          liveSets: [{ title: "Enoo Napa at U'R 2022", url: "https://youtu.be/DdAwaMUnCUw" }],
          socials: {
            instagram: "https://www.instagram.com/enoonapa/",
            twitter: "https://x.com/enoonapa",
            website: "https://enoonapa.com",
            facebook: "https://www.facebook.com/EnooNapaSA",
            spotify: "https://open.spotify.com/intl-pt/artist/5KPid3HkjjnBN4PeUqllHC",
            soundcloud: "https://soundcloud.com/enoo-napa",
            youtube: "https://www.youtube.com/@EnooNapa"
          },
          tracks: [
            { id: "track11", title: "Behind These Walls", duration: "5:48" },
            { id: "track12", title: "Elements", duration: "7:32" },
            { id: "track13", title: "Drones", duration: "7:05" },
            { id: "track14", title: "Mind Control", duration: "6:55" },
            { id: "track15", title: "Two Zulu Men In Ibiza", duration: "6:40" },
          ],
          events: [
            {
              id: "event7",
              name: "Tech House Night",
              date: "June 3, 2023",
              location: "Paris, France",
              ticketLink: "#",
            },
            {
              id: "event8",
              name: "Progressive Sessions",
              date: "July 8, 2023",
              location: "Miami, USA",
              ticketLink: "#",
            },
            {
              id: "event9",
              name: "Tribal Gathering",
              date: "August 19, 2023",
              location: "Lagos, Nigeria",
              ticketLink: "#",
            },
          ],
          gallery: [
            "/images/enoo-napa-photo-profile.png",
            "/images/enoo-napa-photo.jpg",
            "/images/Enoo-Napa0374.jpg",
            "/images/enoo-napa-i.jpg",
          ],
        },
      ]

      const foundArtist = artists.find((a) => a.id === artistSlug)
      setArtist(foundArtist || null)
      
      // Try to get events from localStorage
      const savedEvents = localStorage.getItem("dacosta-events");
      if (savedEvents) {
        const allEvents = JSON.parse(savedEvents);
        // Filter events for this artist
        const filteredEvents = allEvents.filter((event: Event) => event.artistId === artistSlug);
        setArtistEvents(filteredEvents);
      } else if (foundArtist) {
        // If no events in localStorage, use the default events
        setArtistEvents(foundArtist.events.map(event => ({
          ...event,
          artistId: foundArtist.id,
          image: foundArtist.gallery[0] // Use first gallery image as event image
        })));
      }
      
      setIsLoading(false)
    }

    fetchArtist()
  }, [artistSlug])

  // Handle image error
  const handleImageError = (index: number) => {
    setImageError((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-48 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the artist you're looking for.</p>
          <Link href="/artists">
            <Button>View All Artists</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Function to split the longBio into paragraphs
  const bioParagraphs = artist.longBio.split("\n\n")

  // Fallback image for when an image fails to load
  const fallbackImage = "/diverse-music-artists.png"

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/artists">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Main Artist Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-lg border border-white/10 bg-black p-8 mb-16"
        >
          {/* DC Logo */}
          <div className="mb-6">
            <img
              src="/images/logo-branco-dacosta.png"
              alt="Da Costa Music"
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackImage
              }}
            />
          </div>

          {/* Artist Logo */}
          <div className="mb-10 flex justify-center">
            <img
              src={
                params.slug === "caiiro"
                  ? "/images/caiiro-logo-branco.png"
                  : params.slug === "dacapo"
                    ? "/images/logo-branco-da-capo.png"
                    : "/images/logo-branco-enoo-napa.png"
              }
              alt={`${artist.name} logo`}
              className="h-16 object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackImage
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Bio */}
            <div>
              {bioParagraphs.map((paragraph, index) => (
                <p key={index} className="text-white/80 mb-6">
                  {paragraph}
                </p>
              ))}

              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 my-8">
                {artist.stats.streams && (
                  <div className="bg-black border border-white/10 p-4 rounded-lg text-center min-w-[100px]">
                    <p className="text-2xl font-bold">{artist.stats.streams}</p>
                    <p className="text-sm text-white/60">Streams</p>
                  </div>
                )}
                {artist.stats.youtube && (
                  <div className="bg-black border border-white/10 p-4 rounded-lg text-center min-w-[100px]">
                    <p className="text-2xl font-bold">{artist.stats.youtube}</p>
                    <p className="text-sm text-white/60">YouTube</p>
                  </div>
                )}
                {artist.stats.followers?.instagram && (
                  <div className="bg-black border border-white/10 p-4 rounded-lg text-center min-w-[100px]">
                    <p className="text-2xl font-bold">{artist.stats.followers.instagram}</p>
                    <p className="text-sm text-white/60">Instagram</p>
                  </div>
                )}
                {artist.stats.followers?.facebook && (
                  <div className="bg-black border border-white/10 p-4 rounded-lg text-center min-w-[100px]">
                    <p className="text-2xl font-bold">{artist.stats.followers.facebook}</p>
                    <p className="text-sm text-white/60">Facebook</p>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-6 mt-8">
                <a
                  href={artist.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  <span>Instagram</span>
                </a>
                {artist.socials.facebook && (
                  <a
                    href={artist.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    <span>Facebook</span>
                  </a>
                )}
                <a
                  href={artist.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                >
                  <Twitter className="h-5 w-5 mr-2" />
                  <span>X</span>
                </a>
                {artist.socials.spotify && (
                  <a
                    href={artist.socials.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <Music className="h-5 w-5 mr-2" />
                    <span>Spotify</span>
                  </a>
                )}
                {artist.socials.soundcloud && (
                  <a
                    href={artist.socials.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    <span>SoundCloud</span>
                  </a>
                )}
                {artist.socials.youtube && (
                  <a
                    href={artist.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <Youtube className="h-5 w-5 mr-2" />
                    <span>YouTube</span>
                  </a>
                )}
                <a
                  href={artist.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors duration-300"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  <span>Website</span>
                </a>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg bg-white/5">
                  {!imageError[index] ? (
                    <img
                      src={artist.gallery[index] || fallbackImage}
                      alt={`${artist.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                      <span className="text-white/50">Image not available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Artist Events */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">{artist.name}'s Upcoming Shows</h2>
          
          {artistEvents.length === 0 ? (
            <div className="text-center py-12 border border-white/10 rounded-lg bg-black/30">
              <p className="text-white/70 mb-4">No upcoming shows currently scheduled.</p>
              <Link href="/events">
                <Button variant="outline">View All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artistEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="overflow-hidden rounded-lg border border-white/10 bg-black/50 hover:bg-white/5 transition-colors group"
                >
                  {event.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{event.name}</h3>
                    
                    <div className="flex items-center mb-3 text-white/70">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center mb-6 text-white/70">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.ticketLink && event.ticketLink !== "#" ? (
                      <a 
                        href={event.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full"
                      >
                        <Button className="w-full">Get Tickets</Button>
                      </a>
                    ) : (
                      <Button disabled className="w-full opacity-50">Coming Soon</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking CTA */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Book {artist.name} for Your Event</h2>
          <Link href="/#contact">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg">Contact for Booking</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
