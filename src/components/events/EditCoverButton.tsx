"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ImageIcon, Loader2 } from "lucide-react"
import { updateEventCover } from "@/app/events/action"

interface EditCoverButtonProps {
  eventId: string
}

export function EditCoverButton({ eventId }: EditCoverButtonProps) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Cover image must be under 4MB")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await updateEventCover(eventId, formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Cover image updated!")
      }
    } catch (error: any) {
      toast.error("Failed to update cover image")
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleFileChange} 
      />
      <Button 
        variant="outline" 
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="bg-background/40 backdrop-blur-md border-white/20 text-foreground hover:bg-background/60"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
        Change Cover
      </Button>
    </>
  )
}
