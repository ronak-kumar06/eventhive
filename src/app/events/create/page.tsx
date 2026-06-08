"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createEvent } from "../action"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createEvent(formData)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Event created successfully!")
        router.push(`/events/${res.eventId}`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-white/60">Fill in the details below to set up a new event and media gallery.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="E.g., Annual Tech Fest 2026" 
                required 
                className="bg-black/20 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description"
                rows={4}
                className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the event..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date"
                  type="date" 
                  required 
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category" 
                  name="category"
                  required
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled className="bg-[#111]">Select Category</option>
                  <option value="Workshop" className="bg-[#111]">Workshop</option>
                  <option value="Photoshoot" className="bg-[#111]">Photoshoot</option>
                  <option value="Trip" className="bg-[#111]">Trip</option>
                  <option value="Competition" className="bg-[#111]">Competition</option>
                  <option value="Cultural Fest" className="bg-[#111]">Cultural Fest</option>
                  <option value="Party" className="bg-[#111]">Party</option>
                  <option value="Other" className="bg-[#111]">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                placeholder="E.g., Main Auditorium" 
                className="bg-black/20 border-white/10"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button type="submit" className="bg-white text-black hover:bg-white/90" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
