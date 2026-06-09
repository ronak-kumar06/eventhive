import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { auth } from "@/auth"

import { getDefaultCover } from "@/lib/defaultCovers"

export default async function EventsPage() {
  const session = await auth()
  
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { isPublic: true },
        session?.user?.role === "ADMIN" ? {} : { creatorId: session?.user?.id || "" }
      ]
    },
    orderBy: { date: "desc" },
    include: {
      creator: {
        select: { name: true }
      }
    }
  })

  return (
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Explore Events</h1>
            <p className="text-muted-foreground">Discover the latest events and their media galleries.</p>
          </div>
          
          {(session?.user?.role === "ADMIN" || session?.user?.role === "PHOTOGRAPHER") && (
            <Link href="/events/create" className="mt-4 md:mt-0">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-background/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">There are no upcoming events at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const displayCover = event.coverImage || getDefaultCover(event.id);
              
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="group bg-background/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition backdrop-blur-sm h-full flex flex-col">
                    <div className="aspect-video bg-background/10 relative overflow-hidden">
                      <img 
                        src={displayCover} 
                        alt={event.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-medium text-black border border-white/10">
                        {event.category}
                      </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#8FAD88] transition">{event.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{event.description}</p>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto flex items-center justify-between text-xs text-foreground/50">
                      <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                      <span>By {event.creator?.name || "Unknown"}</span>
                    </div>
                  </div>
                </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
