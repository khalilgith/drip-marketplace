"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Building2,
  ShoppingCart,
  Star,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="w-64 bg-navy text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="text-2xl font-heading font-bold text-gold tracking-wider">
          DRIP
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors",
                pathname === link.href
                  ? "bg-gold/20 text-gold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
