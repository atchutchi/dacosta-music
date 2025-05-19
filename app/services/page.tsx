"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Briefcase, Globe, Plane, User, Image, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const services = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Turnkey Service",
      description: "We provide end-to-end solutions for events, tours, and campaigns — from creative planning to full execution — allowing artists and partners to focus solely on performance and impact."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Worldwide Booking",
      description: "With a global network of promoters, venues, and festivals, we manage all aspects of international bookings, ensuring strategic alignment and exposure for our artists."
    },
    {
      icon: <Plane className="h-8 w-8" />,
      title: "Travel & Logistics Management",
      description: "We coordinate all travel, accommodation, and technical requirements, offering seamless logistics and peace of mind for artists and event partners."
    },
    {
      icon: <User className="h-8 w-8" />,
      title: "Artist Management",
      description: "We offer full-spectrum artist representation, focusing on career development, strategic positioning, and long-term growth across music, media, and branding."
    },
    {
      icon: <Image className="h-8 w-8" />,
      title: "Artist Image & Branding",
      description: "From visual identity to storytelling, we help artists craft a unique and consistent image across platforms, aligning with their sound, values, and audience."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Artist Finance & Administrative Organization",
      description: "We provide structured financial oversight, contract management, royalty tracking, and day-to-day administration to keep our artists professionally supported and scalable."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Comprehensive solutions designed to elevate artists and events in the electronic music industry.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 p-8 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              <div className="text-white mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-white/80">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Experience?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Contact our team to discuss how our services can benefit your project or event.
          </p>
          <Link href="/#contact">
            <Button className="bg-white text-black hover:bg-white/90">Contact for Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 