"use client";

import Link from "next/link";
import { 
  CalendarDays, 
  Settings, 
  Users, 
  ShoppingBag,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const adminModules = [
    {
      title: "Events",
      description: "Manage event listings and ticket links",
      icon: <CalendarDays className="h-8 w-8" />,
      link: "/admin/events",
      color: "bg-blue-500/10 text-blue-400"
    },
    {
      title: "Artists",
      description: "Manage artist profiles",
      icon: <Users className="h-8 w-8" />,
      link: "/admin/artists",
      color: "bg-red-500/10 text-red-400",
      comingSoon: true
    },
    {
      title: "Shop",
      description: "Manage products and orders",
      icon: <ShoppingBag className="h-8 w-8" />,
      link: "/admin/shop",
      color: "bg-yellow-500/10 text-yellow-400",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" className="pl-0">
                <Home className="mr-2 h-4 w-4" />
                Back to Website
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Admin Dashboard</h1>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Link 
              key={module.title} 
              href={module.comingSoon ? "#" : module.link}
              className={`block rounded-lg border border-white/10 p-6 transition-colors ${
                module.comingSoon ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
              }`}
              onClick={(e) => module.comingSoon && e.preventDefault()}
            >
              <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${module.color}`}>
                {module.icon}
              </div>
              
              <h2 className="text-xl font-bold mb-2">
                {module.title}
                {module.comingSoon && (
                  <span className="ml-2 text-xs font-normal text-white/50 rounded-full bg-white/10 px-2 py-1">
                    Coming Soon
                  </span>
                )}
              </h2>
              
              <p className="text-white/70">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 