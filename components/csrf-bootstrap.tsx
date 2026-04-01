"use client"

import { useEffect } from "react"

/** Fetches /api/csrf once so double-submit cookie exists before any mutating API calls. */
export function CsrfBootstrap() {
  useEffect(() => {
    fetch("/api/csrf", { credentials: "include" }).catch(() => {})
  }, [])
  return null
}
