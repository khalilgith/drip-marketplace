"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star, Trash2, MessageSquare, BarChart2 } from "lucide-react"
import { toast } from "sonner"

// ── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  products: { name: string } | null
  profiles: { full_name: string | null } | null
}

// ── Rating filter tabs ────────────────────────────────────────────────────────

const RATING_TABS = ["All", "5★", "4★", "3★", "≤2★"] as const
type RatingTab = (typeof RATING_TABS)[number]

function matchesTab(review: Review, tab: RatingTab): boolean {
  if (tab === "All") return true
  if (tab === "5★") return review.rating === 5
  if (tab === "4★") return review.rating === 4
  if (tab === "3★") return review.rating === 3
  if (tab === "≤2★") return review.rating <= 2
  return true
}

// ── Star display ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={[
            "h-3.5 w-3.5",
            i < rating
              ? "fill-[#C9A84C] text-[#C9A84C]"
              : "fill-transparent text-white/20",
          ].join(" ")}
        />
      ))}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function DarkStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0f0f18] p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10">
        <Icon className="h-5 w-5 text-[#C9A84C]" />
      </div>
      <div>
        <p className="text-xs font-body text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="font-heading text-2xl font-bold text-[#EDE9DF]">{value}</p>
      </div>
    </div>
  )
}

// ── Confirm delete dialog (inline) ───────────────────────────────────────────

function DeleteButton({
  onConfirm,
  disabled,
}: {
  onConfirm: () => void
  disabled: boolean
}) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setConfirming(false)
            onConfirm()
          }}
          className="rounded bg-red-500/20 px-2 py-1 font-mono text-[10px] text-red-400 hover:bg-red-500/30"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-gray-400 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={() => setConfirming(true)}
      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<RatingTab>("All")

  const supabase = createClient()

  const loadReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("reviews")
      .select("*, products(name), profiles(full_name)")
      .order("created_at", { ascending: false })
    if (error) {
      toast.error(error.message)
    } else {
      setReviews((data as Review[]) || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadReviews()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
      if (res.status === 204 || res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id))
        toast.success("Review deleted")
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        toast.error(err.error ?? "Failed to delete review")
      }
    } catch {
      toast.error("Network error — try again")
    } finally {
      setDeletingId(null)
    }
  }

  // Stats
  const totalReviews = reviews.length
  const averageRating =
    totalReviews === 0
      ? "—"
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)

  // Filtered list
  const filtered = useMemo(
    () => reviews.filter((r) => matchesTab(r, activeTab)),
    [reviews, activeTab]
  )

  return (
    <div className="min-h-screen bg-[#08080C] text-[#EDE9DF]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide text-[#EDE9DF]">
          Reviews
        </h1>
        <p className="mt-1 font-body text-sm text-gray-400">
          Moderate customer product reviews
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DarkStatCard icon={MessageSquare} label="Total Reviews" value={totalReviews} />
        <DarkStatCard icon={BarChart2} label="Average Rating" value={averageRating} />
      </div>

      {/* Rating filter tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto">
        {RATING_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "shrink-0 rounded px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
              activeTab === tab
                ? "bg-[#C9A84C] text-[#08080C]"
                : "text-gray-400 hover:bg-white/5 hover:text-[#EDE9DF]",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0f0f18]">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
            Loading reviews…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
            No reviews found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Reviewer
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Product
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Rating
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Comment
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Date
                </TableHead>
                <TableHead className="text-right font-mono text-xs uppercase tracking-widest text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((review) => (
                <TableRow
                  key={review.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  {/* Reviewer */}
                  <TableCell className="font-body text-sm text-[#EDE9DF]">
                    {review.profiles?.full_name || (
                      <span className="text-gray-500 italic">Anonymous</span>
                    )}
                  </TableCell>

                  {/* Product */}
                  <TableCell className="font-body text-sm text-gray-300">
                    {review.products?.name || (
                      <span className="text-gray-500 italic">Deleted product</span>
                    )}
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <StarRating rating={review.rating} />
                      <span className="font-mono text-[10px] text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </TableCell>

                  {/* Comment */}
                  <TableCell className="max-w-xs">
                    {review.comment ? (
                      <p
                        className="font-body text-sm text-gray-300 line-clamp-2"
                        title={review.comment}
                      >
                        {review.comment}
                      </p>
                    ) : (
                      <span className="text-gray-500 italic text-xs">No comment</span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="font-mono text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DeleteButton
                      onConfirm={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
