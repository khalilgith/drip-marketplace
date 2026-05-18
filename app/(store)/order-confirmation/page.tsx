"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-heading font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      <div className="space-y-3">
        <Link href="/shop">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
