import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
            <p className="text-white/80 mb-6">
              Da Costa Music is a creative agency and talent management company representing a new era of electronic music. With a foundation in strategy, storytelling, and global networking, we offer a unique blend of artist development, event direction, and brand building.

              Our approach combines hands-on project management, digital growth strategies, and cultural insight—ensuring each artist, concept, and collaboration reaches its full potential. We don’t just manage talent; we build legacy.
            </p>
            <p className="text-white/80 mb-6">
              Our approach combines hands-on project management, digital growth strategies, and cultural
              insight—ensuring each artist, concept, and collaboration reaches its full potential. We don't just manage
              talent; we build legacy.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Mission Statement</h3>
                <p className="text-white/80">
                  To bridge culture, creativity, and global sound by developing standout talent and curating experiences that elevate African electronic music on the world stage.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ethos</h3>
                <p className="text-white/80">
                  We are driven by authenticity, artistic integrity, and a commitment to excellence. Every project, partnership, and performance is guided by purpose—amplifying voices, crafting powerful narratives, and building a global community rooted in music, culture, and innovation.
                </p>
              </div>
            </div>
            <Link href="/artists">
              <Button className="mt-8 bg-white text-black hover:bg-white/90">Learn More</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg h-64">
                <img src="/images/dj-closeup.png" alt="DJ Performance" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-lg h-48">
                <img src="/images/dj-duo.png" alt="DJ Performance" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="overflow-hidden rounded-lg h-48">
                <img src="/images/dj-red-light.png" alt="DJ Performance" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-lg h-64">
                <img src="/images/crowd-pattern.png" alt="Crowd" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
