"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  image: string
  category: string
  slug: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching blog post data
    const fetchPost = () => {
      const blogPosts: BlogPost[] = [
        {
          id: "post1",
          title: "B3B Concept Launches in London",
          excerpt:
            "Our innovative B3B concept made its debut at a sold-out London venue, featuring three of our top artists in a groundbreaking back-to-back set.",
          content: `
            <p>The electronic music scene in London witnessed a groundbreaking event last weekend as Da Costa Music's innovative B3B concept made its official debut at a sold-out venue in the heart of the city.</p>
            
            <p>The concept, which brings together three of our top artists—Caiiro, Da Capo, and Enoo Napa—in a seamless back-to-back performance, has been in development for months. The result was nothing short of spectacular, with the three artists delivering a six-hour journey through the diverse landscape of African electronic music.</p>
            
            <p>"We wanted to create something that goes beyond the typical b2b format," explains the creative director behind the concept. "The B3B experience is carefully curated, with each artist bringing their unique sound while maintaining a cohesive narrative throughout the night."</p>
            
            <p>The visual elements of the show were equally impressive, featuring custom-designed visuals that drew inspiration from African art and symbolism, projected onto a state-of-the-art LED setup that transformed the venue into an immersive experience.</p>
            
            <p>Attendees were treated to exclusive unreleased tracks, special edits, and surprising collaborations between the three artists. The energy in the room was electric, with the crowd responding enthusiastically to the seamless transitions and musical journey.</p>
            
            <p>"This is just the beginning," says Da Costa Music's founder. "We're planning to take the B3B concept on tour, bringing this unique experience to major cities around the world. The response has been overwhelming, and we're excited about the future of this project."</p>
            
            <p>Following the success of the London debut, dates for the B3B world tour will be announced in the coming weeks. Stay tuned for more information and make sure to secure your tickets early, as the London event sold out within hours of tickets going on sale.</p>
          `,
          date: "April 15, 2023",
          author: "Da Costa Team",
          image: "/images/crowd-lights.png",
          category: "Events",
          slug: "b3b-concept-launches-in-london",
        },
        {
          id: "post2",
          title: "Caiiro's New EP Tops Charts",
          excerpt:
            "Caiiro's latest EP 'Ancestral Rhythms' has topped the Afro House charts, cementing his position as a pioneer in the genre.",
          content: `
            <p>In a testament to his growing influence in the global electronic music scene, Caiiro's latest EP 'Ancestral Rhythms' has claimed the top spot on multiple Afro House charts within days of its release.</p>
            
            <p>The four-track EP, which showcases Caiiro's signature blend of deep, emotive melodies and powerful African rhythms, has resonated with audiences worldwide, further cementing his position as a pioneer in the genre.</p>
            
            <p>"This EP represents a return to my roots," Caiiro explains. "I wanted to create something that honors traditional African musical elements while pushing the boundaries of contemporary electronic production."</p>
            
            <p>The lead track, "Rhythmic Journey," has been particularly well-received, with support from major DJs and radio stations across Europe, Africa, and the Americas. The track's hypnotic percussion and soaring vocal samples have made it a staple in sets from Ibiza to Johannesburg.</p>
            
            <p>Critics have praised the EP for its production quality and emotional depth. One reviewer described it as "a masterclass in Afro House production, balancing technical precision with raw emotional power."</p>
            
            <p>The success of 'Ancestral Rhythms' comes at an exciting time for Caiiro, who is preparing for a busy summer season with performances scheduled at major festivals and venues around the world.</p>
            
            <p>"I'm grateful for the reception the EP has received," says Caiiro. "It's always special when music that comes from such a personal place connects with people globally. This is just the beginning of a new chapter."</p>
            
            <p>'Ancestral Rhythms' is available now on all major streaming platforms. Caiiro will be celebrating the EP's success with a special livestream performance next week, details of which will be announced on his social media channels.</p>
          `,
          date: "March 22, 2023",
          author: "Music Editor",
          image: "/images/dj-performance-2.png",
          category: "Releases",
          slug: "caiiros-new-ep-tops-charts",
        },
        {
          id: "post3",
          title: "African Electronic Music: A Global Movement",
          excerpt:
            "How African electronic music is reshaping the global dance music landscape and creating new cultural connections.",
          content: `
            <p>In recent years, African electronic music has emerged as a powerful force in the global dance music landscape, reshaping sounds, influencing major artists, and creating new cultural connections across continents.</p>
            
            <p>What began as regional scenes in cities like Johannesburg, Lagos, and Cape Town has evolved into a global movement that's impossible to ignore. Genres like Afro House, Afro Tech, and Amapiano have transcended geographical boundaries, finding enthusiastic audiences from Berlin to Tokyo, London to New York.</p>
            
            <p>"We're witnessing a significant shift in the electronic music ecosystem," explains a prominent music anthropologist. "African electronic music isn't just being incorporated into Western sounds—it's leading the conversation and setting new directions for the industry as a whole."</p>
            
            <p>This rise hasn't happened in isolation. It represents years of groundwork by pioneering artists, labels, and promoters who believed in the universal appeal of these sounds long before they reached mainstream recognition.</p>
            
            <p>Artists like Black Coffee, who became the first South African to win a Grammy for Best Dance/Electronic Album, have opened doors for a new generation of talent. Labels dedicated to African electronic music have proliferated, providing platforms for artists to reach global audiences.</p>
            
            <p>Da Costa Music has been at the forefront of this movement, representing artists who are pushing the boundaries of what African electronic music can be. "Our mission has always been to showcase the incredible talent coming from the continent," says the agency's founder. "What we're seeing now is the result of years of dedication and artistic innovation."</p>
            
            <p>The impact extends beyond music. This movement has created new cultural dialogues, business opportunities, and collaborative spaces. Festivals dedicated to African electronic music are drawing international crowds, while fashion, visual arts, and technology are all being influenced by this cultural exchange.</p>
            
            <p>As we look to the future, it's clear that African electronic music will continue to evolve and shape global dance music culture. With streaming platforms making music more accessible than ever and a new generation of artists emerging with fresh perspectives, this is just the beginning of a movement that's redefining what electronic music can be in the 21st century.</p>
          `,
          date: "February 10, 2023",
          author: "Cultural Analyst",
          image: "/images/crowd-pattern.png",
          category: "Features",
          slug: "african-electronic-music-global-movement",
        },
        {
          id: "post4",
          title: "Da Capo's European Tour Announced",
          excerpt:
            "Da Capo announces dates for his highly anticipated European tour, spanning 10 cities across the continent.",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
          date: "January 28, 2023",
          author: "Tour Manager",
          image: "/images/dj-white-shirt.png",
          category: "Tours",
          slug: "da-capo-european-tour-announced",
        },
        {
          id: "post5",
          title: "The Evolution of Afro House: Past, Present, and Future",
          excerpt: "A deep dive into the origins, current state, and future directions of Afro House music.",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
          date: "December 15, 2022",
          author: "Music Historian",
          image: "/images/dj-red-light.png",
          category: "Features",
          slug: "evolution-of-afro-house",
        },
        {
          id: "post6",
          title: "Enoo Napa Collaborates with International Artists",
          excerpt:
            "Enoo Napa's latest project features collaborations with renowned international artists, bridging cultural divides through music.",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
          date: "November 5, 2022",
          author: "Collaboration Specialist",
          image: "/images/club-view.png",
          category: "Collaborations",
          slug: "enoo-napa-international-collaborations",
        },
      ]

      const foundPost = blogPosts.find((p) => p.slug === slug)
      setPost(foundPost || null)

      // Find related posts (same category)
      if (foundPost) {
        const related = blogPosts.filter((p) => p.category === foundPost.category && p.id !== foundPost.id).slice(0, 3)
        setRelatedPosts(related)
      }

      setIsLoading(false)
    }

    fetchPost()
  }, [slug])

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

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the blog post you're looking for.</p>
          <Link href="/blog">
            <Button>View All Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block text-xs uppercase tracking-wider bg-white/10 px-3 py-1 rounded mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center text-white/60 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span>Share</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        "_blank",
                      )
                    }
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    <span>Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                        "_blank",
                      )
                    }
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    <span>Twitter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyToClipboard}>
                    <Link2 className="h-4 w-4 mr-2" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-12">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
            <div
              className="prose prose-invert max-w-none prose-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {relatedPosts.length > 0 && (
            <div className="border-t border-white/10 pt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="bg-black border border-white/10 overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </Link>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <h3 className="font-bold mb-2 hover:text-white/80 transition-colors duration-300">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-white/60 mb-2">{relatedPost.date}</p>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="link" className="p-0 h-auto text-white hover:text-white/80 text-sm">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
