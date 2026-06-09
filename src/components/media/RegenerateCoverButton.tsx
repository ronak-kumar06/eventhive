"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { regenerateEventCover } from "@/app/events/action"
import { toast } from "sonner"

export function RegenerateCoverButton({ eventId }: { eventId: string }) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    toast.loading("Generating new AI cover...", { id: "regen" })
    
    try {
      const res = await regenerateEventCover(eventId)
      if (res?.error) {
        toast.error(res.error, { id: "regen" })
      } else {
        toast.success("Cover regenerated successfully!", { id: "regen" })
      }
    } catch (error) {
      toast.error("Failed to regenerate cover", { id: "regen" })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <Button 
      onClick={handleRegenerate} 
      disabled={isRegenerating}
      className="bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70"
      size="sm"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
      {isRegenerating ? "Generating..." : "Regenerate AI Cover"}
    </Button>
  )
}
