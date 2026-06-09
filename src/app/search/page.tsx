import prisma from "@/lib/prisma"
import { MediaCard } from "@/components/media/MediaCard"
import { auth } from "@/auth"
import { Search as SearchIcon } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; date?: string }>
}) {
  const resolvedParams = await searchParams;
  const session = await auth()
  const query = resolvedParams.q || ""
  const dateFilter = resolvedParams.date || ""

  let media: any[] = []

  if (query || dateFilter) {
    // Handle date filtering logic
    let dateCondition = {}
    if (dateFilter) {
      const now = new Date()
      if (dateFilter === "24h") {
        dateCondition = { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
      } else if (dateFilter === "week") {
        dateCondition = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
      } else if (dateFilter === "month") {
        dateCondition = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
      }
    }

    const andConditions: any[] = []

    if (query) {
      andConditions.push({
        OR: [
          { event: { name: { contains: query, mode: "insensitive" } } },
          { event: { category: { contains: query, mode: "insensitive" } } },
          { tags: { some: { name: { contains: query, mode: "insensitive" } } } },
          { uploader: { name: { contains: query, mode: "insensitive" } } }
        ]
      })
    }

    if (dateFilter) {
      andConditions.push({ createdAt: dateCondition })
    }

    if (session?.user?.role !== "ADMIN") {
      andConditions.push({
        OR: [
          { event: { isPublic: true } },
          { event: { creatorId: session?.user?.id || "" } },
          { eventId: null }
        ]
      })
    }

    media = await prisma.media.findMany({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
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
    <div className="min-h-screen pt-32 pb-12 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Search Media</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search across events, tags, categories, and users.
          </p>
          
          <form className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4" method="GET" action="/search">
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q"
                defaultValue={query}
                placeholder="E.g., 'workshop', 'john doe', or 'beach'"
                className="w-full bg-background/5 border border-white/10 rounded-xl pl-6 pr-14 py-4 text-lg focus:outline-none focus:border-indigo-500 transition shadow-2xl backdrop-blur-md"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition"
              >
                <SearchIcon className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <select
              name="date"
              defaultValue={dateFilter}
              className="w-full sm:w-48 bg-background/5 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-indigo-500 transition shadow-2xl backdrop-blur-md text-foreground"
            >
              <option value="" className="bg-background text-foreground">Any Time</option>
              <option value="24h" className="bg-background text-foreground">Past 24 Hours</option>
              <option value="week" className="bg-background text-foreground">Past Week</option>
              <option value="month" className="bg-background text-foreground">Past Month</option>
            </select>
          </form>
        </div>

        {(query || dateFilter) && (
          <div className="mb-8 border-b border-white/10 pb-4">
            <h2 className="text-xl font-medium">
              Results {query && <span>for <span className="text-[#8FAD88]">"{query}"</span></span>}
            </h2>
            <p className="text-sm text-foreground/50 mt-1">Found {media.length} items</p>
          </div>
        )}

        {(query || dateFilter) && media.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-background/5">
            <SearchIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-1">No results found</h3>
            <p className="text-foreground/50">Try using different keywords.</p>
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
