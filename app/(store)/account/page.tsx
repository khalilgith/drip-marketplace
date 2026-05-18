"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { LogOut, User } from "lucide-react"

export default function AccountPage() {
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
        return
      }
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

  if (loading) return <div className="max-w-lg mx-auto px-4 py-16 text-center">Loading...</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-heading font-bold">My Account</h1>
      </div>
      <form onSubmit={handleUpdate} className="bg-white border border-gray-200 p-6 space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
      <div className="mt-6">
        <Button variant="destructive" onClick={handleSignOut} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
