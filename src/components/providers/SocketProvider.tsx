"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const notifiedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?unread=true")
        if (!res.ok) return
        const notifications = await res.json()

        notifications.forEach((notif: any) => {
          if (!notifiedIds.current.has(notif.id)) {
            notifiedIds.current.add(notif.id)
            
            toast(notif.message, {
              icon: notif.type === 'like' ? '❤️' : notif.type === 'comment' ? '💬' : '🔔',
              description: new Date(notif.createdAt).toLocaleTimeString(),
            })
            
            // Note: We don't mark as read automatically just by toasting,
            // they will remain unread in the notification center (Bell dropdown).
          }
        })
      } catch (error) {
        console.error("Failed to fetch notifications", error)
      }
    }

    // Initial fetch
    fetchNotifications()

    // Poll every 5 seconds
    const interval = setInterval(fetchNotifications, 5000)

    return () => clearInterval(interval)
  }, [session])

  return <>{children}</>
}
