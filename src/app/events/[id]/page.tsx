import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { Uploader } from "@/components/media/Uploader"
import { MediaCard } from "@/components/media/MediaCard"
import { DeleteEventButton } from "@/components/events/DeleteEventButton"
import { EditCoverButton } from "@/components/events/EditCoverButton"
import { format } from "date-fns"
import { MapPin, Calendar, LayoutGrid, Image as ImageIcon } from "lucide-react"

import { getDefaultCover } from "@/lib/defaultCovers"

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true } },
      media: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: true,
          favorites: true,
          comments: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "asc" }
          }
        }
      }
    }
  })

  if (!event) return notFound()

  const canUpload = session?.user?.role === "ADMIN" || session?.user?.role === "PHOTOGRAPHER"
  const isCreatorOrAdmin = session?.user?.id === event.creatorId || session?.user?.role === "ADMIN"

  // Security check: Only allow access to private events if user is creator or admin
  if (!event.isPublic && !isCreatorOrAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-6 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Private Event</h1>
          <p className="text-muted-foreground">You do not have permission to view this event's details or media.</p>
        </div>
      </div>
    )
  }

  // Ensure we only use valid S3 HTTP URLs, fallback to Unsplash default if it's a broken old local file
  const displayCover = (event.coverImage && event.coverImage.startsWith("http")) 
    ? event.coverImage 
    : getDefaultCover(event.id);

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Event Header - Centered Circle Design */}
        <div className="relative rounded-[2rem] overflow-hidden mb-8 border border-white/10 bg-background/5 backdrop-blur-xl p-6 md:p-10 flex flex-col items-center text-center shadow-2xl max-w-4xl mx-auto">
          
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-0" />

          {/* Circular Cover Photo */}
          <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.08)] border-4 border-white/10 group/cover mb-6 transition-transform duration-500 hover:scale-105 bg-black/20 shrink-0">
            <img src={displayCover} className="w-full h-full object-cover" alt={event.name} />
            
            {isCreatorOrAdmin && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-100 md:opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
                <EditCoverButton eventId={event.id} hasCustomCover={!!(event.coverImage && event.coverImage.startsWith('http'))} />
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold text-white tracking-widest border border-white/20 uppercase shadow-md">
                {event.category}
              </span>
              {event.isPublic ? (
                <span className="px-3 py-1 bg-[#8FAD88]/20 text-[#8FAD88] rounded-full text-[10px] md:text-xs font-bold border border-[#8FAD88]/30 tracking-widest shadow-md">PUBLIC</span>
              ) : (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-[10px] md:text-xs font-bold border border-red-500/30 tracking-widest shadow-md">PRIVATE</span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight drop-shadow-lg">{event.name}</h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl font-medium">{event.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="bg-background/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4">Event Details</h3>
              <div className="space-y-4 text-sm text-foreground/70 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#8FAD88] mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Date</p>
                    <p>{format(new Date(event.date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#C1D5C0] mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p>{event.location || "TBA"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ImageIcon className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Total Media</p>
                    <p>{event.media.length} items</p>
                  </div>
                </div>
              </div>
              
              {isCreatorOrAdmin && (
                <div className="pt-4 border-t border-white/10 flex justify-center">
                  <DeleteEventButton eventId={event.id} />
                </div>
              )}
            </div>

            {canUpload && (
              <div className="bg-background/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4">Upload Media</h3>
                <Uploader eventId={event.id} />
              </div>
            )}
          </div>

          {/* Main Gallery Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <LayoutGrid className="mr-2" /> Gallery
              </h2>
            </div>

            {event.media.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-2xl bg-background/5">
                <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-1">No media yet</h3>
                <p className="text-foreground/50">Check back later for event photos and videos.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {event.media.map((item) => (
                  <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} isEventCreator={isCreatorOrAdmin} userRole={session?.user?.role} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
