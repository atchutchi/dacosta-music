"use client"

import { motion } from "framer-motion"
import { Construction, Music, Calendar, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MarqueeText from "@/components/marquee-text"

export default function ConstructionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Marquee Header */}
      <MarqueeText />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Da Costa Music
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Construction Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
              <Construction className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Site em Construção
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Estamos trabalhando para trazer uma experiência musical incrível. 
              Enquanto isso, desfrute da nossa playlist exclusiva com os melhores hits da Da Costa Music.
            </p>
          </motion.div>

          {/* Spotify Playlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Da Costa Music Selected</h3>
                    <p className="text-white/60">Nossa playlist exclusiva no Spotify</p>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden bg-black/40">
                  <iframe 
                    title="Da Costa Music Selected Spotify Playlist"
                    style={{ borderRadius: "8px" }} 
                    src="https://open.spotify.com/embed/playlist/4cVbtiKn7myAipZOflZ9rE?utm_source=generator&theme=0" 
                    width="100%" 
                    height="480" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  />
                </div>

                <div className="mt-6">
                  <Button 
                    className="bg-green-500 text-black hover:bg-green-400 font-semibold"
                    onClick={() => window.open('https://open.spotify.com/playlist/4cVbtiKn7myAipZOflZ9rE', '_blank')}
                  >
                    Ouvir no Spotify
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Music className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Música</h3>
                <p className="text-sm text-gray-400">
                  Descubra nossos artistas e suas últimas produções
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-pink-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Eventos</h3>
                <p className="text-sm text-gray-400">
                  Acompanhe shows e eventos dos nossos artistas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Newsletter</h3>
                <p className="text-sm text-gray-400">
                  Receba atualizações sobre novos lançamentos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">
              Em breve: uma experiência completa com nossos artistas, eventos e muito mais!
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Da Costa Music. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
