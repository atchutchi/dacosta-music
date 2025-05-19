"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCsrfToken } from "@/app/actions/csrf-actions"
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string>("")

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken()
        setCsrfToken(token)
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }

    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus({
        type: "error",
        message: "Please enter your email address.",
      })
      return
    }

    if (!csrfToken) {
      setStatus({
        type: "error",
        message: "Security token missing. Please refresh the page and try again.",
      })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("csrf_token", csrfToken)

      const result = await subscribeToNewsletter(formData)

      if (result.success) {
        setStatus({
          type: "success",
          message: result.message || "Thank you for subscribing!",
        })
        setEmail("")

        // Get a new CSRF token for the next submission
        const newToken = await getCsrfToken()
        setCsrfToken(newToken)
      } else {
        setStatus({
          type: "error",
          message: result.error || "Failed to subscribe. Please try again.",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.type === "error" && (
        <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-md text-sm">
          {status.message}
        </div>
      )}

      {status.type === "success" && (
        <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded-md text-sm">
          {status.message}
        </div>
      )}

      {/* Hidden CSRF token field */}
      <input type="hidden" name="csrf_token" value={csrfToken} />

      <Input
        type="email"
        name="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 focus:outline-none focus:border-white"
        required
      />
      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90"
        disabled={isSubmitting || !csrfToken}
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  )
}
