"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-sm font-medium text-white/80">EventSphere AI 2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          <span className="block text-white">Capture Every</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Brilliant Moment
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl text-white/60 mb-10"
        >
          The ultimate AI-powered platform for clubs, photographers, and attendees. 
          Upload, manage, and instantly find yourself in thousands of event photos using facial recognition.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link href="/events">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-white text-black hover:bg-white/90 rounded-full">
              Explore Events
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-full backdrop-blur-sm">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* 3D Dashboard Mockup Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          style={{ perspective: 1000 }}
          className="w-full max-w-6xl mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10 h-full w-full top-1/2" />
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            <div className="h-[400px] md:h-[600px] w-full rounded-xl bg-black/40 border border-white/5 overflow-hidden flex flex-col">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              {/* Fake UI Body */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="h-48 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
                    <div className="h-32 rounded-xl bg-white/5 border border-white/5 animate-pulse delay-75" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-24 rounded-xl bg-white/5 border border-white/5 animate-pulse delay-150" />
                  <div className="h-64 rounded-xl bg-white/5 border border-white/5 animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the future of events</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">Everything you need to manage events and media with state-of-the-art AI technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI Tagging", desc: "Automatic object and scene detection for instant search." },
            { title: "Facial Recognition", desc: "Find all your photos across thousands of uploads with a single selfie." },
            { title: "Smart Galleries", desc: "Masonry layouts with infinite scroll and dynamic watermarks." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-indigo-500 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
