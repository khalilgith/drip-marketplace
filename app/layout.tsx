import type { Metadata } from "next"
import { Barlow_Condensed, Syne, DM_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { CustomCursor } from "@/components/store/Cursor"
import { Providers } from "@/components/Providers"
import { AuthSync } from "@/components/AuthSync"

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
  title: {
    default: "DRIP — Premium Streetwear & Footwear",
    template: "%s — DRIP",
  },
  description: "Premium streetwear and footwear curated for those who refuse to blend in. Shop Nike, Adidas, Off-White, Fear of God, Balenciaga and more.",
  keywords: ["streetwear", "sneakers", "footwear", "Nike", "Adidas", "Off-White", "fashion", "DRIP"],
  openGraph: {
    type: "website",
    siteName: "DRIP",
    title: "DRIP — Premium Streetwear & Footwear",
    description: "Premium streetwear and footwear curated for those who refuse to blend in.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DRIP — Premium Streetwear & Footwear",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${syne.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body>
        <CustomCursor />
        <Providers>
          <AuthSync />
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
