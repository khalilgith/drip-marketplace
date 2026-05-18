import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "DRIP — Premium Streetwear & Footwear",
  description: "Premium streetwear and footwear curated for those who refuse to blend in.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
