import type { Metadata } from "next"
import { Barlow_Condensed, Syne, DM_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { CustomCursor } from "@/components/store/Cursor"

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "DRIP — Premium Streetwear & Footwear",
  description: "Premium streetwear and footwear curated for those who refuse to blend in.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${syne.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body>
        <CustomCursor />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
