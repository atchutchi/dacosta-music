import { NextResponse } from "next/server"
import { validateCsrfToken } from "@/lib/csrf"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, subject, message, csrf_token } = body

    // Validate CSRF token
    const isValidToken = await validateCsrfToken(csrf_token)
    if (!isValidToken) {
      return NextResponse.json({ error: "Invalid security token" }, { status: 403 })
    }

    // Validate form data
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Retornar dados do EmailJS para o cliente
    return NextResponse.json({
      success: true,
      emailjs: {
        serviceId: process.env.EMAILJS_SERVICE_ID,
        templateId: process.env.EMAILJS_TEMPLATE_ID,
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        templateParams: {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          reply_to: email,
        }
      }
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process form submission" }, { status: 500 })
  }
}
