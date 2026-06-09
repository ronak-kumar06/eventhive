import prisma from "./prisma"

export async function sendNotification(event: string, payload: any) {
  try {
    if (!payload.userId || !payload.message) return
    
    await prisma.notification.create({
      data: {
        userId: payload.userId,
        message: payload.message,
        type: payload.type || event,
        read: false
      }
    })
  } catch (error) {
    console.error("Failed to save notification:", error)
  }
}
