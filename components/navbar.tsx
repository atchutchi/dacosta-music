"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Check for cart items in localStorage
    const savedCart = localStorage.getItem("dacosta-cart")
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      const count = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)
      setCartCount(count)
    }

    // Listen for cart updates
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem("dacosta-cart")
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const count = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/artists", label: "Roster" },
    { href: "/events", label: "Events" },
    { href: "/services", label: "Services" },
    { href: "/#contact", label: "Contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-branco-dacosta.png"
            alt="Da Costa Music"
            width={120}
            height={60}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm uppercase tracking-wider hover:text-white/80 transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-l border-white/20">
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-8">
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-xl font-medium">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-8">
                  <p className="text-sm text-white/60">© {new Date().getFullYear()} Da Costa Music</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
