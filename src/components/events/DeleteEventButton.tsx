"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteEvent } from "@/app/events/action"

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this event and all its media? This cannot be undone.")) return
    
    setIsDeleting(true)
    const res = await deleteEvent(eventId)
    
    if (res.error) {
      toast.error(res.error)
      setIsDeleting(false)
    } else {
      toast.success("Event deleted successfully")
      router.push("/events")
    }
  }

  return (
    <Button 
      onClick={handleDelete} 
      disabled={isDeleting}
      variant="destructive"
      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {isDeleting ? "Deleting..." : "Delete Event"}
    </Button>
  )
}
