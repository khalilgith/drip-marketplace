"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

/* ─── Framer Motion variants ─────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

/* ─── Reusable styled input ──────────────────────────────────────────────── */
function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  error,
  suffix,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  suffix?: React.ReactNode
}) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[9px] tracking-[0.28em] uppercase text-cream/40"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={[
            "w-full bg-cream/5 border text-cream font-body text-sm",
            "placeholder:text-cream/20 px-4 py-3.5",
            "outline-none transition-all duration-300",
            "focus:bg-white/[0.06]",
            suffix ? "pr-11" : "",
            error
              ? "border-red-500/60 focus:border-red-500/80"
              : "border-cream/10 focus:border-gold/50",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="font-mono text-[9px] tracking-[0.12em] text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </motion.div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    setPasswordError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes("email")) {
        setEmailError(error.message)
      } else {
        setPasswordError("Invalid email or password.")
      }
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-navy overflow-hidden">

      {/* ── Left: editorial image panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop"
          alt="DRIP – Premium Streetwear"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Layered dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/60 to-navy/40" />
        <div className="absolute inset-0 bg-navy/30" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              background:
                "radial-gradient(circle, rgba(201,168,76,0.20) 0%, transparent 65%)",
              top: "-15%",
              left: "-20%",
              animation: "floatOrb 22s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 380,
              height: 380,
              background:
                "radial-gradient(circle, rgba(212,255,0,0.09) 0%, transparent 65%)",
              bottom: "-10%",
              right: "-5%",
              animation: "floatOrb 18s ease-in-out -9s infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 280,
              height: 280,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)",
              top: "40%",
              left: "55%",
              animation: "floatOrb 15s ease-in-out -5s infinite",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link
            href="/"
            className="text-gold-gradient font-heading font-black text-4xl tracking-[0.18em]"
          >
            DRIP
          </Link>

          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-cream/30 mb-4">
              — Est. 2024
            </p>
            <h2
              className="font-heading font-black text-cream leading-[0.92] mb-5"
              style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)" }}
            >
              PREMIUM
              <br />
              <span className="text-gold-gradient">STREET</span>
              <br />
              WEAR
            </h2>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-cream/35 leading-relaxed max-w-[260px]">
              Curated drops. Limited runs.
              <br />
              Uncompromising quality.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ────────────────────────────────────────────── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-16 relative bg-navy">
        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(201,168,76,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(212,255,0,0.04) 0%, transparent 65%)",
          }}
        />

        <motion.div
          className="w-full max-w-sm relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} className="lg:hidden mb-10 text-center">
            <Link
              href="/"
              className="text-gold-gradient font-heading font-black text-3xl tracking-[0.18em]"
            >
              DRIP
            </Link>
          </motion.div>

          {/* Eyebrow + heading */}
          <motion.div variants={itemVariants} className="mb-10">
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-gold/65 mb-3">
              — Welcome back
            </p>
            <h1 className="font-heading font-black text-cream text-[3.25rem] tracking-tight leading-none">
              SIGN IN
            </h1>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <AuthInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              required
              error={emailError}
            />

            <AuthInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              error={passwordError}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-cream/25 hover:text-cream/55 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Forgot password */}
            <motion.div variants={itemVariants} className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold/55 hover:text-gold transition-colors border-b border-transparent hover:border-gold/40 pb-px"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-drip w-full justify-center py-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Signing in&hellip;
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    Sign In
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          {/* Register link */}
          <motion.p
            variants={itemVariants}
            className="text-center font-body text-[12px] text-cream/30 mt-8"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-gold hover:text-gold/70 transition-colors border-b border-gold/30 hover:border-gold/60 pb-px font-medium"
            >
              Create account
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
