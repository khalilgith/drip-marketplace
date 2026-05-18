import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-heading font-bold text-gold tracking-wider mb-4">DRIP</h3>
            <p className="text-gray-400 text-sm">
              Premium streetwear and footwear curated for those who refuse to blend in.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/shop" className="hover:text-gold transition-colors">All Products</Link>
              <Link href="/shop?category=Men" className="hover:text-gold transition-colors">Men</Link>
              <Link href="/shop?category=Women" className="hover:text-gold transition-colors">Women</Link>
              <Link href="/shop?category=Accessories" className="hover:text-gold transition-colors">Accessories</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="#" className="hover:text-gold transition-colors">Contact</Link>
              <Link href="#" className="hover:text-gold transition-colors">Shipping</Link>
              <Link href="#" className="hover:text-gold transition-colors">Returns</Link>
              <Link href="#" className="hover:text-gold transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="#" className="hover:text-gold transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-gold transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-gold transition-colors">TikTok</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DRIP. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
