import { NextResponse } from "next/server"
import { validateCsrfToken } from "@/lib/csrf"
import { sendContactFormEmailAlt } from "@/lib/email-alt"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, subject, message, csrf_token } = body

    // Validate CSRF token
    const isValidToken = validateCsrfToken(csrf_token)
    if (!isValidToken) {
      return NextResponse.json({ error: "Invalid security token" }, { status: 403 })
    }

    // Validate form data
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Send email using Resend
    try {
      await sendContactFormEmailAlt({
        name,
        email,
        subject,
        message
      })
      
      return NextResponse.json({
        success: true,
        message: "Your message has been sent! We'll get back to you soon.",
      })
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      return NextResponse.json({ 
        error: "Failed to send email. Please try again later." 
      }, { 
        status: 500 
      })
    }
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process form submission" }, { status: 500 })
  }
}
