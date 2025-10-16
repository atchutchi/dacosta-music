"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mail, Instagram, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import emailjs from '@emailjs/browser'

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Log de depuração para as variáveis de ambiente no cliente (apenas em desenvolvimento)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("EmailJS Environment Variables (dev only):", {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "Definido" : "Não definido",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }))

    // Clear error when user selects
    if (errors.title) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.title
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.title) {
      newErrors.title = "Please select a subject"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificação explícita para o formRef
    if (!formRef.current) {
      console.error("Form reference is null");
      setErrors({ form: "An error occurred with the form. Please refresh the page." });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true)

    // Verificar se as variáveis de ambiente estão definidas
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
        !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 
        !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      console.error("EmailJS environment variables are not properly set");
      setErrors({
        form: "Configuration error. Please contact the administrator."
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Enviando formulário com EmailJS...");
      
      // Log do conteúdo do formulário
      if (process.env.NODE_ENV === "development") {
        const formData = new FormData(formRef.current);
        console.log("Form data:", Object.fromEntries(formData.entries()));
      }
      
      // Send email directly using EmailJS on the client side
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )

      console.log("EmailJS result:", result);

      if (result.status === 200) {
        // Show success message
        setIsSubmitted(true)
        setFormData({ name: "", email: "", title: "", message: "" })
      } else {
        console.error("EmailJS returned non-200 status:", result);
        throw new Error(`Failed to send email: Status ${result.status} - ${result.text}`)
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // Verificar especificamente o erro de reCAPTCHA
      if (error.text && error.text.includes("g-recaptcha-response")) {
        console.error("reCAPTCHA error detected - You need to disable reCAPTCHA in EmailJS dashboard");
        setErrors({
          form: "Error: reCAPTCHA validation failed. Please contact the administrator to disable reCAPTCHA in the EmailJS dashboard."
        });
      } else if (error.text) {
        console.error("EmailJS error details:", error.text);
        setErrors({
          form: `Error: ${error.text}`
        });
      } else {
        setErrors({
          form: error instanceof Error 
            ? `Error: ${error.message}` 
            : "An error occurred while submitting the form. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Whether you're interested in booking one of our artists, exploring collaboration opportunities, or simply
            want to connect, we'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 text-white/60" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <a href="mailto:bookings@dacosta-music.com" className="text-white/80 hover:text-white">
                    bookings@dacosta-music.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
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
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                >
                  <Youtube className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-lg p-8 text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M20 6l-11 11l-5 -5"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p className="text-white/80 mb-6">
                  Thank you for reaching out to us. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setIsSubmitted(false)} className="bg-white text-black hover:bg-white/90">
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-md">
                    {errors.form}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`bg-white/5 border-white/10 focus:border-white ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className={`bg-white/5 border-white/10 focus:border-white ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className={`bg-white/5 border-white/10 ${errors.title ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Artist Booking</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="press">Press Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="title" value={formData.title} />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    className={`min-h-[150px] bg-white/5 border-white/10 focus:border-white ${errors.message ? "border-red-500" : ""}`}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
