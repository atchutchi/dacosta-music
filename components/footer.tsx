import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo-branco-dacosta.png"
                alt="Da Costa Music"
                width={120}
                height={60}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/70 mb-6">
              A creative agency and talent management company representing a new era of African electronic music.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/dacosta_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/dacosta_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a
                href="https://facebook.com/dacosta_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/dacosta_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-white/70 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#roster" className="text-white/70 hover:text-white">
                  Artist Roster
                </Link>
              </li>
              <li>
                <Link href="/#music" className="text-white/70 hover:text-white">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/70 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/70 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Artists</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/artists/caiiro" className="text-white/70 hover:text-white">
                  Caiiro
                </Link>
              </li>
              <li>
                <Link href="/artists/dacapo" className="text-white/70 hover:text-white">
                  Da Capo
                </Link>
              </li>
              <li>
                <Link href="/artists/enoonapa" className="text-white/70 hover:text-white">
                  Enoo Napa
                </Link>
              </li>
              <li>
                <Link href="/b3b" className="text-white/70 hover:text-white">
                  B3B Concept
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} Da Costa Music. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-white/60 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white/60 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
