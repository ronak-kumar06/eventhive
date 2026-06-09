import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { Uploader } from "@/components/media/Uploader"
import { MediaCard } from "@/components/media/MediaCard"
import { DeleteEventButton } from "@/components/events/DeleteEventButton"
import { format } from "date-fns"
import { MapPin, Calendar, LayoutGrid, Image as ImageIcon } from "lucide-react"

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
      <div className="min-h-screen pt-32 pb-12 px-6 flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Private Event</h1>
          <p className="text-white/60">You do not have permission to view this event's details or media.</p>
        </div>
      </div>
    )
  }

  // Get a random cover from the public/covers folder
  const randomCoverId = Math.floor(Math.random() * 5) + 1;
  const displayCover = event.coverImage || `/covers/${randomCoverId}.jpg`;

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="relative rounded-3xl overflow-hidden mb-12 border border-white/10 bg-white/5 backdrop-blur-sm group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <img src={displayCover} className="w-full h-64 md:h-96 object-cover" alt={event.name} />

          <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex flex-col md:flex-row justify-between items-end">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                  {event.category}
                </span>
                {event.isPublic ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/20">Public</span>
                ) : (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/20">Private</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.name}</h1>
              <p className="text-white/80 max-w-2xl text-lg">{event.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4">Event Details</h3>
              <div className="space-y-4 text-sm text-white/70 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Date</p>
                    <p>{format(new Date(event.date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p>{event.location || "TBA"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ImageIcon className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Total Media</p>
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
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
              <div className="py-32 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-1">No media yet</h3>
                <p className="text-white/50">Check back later for event photos and videos.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {event.media.map((item) => (
                  <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} isEventCreator={isCreatorOrAdmin} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
