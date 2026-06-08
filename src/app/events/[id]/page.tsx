import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { Uploader } from "@/components/media/Uploader"
import { MediaCard } from "@/components/media/MediaCard"
import { format } from "date-fns"
import { MapPin, Calendar, LayoutGrid, Image as ImageIcon } from "lucide-react"

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  const event = await prisma.event.findUnique({
    where: { id: params.id },
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

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="relative rounded-3xl overflow-hidden mb-12 border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          {event.coverImage ? (
            <img src={event.coverImage} className="w-full h-64 md:h-96 object-cover" alt={event.name} />
          ) : (
            <div className="w-full h-64 md:h-96 bg-gradient-to-tr from-indigo-900 to-purple-900" />
          )}
          
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
              <div className="space-y-4 text-sm text-white/70">
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
                  <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
