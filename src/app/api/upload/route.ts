import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getStorageProvider } from "@/lib/storage"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PHOTOGRAPHER") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll("file") as File[]
    const facesDataRaw = formData.getAll("facesData") as string[]
    const tagsDataRaw = formData.getAll("tagsData") as string[]
    const eventId = formData.get("eventId") as string | null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const storage = getStorageProvider()
    const uploadedMedia = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = await storage.uploadFile(file, file.name, "media")
      
      let validTags: string[] = []
      if (tagsDataRaw[i]) {
        try {
          const parsedTags = JSON.parse(tagsDataRaw[i]) as string[]
          if (Array.isArray(parsedTags)) {
            validTags = parsedTags.filter(t => t.trim().length > 0)
          }
        } catch (e) {
          console.error("Failed to parse tagsData for file", i, e)
        }
      }

      const media = await prisma.media.create({
        data: {
          url,
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          uploaderId: session.user.id,
          eventId: eventId || null,
          tags: validTags.length > 0 ? {
            connectOrCreate: validTags.map(tag => ({
              where: { name: tag },
              create: { name: tag }
            }))
          } : undefined
        }
      })
      
      // If client provided face embeddings, save them to standard Float[]
      if (facesDataRaw[i]) {
        try {
          const embeddingsList = JSON.parse(facesDataRaw[i]) as number[][]
          if (Array.isArray(embeddingsList) && embeddingsList.length > 0) {
            for (const embedding of embeddingsList) {
              if (embedding.length === 128) {
                await prisma.mediaFace.create({
                  data: {
                    mediaId: media.id,
                    embedding: embedding
                  }
                })
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse facesData for file", i, e)
        }
      }

      uploadedMedia.push(media)
    }

    return NextResponse.json({ success: true, media: uploadedMedia })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
