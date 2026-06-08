"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Camera, ScanFace, Loader2 } from "lucide-react"
import { saveSelfieEmbedding } from "./action"

export default function MyPhotosPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setHasScanned(false)
    }
  }

  const handleScan = async () => {
    if (!file) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await saveSelfieEmbedding(formData)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Face registered successfully!")
        setHasScanned(true)
      }
    } catch (error) {
      toast.error("Failed to register face")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Photos (AI Match)</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Upload a clear selfie. Our AI will scan your face and automatically find all event photos you appear in.
          </p>
        </div>

        {!hasScanned ? (
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-xl mx-auto backdrop-blur-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <ScanFace className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold">Register your face</h3>
            </div>

            <div 
              className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/5 transition mb-6"
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
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Selfie preview" />
                </div>
              ) : (
                <div className="py-8">
                  <Camera className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="font-medium text-white/80">Tap to upload a selfie</p>
                  <p className="text-xs text-white/40 mt-1">Make sure your face is clearly visible</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-medium"
              disabled={!file || loading}
              onClick={handleScan}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning...</>
              ) : (
                "Scan & Find My Photos"
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <ScanFace className="w-6 h-6 mr-3 text-indigo-400" /> 
                Matches Found
              </h2>
              <Button variant="outline" onClick={() => setHasScanned(false)} className="border-white/20">
                Rescan Face
              </Button>
            </div>
            
            <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/5">
              <p className="text-white/60 mb-2">Simulated Match Results</p>
              <h3 className="text-xl font-medium text-indigo-300">You are in 0 photos!</h3>
              <p className="text-sm text-white/40 mt-4 max-w-md mx-auto">
                In a full production environment with pgvector, this would display the matched photos using cosine similarity against the database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
