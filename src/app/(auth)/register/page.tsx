"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { registerUser } from "./action"
import { loginUser } from "../login/action"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await registerUser(name, email, password)

      if (res.error) {
        toast.error(res.error)
        setLoading(false)
      } else {
        toast.success("Account created successfully. Logging you in...")
        
        // Auto-login
        const formData = new FormData()
        formData.append("email", email)
        formData.append("password", password)
        await loginUser(formData)
        // Note: loginUser throws redirect error upon success
      }
    } catch (error) {
      // loginUser throws the redirect error, let it propagate!
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">E</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-white/60 text-sm mt-2">Join EventSphere AI today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="bg-black/20 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="bg-black/20 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
              className="bg-black/20 border-white/10"
            />
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 mt-6" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
