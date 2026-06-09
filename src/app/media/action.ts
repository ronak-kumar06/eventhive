"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { sendNotification } from "@/lib/notify"

export async function toggleLike(mediaId: string, pathToRevalidate: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const existingLike = await prisma.like.findUnique({
      where: {
        mediaId_userId: {
          mediaId,
          userId: session.user.id
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
    } else {
      await prisma.like.create({
        data: {
          mediaId,
          userId: session.user.id
        }
      })
      
      const media = await prisma.media.findUnique({ where: { id: mediaId }, select: { uploaderId: true } })
      if (media && media.uploaderId !== session.user.id) {
        await sendNotification('notification', {
          userId: media.uploaderId,
          message: `${session.user.name} liked your photo`,
          type: 'like'
        })
      }
    }

    revalidatePath(pathToRevalidate)
    return { success: true }
  } catch (error) {
    return { error: "Failed to toggle like" }
  }
}

export async function toggleFavorite(mediaId: string, pathToRevalidate: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        mediaId_userId: {
          mediaId,
          userId: session.user.id
        }
      }
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      })
    } else {
      await prisma.favorite.create({
        data: {
          mediaId,
          userId: session.user.id
        }
      })
    }

    revalidatePath(pathToRevalidate)
    return { success: true }
  } catch (error) {
    return { error: "Failed to toggle favorite" }
  }
}

export async function addComment(mediaId: string, content: string, pathToRevalidate: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }
    
    if (!content.trim()) return { error: "Comment cannot be empty" }

    await prisma.comment.create({
      data: {
        mediaId,
        userId: session.user.id,
        content: content.trim()
      }
    })

    const media = await prisma.media.findUnique({ where: { id: mediaId }, select: { uploaderId: true } })
    if (media && media.uploaderId !== session.user.id) {
      await sendNotification('notification', {
        userId: media.uploaderId,
        message: `${session.user.name} commented on your photo`,
        type: 'comment'
      })
    }

    revalidatePath(pathToRevalidate)
    return { success: true }
  } catch (error) {
    return { error: "Failed to add comment" }
  }
}

export async function deleteMedia(mediaId: string, pathToRevalidate: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const media = await prisma.media.findUnique({ 
      where: { id: mediaId },
      include: { event: true } 
    })
    
    if (!media) return { error: "Media not found" }

    const isUploader = media.uploaderId === session.user.id
    const isEventCreator = media.event?.creatorId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isUploader && !isEventCreator && !isAdmin) {
      return { error: "Insufficient permissions to delete media" }
    }

    await prisma.media.delete({ where: { id: mediaId } })
    
    revalidatePath(pathToRevalidate)
    return { success: true }
  } catch (error) {
    console.error("Delete media error:", error)
    return { error: "Failed to delete media" }
  }
}
