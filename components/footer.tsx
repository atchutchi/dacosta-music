import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube } from "lucide-react"

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/whiteICON.png"
                alt="Da Costa Music"
                width={120}
                height={60}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/70 mb-6">
              A creative agency and talent management company representing a new era of electronic music.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/dacosta_music"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/dacostamusicofc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="X (Twitter)"
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
                href="https://www.facebook.com/dacostamusicofc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@dacostamusicofc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@dacostamusicofc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
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
                  Roster
                </Link>
              </li>
              <li>
                <Link href="/#music" className="text-white/70 hover:text-white">
                  Music
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
                <Link href="/artists/djeff" className="text-white/70 hover:text-white">
                  DJEFF
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Da Costa Music. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">
              Developed by{" "}
              <Link
                href="https://www.abiptom.gw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white underline-offset-2 hover:underline"
              >
                Abiptom (www.abiptom.gw)
              </Link>
              .
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/60 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
