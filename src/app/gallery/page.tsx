import prisma from "@/lib/prisma"
import { MediaCard } from "@/components/media/MediaCard"
import { auth } from "@/auth"

export default async function GalleryPage() {
  const session = await auth()
  
  // Fetch all media but filter out those from private events unless authorized
  const allMedia = await prisma.media.findMany({
    where: {
      OR: [
        { event: { isPublic: true } },
        session?.user?.role === "ADMIN" ? {} : { event: { creatorId: session?.user?.id || "" } },
        { eventId: null } // Allow media with no event (if any exist)
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      likes: true,
      favorites: true,
      comments: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Global Gallery</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Discover the latest photos and videos uploaded from events across the platform.
          </p>
        </div>

        {allMedia.length === 0 ? (
          <div className="text-center py-20 text-zinc-900/50 border border-dashed border-black/10 rounded-2xl">
            <p>No media found. Check back later!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {allMedia.map((item) => (
              <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} userRole={session?.user?.role} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
