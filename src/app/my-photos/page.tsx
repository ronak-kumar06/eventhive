"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Camera, ScanFace, Loader2, LayoutGrid } from "lucide-react"
import { saveSelfieEmbedding, findMyPhotos } from "./action"
import { MediaCard } from "@/components/media/MediaCard"
import { useSession } from "next-auth/react"

export default function MyPhotosPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingMatches, setFetchingMatches] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [hasFaceRegistered, setHasFaceRegistered] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const loadMatches = async () => {
    setFetchingMatches(true)
    const res = await findMyPhotos()
    if (res.matches) {
      setHasFaceRegistered(true)
      setMatches(res.matches)
    } else if (res.error === "Face not registered") {
      setHasFaceRegistered(false)
    }
    setFetchingMatches(false)
  }

  useEffect(() => {
    loadMatches()
    
    // Load face-api models from CDN
    const loadModels = async () => {
      try {
        const faceapi = await import("@vladmandic/face-api")
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Use highly accurate model
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ])
        setModelsLoaded(true)
      } catch (error) {
        console.error("Failed to load models:", error)
        toast.error("Failed to load AI models")
      }
    }
    loadModels()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleScan = async () => {
    if (!file || !imageRef.current || !modelsLoaded) return
    setLoading(true)

    try {
      toast.info("Scanning face...")
      const faceapi = await import("@vladmandic/face-api")
      
      const img = imageRef.current
      if (!img) {
        toast.error("Image not found")
        setLoading(false)
        return
      }

      // Check if image is broken or unsupported format (like HEIC)
      if (!img.complete || img.naturalWidth === 0) {
        toast.error("Browser cannot read this image format! Please use a standard JPG or PNG.")
        setLoading(false)
        return
      }

      // Convert to Canvas to completely avoid tfjs Dimensions error
      const canvas = document.createElement("canvas")
      const w = img.naturalWidth || img.clientWidth || img.width || 500
      const h = img.naturalHeight || img.clientHeight || img.height || 500
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h)
      }

      // Extract face descriptor using face-api.js SsdMobilenetv1
      const detection = await faceapi.detectSingleFace(canvas)
                                     .withFaceLandmarks()
                                     .withFaceDescriptor()

      if (!detection) {
        toast.error("No face detected! Please use a clear selfie.")
        setLoading(false)
        return
      }

      // Convert Float32Array to standard array
      const descriptorArray = Array.from(detection.descriptor)
      
      // Save it using Server Action
      const res = await saveSelfieEmbedding(descriptorArray)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Face registered successfully! Finding photos...")
        await loadMatches()
      }
    } catch (error) {
      toast.error("Failed to register face")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingMatches) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-[#F9F8F6]">
        <Loader2 className="w-12 h-12 text-[#8FAD88] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#F9F8F6]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Photos (AI Match)</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Upload a clear selfie. Our AI runs directly in your browser to scan your face and securely find all event photos you appear in.
          </p>
        </div>

        {!hasFaceRegistered ? (
          <div className="bg-[#F9F8F6]/5 border border-black/10 p-8 rounded-3xl max-w-xl mx-auto backdrop-blur-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <ScanFace className="w-8 h-8 text-[#8FAD88]" />
              </div>
              <h3 className="text-xl font-bold">Register your face</h3>
            </div>

            <div 
              className="border-2 border-dashed border-black/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-[#F9F8F6]/5 transition mb-6"
              onClick={() => inputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={inputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30 bg-white/80">
                  <img ref={imageRef} src={previewUrl} className="w-full h-full object-cover" alt="Selfie preview" />
                </div>
              ) : (
                <div className="py-8">
                  <Camera className="w-10 h-10 text-zinc-900/30 mx-auto mb-3" />
                  <p className="font-medium text-zinc-800">Tap to upload a selfie</p>
                  <p className="text-xs text-zinc-500 mt-1">Make sure your face is clearly visible</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-zinc-900 rounded-full text-lg font-medium"
              disabled={!file || loading || !modelsLoaded}
              onClick={handleScan}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
              ) : !modelsLoaded ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading AI Models...</>
              ) : (
                "Scan & Find My Photos"
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-black/10 pb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <LayoutGrid className="w-6 h-6 mr-3 text-[#8FAD88]" /> 
                Matches Found ({matches.length})
              </h2>
              <Button variant="outline" onClick={() => setHasFaceRegistered(false)} className="border-black/20">
                Update Selfie
              </Button>
            </div>
            
            {matches.length === 0 ? (
              <div className="py-20 text-center border border-black/10 rounded-2xl bg-[#F9F8F6]/5">
                <ScanFace className="w-12 h-12 text-zinc-900/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium">No photos found yet!</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                  We couldn't find your face in any event photos yet. We'll keep scanning new uploads!
                </p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {matches.map((item) => (
                  <MediaCard key={item.id} media={item} currentUserId={session?.user?.id} userRole={session?.user?.role} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
