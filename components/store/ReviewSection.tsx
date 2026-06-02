"use client"

import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Profile {
  full_name: string | null
  avatar_url: string | null
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: Profile | null
}

interface ReviewSectionProps {
  productId: string
  initialReviews?: Review[]
  isLoggedIn?: boolean
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  const mos = Math.floor(days / 30)
  const yrs = Math.floor(mos / 12)
  if (yrs > 0) return `${yrs}Y AGO`
  if (mos > 0) return `${mos}MO AGO`
  if (days > 0) return `${days}D AGO`
  if (hrs > 0) return `${hrs}H AGO`
  if (mins > 0) return `${mins}M AGO`
  return "JUST NOW"
}

function initials(name: string | null | undefined): string {
  if (!name) return "AN"
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function avg(reviews: Review[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

/* ─── Star SVG ──────────────────────────────────────────────────────────────── */

function StarIcon({
  fill = 0,
  size = 14,
}: {
  fill?: number // 0 empty, 0.5 half, 1 full
  size?: number
}) {
  const id = `g${Math.random().toString(36).slice(2)}`
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#C9A84C" />
          <stop offset={`${fill * 100}%`} stopColor="#C9A84C" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.5l2.39 4.84 5.34.78-3.86 3.77.91 5.32L10 13.77l-4.78 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
        fill={`url(#${id})`}
        stroke="#C9A84C"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarRow({
  rating,
  size = 14,
}: {
  rating: number
  size?: number
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          size={size}
          fill={rating >= n ? 1 : rating >= n - 0.5 ? 0.5 : 0}
        />
      ))}
    </div>
  )
}

/* ─── Interactive Star Selector ─────────────────────────────────────────────── */

function StarSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = hovered ? hovered >= n : value >= n
        return (
          <motion.button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onClick={() => onChange(n)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.15 }}
            className="focus:outline-none"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <motion.path
                d="M10 1.5l2.39 4.84 5.34.78-3.86 3.77.91 5.32L10 13.77l-4.78 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                animate={{
                  fill: active ? "#C9A84C" : "rgba(201,168,76,0.08)",
                  stroke: active ? "#C9A84C" : "rgba(201,168,76,0.3)",
                }}
                transition={{ duration: 0.18 }}
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )
      })}
    </div>
  )
}

/* ─── Rating Distribution Bar ───────────────────────────────────────────────── */

function DistributionBar({
  label,
  count,
  total,
  index,
}: {
  label: number
  count: number
  total: number
  index: number
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono text-[9px] text-cream/40 tracking-widest w-3 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/5 relative overflow-visible">
        <motion.div
          className="absolute top-[-1px] left-0 h-[2px] bg-gold origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ delay: 0.1 + 0.04 * index, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="font-mono text-[9px] text-cream/25 w-8 text-right shrink-0">
        {count}
      </span>
    </motion.div>
  )
}

/* ─── Review Card ───────────────────────────────────────────────────────────── */

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const name = review.profiles?.full_name ?? "Anonymous"
  const ini = initials(name)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-b border-white/[0.06] pb-8 last:border-0"
    >
      {/* Subtle vertical accent line */}
      <div className="absolute left-0 top-0 bottom-8 w-px bg-gradient-to-b from-gold/20 via-gold/5 to-transparent" />

      <div className="pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar circle */}
            <div className="w-9 h-9 bg-[#13131a] border border-white/10 flex items-center justify-center shrink-0">
              <span className="font-mono text-[9px] font-bold text-gold tracking-widest">
                {ini}
              </span>
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-cream/80 tracking-wide leading-tight">
                {name}
              </p>
              <time className="font-mono text-[8px] text-cream/25 tracking-[0.18em]">
                {relativeDate(review.created_at)}
              </time>
            </div>
          </div>

          <StarRow rating={review.rating} size={11} />
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="font-body text-sm text-cream/50 leading-[1.8] tracking-wide">
            {review.comment}
          </p>
        )}

        {/* Rating chip */}
        <div className="mt-3">
          <span className="font-mono text-[8px] text-gold/40 tracking-[0.2em]">
            {review.rating}.0 / 5.0
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Write Review Form ─────────────────────────────────────────────────────── */

function WriteReviewForm({
  productId,
  onSuccess,
}: {
  productId: string
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rating, comment }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to submit review")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] })
      setSubmitted(true)
      onSuccess()
    },
  })

  return (
    <div className="mt-10 border-t border-white/[0.06] pt-8">
      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-4 group w-full text-left"
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-mono text-[9px] text-gold tracking-[0.28em] uppercase group-hover:text-gold/70 transition-colors">
          {open ? "— Close" : "+ Write a Review"}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-8 pb-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 border border-gold/30 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                    >
                      <motion.path d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  <p className="font-mono text-[9px] text-gold tracking-[0.28em] uppercase">
                    Review Submitted
                  </p>
                  <p className="font-body text-xs text-cream/30 mt-2">
                    Thank you for sharing your thoughts.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault()
                    mutation.mutate()
                  }}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  {/* Rating selector */}
                  <div>
                    <p className="font-mono text-[9px] text-cream/40 tracking-[0.2em] uppercase mb-3">
                      Your Rating
                    </p>
                    <StarSelector value={rating} onChange={setRating} />
                  </div>

                  {/* Comment textarea */}
                  <div>
                    <p className="font-mono text-[9px] text-cream/40 tracking-[0.2em] uppercase mb-3">
                      Comment{" "}
                      <span className="text-cream/20">(optional)</span>
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience with this piece..."
                      className="w-full bg-[#0e0e12] border border-white/10 text-cream/70 font-body text-sm px-4 py-3 resize-none placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors leading-relaxed"
                    />
                  </div>

                  {/* Error */}
                  {mutation.isError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-[9px] text-red-400/80 tracking-wide"
                    >
                      {(mutation.error as Error).message}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={rating === 0 || mutation.isPending}
                    className="btn-drip disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold tracking-[0.18em] uppercase"
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="40"
                            strokeDashoffset="10"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export function ReviewSection({
  productId,
  initialReviews,
  isLoggedIn = false,
}: ReviewSectionProps) {
  const { data: reviews = initialReviews ?? [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () =>
      fetch("/api/reviews?product_id=" + productId).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch reviews")
        return r.json()
      }),
    initialData: initialReviews,
    staleTime: 30_000,
  })

  const [newReviewAdded, setNewReviewAdded] = useState(false)

  const average = avg(reviews)
  const total = reviews.length
  const rounded = Math.round(average * 10) / 10

  // Distribution counts
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  const handleSuccess = useCallback(() => {
    setNewReviewAdded(true)
  }, [])

  return (
    <section className="bg-navy border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-24">

        {/* ── Section header ── */}
        <motion.div
          className="flex items-center gap-6 mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-px w-8 bg-gold/40 shrink-0" />
          <span className="font-mono text-[9px] text-gold tracking-[0.3em] uppercase whitespace-nowrap">
            Customer Reviews
          </span>
          <motion.div
            className="h-px flex-1 bg-gradient-to-r from-gold/10 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />
          {total > 0 && (
            <span className="font-mono text-[9px] text-cream/20 tracking-[0.18em] whitespace-nowrap">
              {total} {total === 1 ? "REVIEW" : "REVIEWS"}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">

          {/* ══════════════════════════════════════════
              LEFT COLUMN: Rating Summary
          ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="self-start lg:sticky lg:top-8"
          >
            {total > 0 ? (
              <>
                {/* Big average number */}
                <div className="mb-6">
                  <div className="flex items-end gap-4 mb-3">
                    <span
                      className="font-mono leading-none text-cream"
                      style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
                    >
                      {rounded.toFixed(1)}
                    </span>
                    <div className="pb-2">
                      <StarRow rating={average} size={16} />
                      <p className="font-mono text-[8px] text-cream/25 tracking-[0.2em] mt-2">
                        OUT OF 5.0
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-[9px] text-cream/30 tracking-[0.18em]">
                    Based on {total} {total === 1 ? "review" : "reviews"}
                  </p>
                </div>

                {/* Thin gold divider */}
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent mb-7" />

                {/* Distribution bars */}
                <div className="space-y-3">
                  {dist.map(({ star, count }, i) => (
                    <DistributionBar
                      key={star}
                      label={star}
                      count={count}
                      total={total}
                      index={i}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 lg:text-left">
                <div
                  className="font-mono text-cream/5 leading-none mb-2 select-none"
                  style={{ fontSize: "clamp(4rem, 8vw, 6rem)" }}
                >
                  —
                </div>
                <p className="font-mono text-[9px] text-cream/25 tracking-[0.2em]">
                  NO REVIEWS YET
                </p>
              </div>
            )}

            {/* Write review CTA – not logged in */}
            {!isLoggedIn && (
              <motion.div
                className="mt-10 p-5 border border-white/[0.06] bg-[#0e0e12]"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <p className="font-body text-xs text-cream/40 leading-relaxed mb-4">
                  Sign in to share your experience with this piece.
                </p>
                <Link
                  href="/login"
                  className="btn-ghost inline-block text-[9px] font-mono tracking-[0.2em] uppercase"
                >
                  Sign In to Review
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN: Review List + Form
          ══════════════════════════════════════════ */}
          <div>
            {isLoading ? (
              /* Skeleton */
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b border-white/[0.06] pb-8 pl-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-white/5 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-24 bg-white/5 animate-pulse" />
                        <div className="h-2 w-16 bg-white/[0.03] animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 w-full bg-white/[0.03] animate-pulse" />
                      <div className="h-2.5 w-4/5 bg-white/[0.03] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <motion.div
                className="py-12"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Editorial empty state */}
                <div className="relative">
                  <div
                    className="font-heading text-cream/[0.03] leading-none select-none uppercase"
                    style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
                  >
                    FIRST
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center pl-2">
                    <p className="font-mono text-[9px] text-gold tracking-[0.3em] uppercase mb-2">
                      No Reviews Yet
                    </p>
                    <p className="font-body text-sm text-cream/30 max-w-xs leading-relaxed">
                      Be the first to review this product. Your voice shapes the culture.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div className="space-y-8" layout>
                  {reviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Write review form (logged in only) */}
            {isLoggedIn && (
              <WriteReviewForm productId={productId} onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
