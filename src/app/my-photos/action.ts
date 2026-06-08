"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function saveSelfieEmbedding(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const file = formData.get("file") as File
    if (!file) return { error: "No file provided" }

    // Feature flag
    if (process.env.ENABLE_AI_TAGGING !== "true") {
      return { error: "AI features are currently disabled" }
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000"
    
    const aiFormData = new FormData()
    aiFormData.append("file", file)

    const res = await fetch(`${aiServiceUrl}/extract-face`, {
      method: "POST",
      body: aiFormData
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { error: errorData.error || "Failed to extract face" }
    }

    const data = await res.json()
    
    if (data.error) {
      return { error: data.error }
    }

    if (data.embedding) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { faceEmbedding: data.embedding }
      })
      
      revalidatePath("/my-photos")
      return { success: true }
    }

    return { error: "No embedding returned" }
  } catch (error) {
    console.error("Face extraction error:", error)
    return { error: "Internal server error" }
  }
}
