"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UploadCloud, X, Loader2 } from "lucide-react"

interface UploaderProps {
  eventId: string
}

export function Uploader({ eventId }: UploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...droppedFiles])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)
    setStatusText("Loading AI Models...")

    try {
      const faceapi = await import("@vladmandic/face-api")
      const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Use highly accurate model
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])

      const formData = new FormData()
      formData.append("eventId", eventId)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append("file", file)
        setStatusText(`Analyzing image ${i + 1} of ${files.length}...`)

        let fileFacesData = "[]"
        if (file.type.startsWith("image/")) {
          const img = new Image()
          img.src = URL.createObjectURL(file)
          await new Promise((resolve, reject) => { 
            img.onload = resolve 
            img.onerror = () => resolve(null) // Resolve anyway to not break loop
          })

          // Skip if the browser couldn't parse the image (e.g. HEIC files)
          if (img.naturalWidth > 0 && img.complete) {
            // Convert to Canvas to completely avoid tfjs Dimensions error
            const canvas = document.createElement("canvas")
            const w = img.naturalWidth || 1000
            const h = img.naturalHeight || 1000
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h)
            }

            // Use SsdMobilenetv1 (the default and most accurate detector in face-api)
            const detections = await faceapi.detectAllFaces(canvas)
                                            .withFaceLandmarks()
                                            .withFaceDescriptors()
            
            if (detections && detections.length > 0) {
              const arrays = detections.map(d => Array.from(d.descriptor))
              fileFacesData = JSON.stringify(arrays)
              console.log(`Found ${detections.length} faces in image ${i}`)
            } else {
              console.warn(`No faces found in image ${i}`)
            }
          } else {
            console.warn(`Browser could not read image ${i}. Likely unsupported format like HEIC.`)
          }
        }
        formData.append("facesData", fileFacesData)
      }

      setStatusText("Uploading to cloud...")
      
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90
          return prev + 10
        })
      }, 300)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      setProgress(100)
      toast.success(`${files.length} files uploaded successfully!`)
      setFiles([])
      router.refresh()
    } catch (error) {
      toast.error("Failed to upload files.")
    } finally {
      setUploading(false)
      setProgress(0)
      setStatusText("")
    }
  }

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
          dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-white/20 bg-background/5 hover:bg-background/10"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef} 
          type="file" 
          multiple 
          accept="image/*,video/*" 
          onChange={handleChange} 
          className="hidden" 
        />
        <UploadCloud className="mx-auto w-12 h-12 text-foreground/50 mb-4" />
        <p className="text-lg font-medium mb-1">Drag and drop files here</p>
        <p className="text-foreground/50 text-sm">Or click to select files from your computer</p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 text-foreground">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-background/40 p-3 rounded-lg border border-white/10">
                <div className="truncate flex-1 text-sm text-foreground">
                  {file.name}
                </div>
                <button onClick={() => removeFile(index)} className="text-zinc-500 hover:text-red-400 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            {uploading && (
              <div className="w-full bg-background/40 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-foreground"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {statusText || "Uploading..."}
                </>
              ) : (
                `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
