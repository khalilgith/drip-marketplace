"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const supabase = createClient()

  const loadReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, products(name), profiles(full_name)")
      .order("created_at", { ascending: false })
    setReviews(data || [])
  }

  useEffect(() => { loadReviews() }, [])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id)
    if (error) { toast.error(error.message) } else { toast.success("Review deleted"); loadReviews() }
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Reviews</h1>
      <div className="bg-white border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.products?.name}</TableCell>
                <TableCell>{review.profiles?.full_name || "Anonymous"}</TableCell>
                <TableCell>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-gold text-sm">★</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
