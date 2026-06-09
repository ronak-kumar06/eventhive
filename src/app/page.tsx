"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-background/5 border border-white/10 mb-8 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#8FAD88] animate-pulse" />
          <span className="text-sm font-medium text-foreground">EventHive AI 2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          <span className="block text-foreground">Capture Every</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5C705A] via-[#8FAD88] to-[#5C705A]">
            Brilliant Moment
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10"
        >
          The ultimate AI-powered platform for clubs, photographers, and attendees. 
          Upload, manage, and instantly find yourself in thousands of event photos using facial recognition.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full"
        >
          <Link href="/events">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              Explore Events
            </Button>
          </Link>
          {!session && (
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-white/20 text-foreground hover:bg-background/10 rounded-full backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          )}
        </motion.div>


      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the future of events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to manage events and media with state-of-the-art AI technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI Tagging", desc: "Automatic object and scene detection for instant search." },
            { title: "Facial Recognition", desc: "Find all your photos across thousands of uploads with a single selfie." },
            { title: "Smart Galleries", desc: "Masonry layouts with infinite scroll and dynamic watermarks." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, y: -10 }}
              style={{ perspective: 1000 }}
              className="p-8 rounded-2xl bg-black/40 border border-[#C1D5C0]/50 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#8FAD88]/20 flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-[#8FAD88] rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
