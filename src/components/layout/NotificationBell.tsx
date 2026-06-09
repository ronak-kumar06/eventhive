"use client"

import { useState, useEffect } from "react"
import { Bell, Heart, MessageCircle, Tag, Check, CheckCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: any) => !n.read).length)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unreadIds })
      })
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error(error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-pink-500" />
      case 'comment': return <MessageCircle className="w-4 h-4 text-[#8FAD88]" />
      case 'tag': return <Tag className="w-4 h-4 text-green-400" />
      default: return <Bell className="w-4 h-4 text-zinc-900/70" />
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen && unreadCount > 0) markAsRead()
        }}
        className="relative p-2 rounded-full hover:bg-[#F9F8F6]/10 transition"
      >
        <Bell className="w-5 h-5 text-zinc-800" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#050505]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-[#F3EFE9] border border-black/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-black/10 flex justify-between items-center bg-[#F9F8F6]/5">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount === 0 && notifications.length > 0 && (
                  <CheckCheck className="w-4 h-4 text-green-500/70" />
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-black/5 flex space-x-3 items-start transition ${notif.read ? 'opacity-60' : 'bg-indigo-500/5'}`}
                    >
                      <div className="mt-1 bg-[#F9F8F6]/5 p-1.5 rounded-full">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-900 leading-tight">{notif.message}</p>
                        <span className="text-xs text-zinc-500 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
