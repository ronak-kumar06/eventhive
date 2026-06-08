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
    const eventId = formData.get("eventId") as string | null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const storage = getStorageProvider()
    const uploadedMedia = []
    
    // Feature flag for AI Tagging
    const useAITagging = process.env.ENABLE_AI_TAGGING === "true"
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000"

    for (const file of files) {
      const url = await storage.uploadFile(file, file.name, "media")
      
      let aiTags: string[] = []
      
      if (useAITagging && file.type.startsWith("image")) {
        try {
          const aiFormData = new FormData()
          aiFormData.append("file", file)
          
          const aiRes = await fetch(`${aiServiceUrl}/analyze-image`, {
            method: "POST",
            body: aiFormData
          })
          
          if (aiRes.ok) {
            const aiData = await aiRes.json()
            if (aiData.tags) {
              aiTags = aiData.tags
            }
          }
        } catch (error) {
          console.error("AI Tagging failed, skipping:", error)
        }
      }

      const media = await prisma.media.create({
        data: {
          url,
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          uploaderId: session.user.id,
          eventId: eventId || null,
          tags: {
            connectOrCreate: aiTags.map(t => ({
              where: { name: t },
              create: { name: t }
            }))
          }
        }
      })
      uploadedMedia.push(media)
    }

    return NextResponse.json({ success: true, media: uploadedMedia })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
