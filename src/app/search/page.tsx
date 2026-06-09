import prisma from "@/lib/prisma"
import { MediaCard } from "@/components/media/MediaCard"
import { auth } from "@/auth"
import { Search as SearchIcon } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await auth()
  const query = searchParams.q || ""

  let media: any[] = []

  if (query) {
    // Basic Phase 2 Search: match event name, category, or tags
    media = await prisma.media.findMany({
      where: {
        AND: [
          {
            OR: [
              { event: { name: { contains: query, mode: "insensitive" } } },
              { event: { category: { contains: query, mode: "insensitive" } } },
              { tags: { some: { name: { contains: query, mode: "insensitive" } } } },
              { uploader: { name: { contains: query, mode: "insensitive" } } }
            ]
          },
          {
            OR: [
              { event: { isPublic: true } },
              session?.user?.role === "ADMIN" ? {} : { event: { creatorId: session?.user?.id || "" } },
              { eventId: null }
            ]
          }
        ]
      },
      include: {
        likes: true,
        favorites: true,
        comments: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Search Media</h1>
          <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
            Search across events, tags, categories, and users.
          </p>
          
          <form className="max-w-xl mx-auto relative" method="GET" action="/search">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="E.g., 'workshop', 'john doe', or 'beach'"
              className="w-full bg-[#F9F8F6]/5 border border-black/10 rounded-full pl-6 pr-14 py-4 text-lg focus:outline-none focus:border-indigo-500 transition shadow-2xl backdrop-blur-md"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition"
            >
              <SearchIcon className="w-5 h-5 text-zinc-900" />
            </button>
          </form>
        </div>

        {query && (
          <div className="mb-8 border-b border-black/10 pb-4">
            <h2 className="text-xl font-medium">
              Results for <span className="text-[#8FAD88]">"{query}"</span>
            </h2>
            <p className="text-sm text-zinc-900/50 mt-1">Found {media.length} items</p>
          </div>
        )}

        {query && media.length === 0 && (
          <div className="py-20 text-center border border-dashed border-black/10 rounded-2xl bg-[#F9F8F6]/5">
            <SearchIcon className="w-12 h-12 text-zinc-900/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-1">No results found</h3>
            <p className="text-zinc-900/50">Try using different keywords.</p>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {media.map((item) => (
            <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} userRole={session?.user?.role} />
          ))}
        </div>
      </div>
    </div>
  )
}
