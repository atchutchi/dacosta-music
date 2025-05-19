import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  category: string
}

export default function BlogSection() {
  const blogPosts: BlogPost[] = [
    {
      id: "post1",
      title: "B3B Concept Launches in London",
      excerpt:
        "Our innovative B3B concept made its debut at a sold-out London venue, featuring three of our top artists in a groundbreaking back-to-back set.",
      date: "April 15, 2023",
      image: "/images/crowd-lights.png",
      category: "Events",
    },
    {
      id: "post2",
      title: "Caiiro's New EP Tops Charts",
      excerpt:
        "Caiiro's latest EP 'Ancestral Rhythms' has topped the Afro House charts, cementing his position as a pioneer in the genre.",
      date: "March 22, 2023",
      image: "/images/dj-performance-2.png",
      category: "Releases",
    },
    {
      id: "post3",
      title: "African Electronic Music: A Global Movement",
      excerpt:
        "How African electronic music is reshaping the global dance music landscape and creating new cultural connections.",
      date: "February 10, 2023",
      image: "/images/crowd-pattern.png",
      category: "Features",
    },
  ]

  return (
    <section id="blog" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-white/80 max-w-2xl">
              Stay updated with the latest happenings, releases, and events from Da Costa Music and our artists.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex border-white text-white hover:bg-white/10">
            View All Posts <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-black border border-white/10 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-white/60">{post.date}</span>
                  <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-white/70 mb-4">{post.excerpt}</p>
                <Button variant="link" className="p-0 h-auto text-white hover:text-white/80">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  )
}
