import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NewsletterForm from "@/components/newsletter-form"

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

export default function BlogPage() {
  const blogPosts: BlogPost[] = [
    {
      id: "post1",
      title: "B3B Concept Launches in London",
      excerpt:
        "Our innovative B3B concept made its debut at a sold-out London venue, featuring three of our top artists in a groundbreaking back-to-back set.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
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
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
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
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
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

  const categories = [...new Set(blogPosts.map((post) => post.category))]

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

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Stay updated with the latest news, releases, and insights from Da Costa Music and our artists.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="bg-black border border-white/10 overflow-hidden h-full">
                  <div className="h-48 overflow-hidden">
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </Link>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-white/60">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-3 hover:text-white/80 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-white/70 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-white/60">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="link" className="p-0 h-auto text-white hover:text-white/80">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                <Button variant="outline" className="border-white/20 text-white/60" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="border-white text-white bg-white/10">
                  1
                </Button>
                <Button variant="outline" className="border-white/20 text-white/60">
                  2
                </Button>
                <Button variant="outline" className="border-white/20 text-white/60">
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="md:w-1/4">
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-white hover:text-white/80 transition-colors duration-300">
                    All Categories
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/blog/category/${category.toLowerCase()}`}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
              <ul className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <Link href={`/blog/${post.slug}`} className="hover:text-white/80 transition-colors duration-300">
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-white/60">{post.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Subscribe</h3>
              <p className="text-white/70 mb-4">
                Get the latest updates from Da Costa Music delivered directly to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
