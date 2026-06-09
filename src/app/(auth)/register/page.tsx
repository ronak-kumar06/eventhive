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
import { signIn } from "next-auth/react"

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
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false
        })
        
        if (!loginRes?.error) {
          router.push("/")
          router.refresh()
        } else {
          toast.error("Auto-login failed. Please sign in.")
          router.push("/login")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#C1D5C0]/20 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#8FAD88]/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-background/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex h-12 w-12 rounded-full bg-gradient-to-tr from-[#8FAD88] to-[#C1D5C0] items-center justify-center mb-4">
            <span className="text-foreground font-bold text-xl">E</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm mt-2">Join EventSphere AI today</p>
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
              className="bg-background/50 border-white/10"
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
              className="bg-background/50 border-white/10"
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
              className="bg-background/50 border-white/10"
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
