"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { getStorageProvider } from "@/lib/storage"

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
    const visibility = formData.get("visibility") as string
    const isPublic = visibility !== "private"

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
        isPublic,
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

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return { error: "Event not found" }

    if (session.user.role !== "ADMIN" && event.creatorId !== session.user.id) {
      return { error: "Insufficient permissions to delete event" }
    }

    // Delete the event (cascade will delete related media in DB)
    await prisma.event.delete({ where: { id: eventId } })
    
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    console.error("Delete event error:", error)
    return { error: "Failed to delete event" }
  }
}

export async function updateEventCover(eventId: string, formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return { error: "Event not found" }

    if (session.user.role !== "ADMIN" && event.creatorId !== session.user.id) {
      return { error: "Insufficient permissions" }
    }

    const file = formData.get("file") as File
    if (!file || file.size === 0) return { error: "No file provided" }

    const storage = getStorageProvider()
    const url = await storage.uploadFile(file, file.name, "covers")

    await prisma.event.update({
      where: { id: eventId },
      data: { coverImage: url }
    })

    revalidatePath(`/events/${eventId}`)
    revalidatePath("/events")
    return { success: true, url }
  } catch (error: any) {
    console.error("Update cover error:", error)
    return { error: error.message || "Failed to update cover image" }
  }
}
