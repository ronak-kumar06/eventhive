"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function saveSelfieEmbedding(embedding: number[]) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    if (!embedding || embedding.length !== 128) {
      return { error: "Invalid face embedding" }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { faceEmbedding: embedding }
    })
    
    revalidatePath("/my-photos")
    return { success: true }
  } catch (error) {
    console.error("Save embedding error:", error)
    return { error: "Internal server error" }
  }
}

// Helper to compute Euclidean distance between two 128-D arrays
function euclideanDistance(arr1: number[], arr2: number[]) {
  if (arr1.length !== arr2.length) return Infinity
  let sum = 0
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2)
  }
  return Math.sqrt(sum)
}

export async function findMyPhotos() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // Check if user has a face embedding
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { faceEmbedding: true }
    })

    if (!user || !user.faceEmbedding || user.faceEmbedding.length === 0) {
      return { error: "Face not registered" }
    }

    const userEmbedding = user.faceEmbedding as number[]

    // Fetch all face embeddings from the database (in production with 10k photos, this loads ~5MB into RAM)
    // For small-to-medium platforms, doing this in memory is lightning fast (<50ms).
    const allFaces = await prisma.mediaFace.findMany({
      include: {
        media: true
      }
    })

    const matchedMedia = new Map()

    for (const face of allFaces) {
      if (face.embedding && (face.embedding as number[]).length === 128) {
        const distance = euclideanDistance(userEmbedding, face.embedding as number[])
        // 0.55 is a standard threshold for face-api.js euclidean distance
        if (distance < 0.55) {
          if (!matchedMedia.has(face.mediaId)) {
            matchedMedia.set(face.mediaId, face.media)
          }
        }
      }
    }

    // Sort by createdAt descending
    const matches = Array.from(matchedMedia.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return { matches }
  } catch (error) {
    console.error("Find photos error:", error)
    return { error: "Failed to find photos" }
  }
}
