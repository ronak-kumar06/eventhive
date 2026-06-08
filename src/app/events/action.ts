"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PHOTOGRAPHER") {
      return { error: "Insufficient permissions" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const dateStr = formData.get("date") as string
    const category = formData.get("category") as string
    const location = formData.get("location") as string

    if (!name || !dateStr || !category) {
      return { error: "Missing required fields" }
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(dateStr),
        category,
        location,
        creatorId: session.user.id
      }
    })

    revalidatePath("/events")
    
    return { success: true, eventId: event.id }
  } catch (error) {
    console.error("Create event error:", error)
    return { error: "Failed to create event" }
  }
}
