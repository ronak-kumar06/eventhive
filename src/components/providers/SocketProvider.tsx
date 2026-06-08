"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    const newSocket = io(socketUrl)

    newSocket.on("connect", () => {
      newSocket.emit("join_user_room", session.user.id)
    })

    newSocket.on("notification", (payload: any) => {
      // payload: { userId, message, type }
      if (payload.userId === session.user.id) {
        toast(payload.message, {
          icon: payload.type === 'like' ? '❤️' : '💬'
        })
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [session])

  return <>{children}</>
}
