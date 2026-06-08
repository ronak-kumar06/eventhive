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

    for (const file of files) {
      const url = await storage.uploadFile(file, file.name, "media")
      
      const media = await prisma.media.create({
        data: {
          url,
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          uploaderId: session.user.id,
          eventId: eventId || null
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
