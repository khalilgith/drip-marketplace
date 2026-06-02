"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"

/* ─── Framer Motion variants ─────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12,
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

/* ─── Password strength calculator ──────────────────────────────────────── */
function getPasswordStrength(pw: string): {
  score: 0 | 1 | 2 | 3
  label: string
  color: string
  width: string
} {
  if (!pw) return { score: 0, label: "", color: "", width: "0%" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  const levels = [
    { score: 1, label: "Weak",   color: "#ef4444", width: "28%" },
    { score: 2, label: "Fair",   color: "#f59e0b", width: "56%" },
    { score: 3, label: "Good",   color: "#22c55e", width: "78%" },
    { score: 4, label: "Strong", color: "#D4FF00", width: "100%" },
  ] as const

  const level = levels[Math.min(score, 4) - 1] ?? { score: 0, label: "", color: "", width: "0%" }
  return level as { score: 0 | 1 | 2 | 3; label: string; color: string; width: string }
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
  hint,
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
  hint?: string
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
      {hint && !error && (
        <p className="font-mono text-[9px] tracking-[0.12em] text-cream/25 mt-0.5">
          {hint}
        </p>
      )}
    </motion.div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [termsError, setTermsError] = useState("")

  const router = useRouter()

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setNameError("")
    setEmailError("")
    setPasswordError("")
    setConfirmError("")
    setTermsError("")

    let valid = true

    if (!fullName.trim()) {
      setNameError("Full name is required.")
      valid = false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.")
      valid = false
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.")
      valid = false
    }
    if (!agreed) {
      setTermsError("You must agree to the terms to continue.")
      valid = false
    }
    if (!valid) return

    setLoading(true)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Failed to create account")
      setEmailError(data.error || "Failed to create account")
      setLoading(false)
      return
    }

    toast.success("Account created! You can now sign in.")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex bg-navy overflow-hidden">

      {/* ── Left: editorial image panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=85&fit=crop"
          alt="DRIP – Join the Movement"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Layered dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/65 to-navy/35" />
        <div className="absolute inset-0 bg-navy/25" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(212,255,0,0.12) 0%, transparent 65%)",
              top: "-10%",
              right: "-15%",
              animation: "floatOrb 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 420,
              height: 420,
              background:
                "radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 65%)",
              bottom: "-8%",
              left: "-10%",
              animation: "floatOrb 25s ease-in-out -12s infinite",
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
              — Join the movement
            </p>
            <h2
              className="font-heading font-black text-cream leading-[0.92] mb-5"
              style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)" }}
            >
              EXCLUSIVE
              <br />
              <span className="text-gold-gradient">ACCESS</span>
              <br />
              AWAITS
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                "Early access to new drops",
                "Members-only pricing",
                "Order history & tracking",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2.5">
                  <span
                    className="flex items-center justify-center w-4 h-4 flex-shrink-0"
                    style={{
                      background: "rgba(212,255,0,0.12)",
                      border: "1px solid rgba(212,255,0,0.25)",
                    }}
                  >
                    <Check className="h-2.5 w-2.5 text-volt" />
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-cream/40">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ────────────────────────────────────────────── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-12 relative bg-navy overflow-y-auto">
        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(212,255,0,0.05) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(201,168,76,0.05) 0%, transparent 65%)",
          }}
        />

        <motion.div
          className="w-full max-w-sm relative py-4"
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
          <motion.div variants={itemVariants} className="mb-9">
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-gold/65 mb-3">
              — New member
            </p>
            <h1 className="font-heading font-black text-cream text-[3rem] tracking-tight leading-none">
              CREATE
              <br />
              ACCOUNT
            </h1>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <AuthInput
              id="fullName"
              label="Full name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="John Doe"
              required
              error={nameError}
            />

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

            {/* Password with strength indicator */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-mono text-[9px] tracking-[0.28em] uppercase text-cream/40"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={[
                    "w-full bg-cream/5 border text-cream font-body text-sm",
                    "placeholder:text-cream/20 px-4 py-3.5 pr-11",
                    "outline-none transition-all duration-300 focus:bg-white/[0.06]",
                    passwordError
                      ? "border-red-500/60 focus:border-red-500/80"
                      : "border-cream/10 focus:border-gold/50",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/25 hover:text-cream/55 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <div className="flex items-center gap-2.5 mt-1">
                  <div className="flex-1 h-px bg-cream/8 overflow-hidden relative">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-500"
                      style={{
                        width: strength.width,
                        backgroundColor: strength.color,
                        height: "100%",
                      }}
                    />
                  </div>
                  {strength.label && (
                    <span
                      className="font-mono text-[8px] tracking-[0.2em] uppercase flex-shrink-0"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>
              )}

              {passwordError && (
                <p className="font-mono text-[9px] tracking-[0.12em] text-red-400">
                  {passwordError}
                </p>
              )}
              {!passwordError && (
                <p className="font-mono text-[9px] tracking-[0.12em] text-cream/25">
                  At least 6 characters
                </p>
              )}
            </motion.div>

            {/* Confirm password */}
            <AuthInput
              id="confirmPassword"
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              required
              error={confirmError}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-cream/25 hover:text-cream/55 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Terms checkbox */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked)
                      if (e.target.checked) setTermsError("")
                    }}
                    className="sr-only"
                  />
                  <div
                    className={[
                      "w-4 h-4 border transition-all duration-200 flex items-center justify-center",
                      agreed
                        ? "bg-gold border-gold"
                        : termsError
                        ? "border-red-500/60"
                        : "border-cream/20 group-hover:border-cream/40",
                    ].join(" ")}
                  >
                    {agreed && (
                      <Check className="h-2.5 w-2.5 text-navy" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="font-body text-[11px] text-cream/35 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold/50 pb-px"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold/50 pb-px"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {termsError && (
                <p className="font-mono text-[9px] tracking-[0.12em] text-red-400 ml-7">
                  {termsError}
                </p>
              )}
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
                    Creating account&hellip;
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    Create Account
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          {/* Login link */}
          <motion.p
            variants={itemVariants}
            className="text-center font-body text-[12px] text-cream/30 mt-8"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gold hover:text-gold/70 transition-colors border-b border-gold/30 hover:border-gold/60 pb-px font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
