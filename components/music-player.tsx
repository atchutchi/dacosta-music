"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Track {
  id: string
  title: string
  artist: string
  artistId?: string
  albumId?: string
  albumTitle?: string
  coverUrl?: string
  audioUrl: string
  duration: number
}

interface MusicPlayerProps {
  tracks: Track[]
  initialTrackIndex?: number
  onTrackChange?: (track: Track) => void
  className?: string
}

export function MusicPlayer({ tracks, initialTrackIndex = 0, onTrackChange, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    // Inicializar elemento de áudio
    if (!audioRef.current) {
      audioRef.current = new Audio()

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration)
          setIsLoading(false)
        }
      })

      audioRef.current.addEventListener("ended", () => {
        nextTrack()
      })

      audioRef.current.addEventListener("error", (e) => {
        console.error("Erro ao carregar áudio:", e)
        setIsLoading(false)
      })
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("loadedmetadata", () => {})
        audioRef.current.removeEventListener("ended", () => {})
        audioRef.current.removeEventListener("error", () => {})
      }
    }
  }, [])

  useEffect(() => {
    // Atualizar fonte de áudio quando a faixa muda
    if (audioRef.current && currentTrack) {
      setIsLoading(true)
      audioRef.current.src = currentTrack.audioUrl
      audioRef.current.load()

      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            startProgressAnimation()
          })
          .catch((error) => {
            console.error("Erro ao reproduzir áudio:", error)
            setIsPlaying(false)
          })
      }

      if (onTrackChange) {
        onTrackChange(currentTrack)
      }
    }
  }, [currentTrackIndex, currentTrack, onTrackChange])

  useEffect(() => {
    // Atualizar volume
    if (audioRef.current) {
      const newVolume = volume / 100
      audioRef.current.volume = newVolume
    }
  }, [volume])

  useEffect(() => {
    // Atualizar estado de áudio quando isPlaying muda
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            startProgressAnimation()
          })
          .catch((error) => {
            console.error("Erro ao reproduzir áudio:", error)
            setIsPlaying(false)
          })
      } else {
        audioRef.current.pause()
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTime(0)
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)
  }

  const prevTrack = () => {
    setCurrentTime(0)
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

    return `${minutes}:${returnedSeconds}`
  }

  const startProgressAnimation = () => {
    if (audioRef.current) {
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  const whilePlaying = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
    animationRef.current = requestAnimationFrame(whilePlaying)
  }

  const handleTimeSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  return (
    <div className={cn("rounded-lg bg-secondary p-4 w-full", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{currentTrack?.title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack?.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevTrack}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={nextTrack}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{calculateTime(currentTime)}</span>
        <Slider max={duration} value={[currentTime]} onValueChange={handleTimeSliderChange} className="flex-1" />
        <span className="text-sm text-muted-foreground">{calculateTime(duration)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Slider value={[volume]} onValueChange={handleVolumeChange} className="w-[80px]" />
      </div>
    </div>
  )
}
