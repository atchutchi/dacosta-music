type PixelCommand = unknown[]
type Fbq = ((...args: PixelCommand) => void) & {
  callMethod?: (...args: PixelCommand) => void
  queue: PixelCommand[]; push: Fbq; loaded: boolean; version: string
}
export type PixelWindow = { fbq?: Fbq; _fbq?: Fbq }

export function createMetaPixel(win: PixelWindow, doc: Pick<Document, 'createElement' | 'head'>, nonce: string) {
  let accepted = false
  let initialized = false
  let lastPath: string | null = null

  function initialize() {
    if (initialized) return
    if (!win.fbq) {
      const fbq = ((...args: PixelCommand) => {
        if (fbq.callMethod) fbq.callMethod(...args)
        else fbq.queue.push(args)
      }) as Fbq
      fbq.push = fbq
      fbq.loaded = true
      fbq.version = '2.0'
      fbq.queue = []
      win.fbq = fbq
      win._fbq = fbq
      const script = doc.createElement('script')
      script.async = true
      script.nonce = nonce
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      doc.head.appendChild(script)
    }
    win.fbq('consent', 'grant')
    win.fbq('init', '834660132483518')
    initialized = true
  }

  return {
    consent(value: boolean) {
      if (accepted === value) return
      accepted = value
      lastPath = null
      if (initialized) win.fbq?.('consent', value ? 'grant' : 'revoke')
    },
    pageView(path: string) {
      if (!accepted || path === '/admin' || path.startsWith('/admin/') || path === lastPath) return
      initialize()
      win.fbq?.('track', 'PageView')
      lastPath = path
    },
  }
}
