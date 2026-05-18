"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { LogOut, User, Package, Heart, Settings } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
        return
      }
      setEmail(user.email || "")
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setFullName(data?.full_name || "")
          setLoading(false)
        })
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Profile updated")
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-gray-200" />
          <div className="h-40 bg-gray-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <User className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">{fullName || "My Account"}</h1>
          <p className="text-sm text-navy/50">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Package, label: "Orders", desc: "View your order history" },
          { icon: Heart, label: "Wishlist", desc: "Saved items" },
          { icon: Settings, label: "Settings", desc: "Manage your account" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-100 p-5 hover:border-gold/30 transition-colors cursor-pointer group">
            <item.icon className="h-5 w-5 text-gold group-hover:scale-110 transition-transform mb-3" />
            <h3 className="font-semibold text-sm">{item.label}</h3>
            <p className="text-xs text-navy/40 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleUpdate} className="bg-white border border-gray-100 p-7 space-y-5">
        <h2 className="font-heading font-bold text-lg">Profile Details</h2>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-cream/50" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled className="bg-gray-50 text-navy/50 cursor-not-allowed" />
        </div>
        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </form>
    </div>
  )
}
