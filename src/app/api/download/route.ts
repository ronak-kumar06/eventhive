import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    // Check if user is authenticated
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check role-based access
    if (session.user.role === "VIEWER") {
      return new NextResponse("Forbidden: Viewers cannot download media", { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url) {
      return new NextResponse("Missing URL parameter", { status: 400 })
    }

    // Fetch the image from S3 or local URL
    const response = await fetch(url)
    
    if (!response.ok) {
      return new NextResponse("Failed to fetch image from source", { status: response.status })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Extract filename from URL or generate one
    const urlParts = url.split('/')
    let filename = urlParts[urlParts.length - 1]
    if (!filename || !filename.includes('.')) {
      filename = `eventhive_download_${Date.now()}.jpg`
    }

    // Set appropriate headers to force download
    const headers = new Headers()
    headers.set("Content-Disposition", `attachment; filename="${filename}"`)
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream")

    return new NextResponse(buffer, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error("[DOWNLOAD_ERROR]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
