"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-background/70 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            EventSphere
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/events" className={`hover:text-white transition-colors ${pathname === '/events' ? 'text-white' : 'text-white/60'}`}>Events</Link>
          <Link href="/gallery" className={`hover:text-white transition-colors ${pathname === '/gallery' ? 'text-white' : 'text-white/60'}`}>Gallery</Link>
          <Link href="/pricing" className={`hover:text-white transition-colors ${pathname === '/pricing' ? 'text-white' : 'text-white/60'}`}>Pricing</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white/80 hover:text-white">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-black hover:bg-white/90">Sign up</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
