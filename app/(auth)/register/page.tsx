"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Failed to create account")
      setLoading(false)
      return
    }

    toast.success("Account created! You can now sign in.")
    router.push("/login")
  }

  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 shadow-sm fade-in-card">
      <div className="text-center mb-8">
        <Link href="/" className="text-3xl font-heading font-bold tracking-[0.15em] text-gold-gradient inline-block">
          DRIP
        </Link>
        <p className="text-navy/50 text-sm mt-2">Join the movement</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            className="bg-cream/50"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-cream/50"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-cream/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-navy/30 mt-1.5">At least 6 characters</p>
        </div>
        <Button type="submit" className="w-full btn-shimmer group" size="lg" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Create Account
            </span>
          )}
        </Button>
      </form>
      <p className="text-center text-sm text-navy/50 mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
