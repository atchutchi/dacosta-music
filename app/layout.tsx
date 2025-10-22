import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
})

export const metadata: Metadata = {
  title: "Da Costa Music - Artist Management, Global Bookings & Creative Branding",
  description: "A creative agency and talent management company representing a new era of Electronic music.",
  generator: 'Next.js',
  keywords: 'Artist management music, global bookings, creative branding, Da Costa Music',
  authors: [{ name: 'Da Costa Music' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/images/whiteICON.png',
    apple: '/images/whiteICON.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dacostamusic.com',
    title: 'Da Costa Music - Artist Management, Global Bookings & Creative Branding',
    description: 'A creative agency and talent management company representing a new era of African electronic music.',
    siteName: 'Da Costa Music',
    images: [{
      url: 'https://dacostamusic.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Da Costa Music'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Da Costa Music',
    description: 'AArtist Management, Global Bookings & Creative Branding',
    images: ['https://dacostamusic.com/twitter-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Critical resource hints - ordered by priority */}
        <link rel="preload" href="/images/whiteICON.png" as="image" type="image/webp" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//widget.bandsintown.com" />
        <link rel="dns-prefetch" href="//open.spotify.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA and mobile optimization */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Da Costa Music" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Service Worker Registration - Optimized */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('SW registered: ', registration.scope);
                      // Update available
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                          newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                              // New content available, notify user
                              console.log('New content available, please refresh.');
                            }
                          });
                        }
                      });
                    })
                    .catch(function(registrationError) {
                      console.warn('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Critical CSS inlining hint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              (function() {
                var link = document.createElement('link');
                link.rel = 'preload';
                link.href = '/videos/Video-Hero-Section.mp4';
                link.as = 'video';
                link.type = 'video/mp4';
                document.head.appendChild(link);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} min-h-screen bg-black text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
