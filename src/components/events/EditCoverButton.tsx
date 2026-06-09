"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ImageIcon, Loader2, Trash2 } from "lucide-react"
import { updateEventCover, removeEventCover } from "@/app/events/action"

interface EditCoverButtonProps {
  eventId: string
  hasCustomCover?: boolean
}

export function EditCoverButton({ eventId, hasCustomCover }: EditCoverButtonProps) {
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

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this cover photo?")) return;
    
    setLoading(true)
    try {
      const res = await removeEventCover(eventId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Cover photo removed, default applied.")
      }
    } catch (error: any) {
      toast.error("Failed to remove cover photo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2">
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
        className="bg-background/40 backdrop-blur-md border-white/20 text-foreground hover:bg-background/60 shadow-lg text-xs h-8"
      >
        {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <ImageIcon className="w-3 h-3 mr-2" />}
        Change
      </Button>
      
      {hasCustomCover && (
        <Button 
          variant="destructive" 
          size="sm"
          disabled={loading}
          onClick={handleRemove}
          className="shadow-lg backdrop-blur-md h-8 w-8 p-0"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
