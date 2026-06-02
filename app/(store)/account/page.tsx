"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { LogOut, User, Package, Heart, Settings, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  }),
}

const NAV_CARDS = [
  { icon: Package,  label: "Orders",   desc: "Track your order history",   href: "/account/orders" },
  { icon: Heart,    label: "Wishlist",  desc: "Your saved items",           href: "/wishlist" },
  { icon: Settings, label: "Settings", desc: "Profile & preferences",      href: "#settings" },
]

export default function AccountPage() {
  const [fullName, setFullName]   = useState("")
  const [email,    setEmail]      = useState("")
  const [loading,  setLoading]    = useState(true)
  const [saving,   setSaving]     = useState(false)
  const router  = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return }
      setEmail(user.email ?? "")
      supabase.from("profiles").select("full_name").eq("id", user.id).single()
        .then(({ data }) => { setFullName(data?.full_name ?? ""); setLoading(false) })
    })
  }, []) // eslint-disable-line

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id)
    setSaving(false)
    error ? toast.error(error.message) : toast.success("Profile updated")
  }

  const initials = fullName
    ? fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : email[0]?.toUpperCase() ?? "?"

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="space-y-6 max-w-2xl animate-pulse">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 bg-cream/5 rounded-none" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-cream/5" />
              <div className="h-3 w-56 bg-cream/5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-cream/5" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
      <div className="max-w-3xl">

        {/* Header */}
        <motion.div
          className="flex items-center gap-6 mb-14"
          initial="hidden" animate="visible" custom={0} variants={fadeUp}
        >
          <div className="w-16 h-16 bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <span className="font-heading font-black text-[22px] text-gold">{initials}</span>
          </div>
          <div>
            <h1 className="font-heading font-black text-[32px] lg:text-[40px] uppercase tracking-tight text-cream leading-none">
              {fullName || "My Account"}
            </h1>
            <p className="font-mono text-[11px] tracking-[0.2em] text-ash mt-1.5">{email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-auto flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-cream/30 hover:text-cream transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </motion.div>

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {NAV_CARDS.map((card, i) => (
            <motion.div key={card.label} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
              <Link
                href={card.href}
                className="group block border border-cream/8 bg-cream/3 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <card.icon className="h-5 w-5 text-gold" />
                  <ChevronRight className="h-4 w-4 text-cream/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-body font-semibold text-[13px] text-cream mb-1">{card.label}</h3>
                <p className="font-body text-[11px] text-ash">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Profile form */}
        <motion.div
          id="settings"
          className="border border-cream/8 bg-cream/3 p-8"
          initial="hidden" animate="visible" custom={4} variants={fadeUp}
        >
          <p className="section-label mb-2">Profile Details</p>
          <h2 className="font-heading font-black text-[22px] uppercase text-cream mb-7">Edit your profile</h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="font-mono text-[9px] tracking-[0.25em] uppercase text-ash block mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-cream/5 border border-cream/10 px-4 py-3 font-body text-[13px] text-cream placeholder:text-ash focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] tracking-[0.25em] uppercase text-ash block mb-2">
                Email Address
              </label>
              <input
                value={email}
                disabled
                className="w-full bg-cream/5 border border-cream/8 px-4 py-3 font-mono text-[12px] text-ash cursor-not-allowed"
              />
              <p className="font-mono text-[9px] text-ash/50 mt-1.5 tracking-wider">Email cannot be changed</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={saving} className="btn-drip">
                <span>{saving ? "Saving…" : "Save Changes"}</span>
                {!saving && <ArrowRight className="h-3 w-3" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
