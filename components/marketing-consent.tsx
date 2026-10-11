'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createMetaPixel, type PixelWindow } from '@/lib/meta-pixel'

const STORAGE_KEY = 'dacosta-marketing-consent-v1'
const SETTINGS_EVENT = 'dacosta-cookie-settings'

export default function MarketingConsent({ nonce }: { nonce: string }) {
  const pathname = usePathname()
  const pixel = useRef<ReturnType<typeof createMetaPixel> | null>(null)
  const [choice, setChoice] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    pixel.current ??= createMetaPixel(window as PixelWindow, document, nonce)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setChoice(stored === 'accepted' ? true : stored === 'rejected' ? false : null)
      setOpen(stored !== 'accepted' && stored !== 'rejected')
    } catch {
      setOpen(true)
    }
    const showSettings = () => setOpen(true)
    window.addEventListener(SETTINGS_EVENT, showSettings)
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings)
  }, [nonce])

  useEffect(() => {
    pixel.current?.consent(choice === true)
    if (pathname) pixel.current?.pageView(pathname)
  }, [choice, pathname])

  function choose(accepted: boolean) {
    try { localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'rejected') } catch { /* Preferência válida durante esta visita. */ }
    setChoice(accepted)
    setOpen(false)
  }

  if (!open || pathname?.startsWith('/admin')) return null
  return (
    <section aria-label="Cookie preferences" className="fixed bottom-0 inset-x-0 z-[100] border-t border-white/20 bg-black px-5 py-5 shadow-2xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-semibold">Your privacy choices</p>
          <p className="mt-1 text-sm text-white/75">We use essential storage for your cart. With your permission, the Meta Pixel helps us measure advertising on Facebook and Instagram. You can change your choice in Cookie settings at any time. <Link href="/privacy" className="underline">Privacy Policy</Link></p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => choose(false)} className="rounded-md border border-white px-4 py-2 text-sm">Reject marketing cookies</button>
          <button type="button" onClick={() => choose(true)} className="rounded-md border border-white bg-white px-4 py-2 text-sm text-black">Accept marketing cookies</button>
        </div>
      </div>
    </section>
  )
}
