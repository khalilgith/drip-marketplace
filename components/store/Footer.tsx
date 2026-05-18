import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-navy text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-3xl font-heading font-bold tracking-[0.15em] text-gold-gradient">
              DRIP
            </Link>
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              Premium streetwear and footwear curated for those who refuse to blend in.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=Men", label: "Men" },
                { href: "/shop?category=Women", label: "Women" },
                { href: "/shop?category=Accessories", label: "Accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Support</h4>
            <ul className="space-y-3">
              {["Contact", "Shipping", "Returns", "FAQ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Connect</h4>
            <ul className="space-y-3">
              {["Instagram", "Twitter", "TikTok", "YouTube"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} DRIP. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
