export interface MockProduct {
  id: string
  brand_id: string | null
  name: string
  description: string | null
  price: number
  compare_price: number | null
  category: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  images: string[]
  stock: number
  featured: boolean
  created_at: string
  brands: { name: string; slug: string } | null
}

export interface MockBrand {
  id: string
  name: string
  slug: string
  description: string
  approved: boolean
  featured: boolean
}

export const mockBrands: MockBrand[] = [
  { id: "b1", name: "Nike", slug: "nike", description: "Just Do It.", approved: true, featured: true },
  { id: "b2", name: "Adidas", slug: "adidas", description: "Impossible Is Nothing.", approved: true, featured: true },
  { id: "b3", name: "Off-White", slug: "off-white", description: "Street luxury.", approved: true, featured: true },
  { id: "b4", name: "Jordan", slug: "jordan", description: "Wear the legacy.", approved: true, featured: true },
  { id: "b5", name: "Supreme", slug: "supreme", description: "Built for the culture.", approved: true, featured: false },
]

export const mockProducts: MockProduct[] = [
  {
    id: "p1", brand_id: "b1",
    name: "Air Max 90", description: "Iconic sneaker with visible Air cushioning.",
    price: 149.99, compare_price: 179.99, category: "Men",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=90"],
    stock: 50, featured: true, created_at: "2026-06-01T00:00:00Z",
    brands: { name: "Nike", slug: "nike" },
  },
  {
    id: "p2", brand_id: "b1",
    name: "Air Force 1", description: "Timeless classic basketball shoe.",
    price: 129.99, compare_price: null, category: "Men",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1597350584914-55bb62285896?w=600&q=90"],
    stock: 40, featured: true, created_at: "2026-05-28T00:00:00Z",
    brands: { name: "Nike", slug: "nike" },
  },
  {
    id: "p3", brand_id: "b2",
    name: "Ultraboost 23", description: "Ultimate energy return with every stride.",
    price: 189.99, compare_price: 219.99, category: "Men",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Grey", hex: "#808080" }],
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=90"],
    stock: 30, featured: true, created_at: "2026-05-25T00:00:00Z",
    brands: { name: "Adidas", slug: "adidas" },
  },
  {
    id: "p4", brand_id: "b3",
    name: "Arrows Hoodie", description: "Signature Off-White hoodie with arrow motif.",
    price: 395.00, compare_price: null, category: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Grey", hex: "#808080" }],
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=90"],
    stock: 20, featured: true, created_at: "2026-05-20T00:00:00Z",
    brands: { name: "Off-White", slug: "off-white" },
  },
  {
    id: "p5", brand_id: "b1",
    name: "Dunk Low Retro", description: "Basketball icon turned streetwear staple.",
    price: 119.99, compare_price: null, category: "Men",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "Red", hex: "#ff0000" }, { name: "Blue", hex: "#0000ff" }],
    images: ["https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=90"],
    stock: 35, featured: false, created_at: "2026-05-15T00:00:00Z",
    brands: { name: "Nike", slug: "nike" },
  },
  {
    id: "p6", brand_id: "b2",
    name: "Superstar", description: "The original shell-toe sneaker.",
    price: 89.99, compare_price: 109.99, category: "Women",
    sizes: ["5", "6", "7", "8", "9"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1608551279748-73f47931de2c?w=600&q=90"],
    stock: 45, featured: true, created_at: "2026-05-10T00:00:00Z",
    brands: { name: "Adidas", slug: "adidas" },
  },
  {
    id: "p7", brand_id: "b4",
    name: "Jordan 4 Retro", description: "Legendary silhouette, premium materials.",
    price: 225.00, compare_price: 259.99, category: "Men",
    sizes: ["8", "9", "10", "11", "12"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1771711286856-765bdbca923f?w=600&q=90"],
    stock: 25, featured: true, created_at: "2026-05-05T00:00:00Z",
    brands: { name: "Jordan", slug: "jordan" },
  },
  {
    id: "p8", brand_id: "b5",
    name: "Box Logo Tee", description: "The most iconic logo in streetwear.",
    price: 148.00, compare_price: null, category: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Red", hex: "#ff0000" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=90"],
    stock: 15, featured: false, created_at: "2026-05-01T00:00:00Z",
    brands: { name: "Supreme", slug: "supreme" },
  },
  {
    id: "p9", brand_id: "b1",
    name: "Classic Crew Socks", description: "Comfortable everyday crew socks.",
    price: 19.99, compare_price: null, category: "Accessories",
    sizes: ["One Size"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }],
    images: ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=90"],
    stock: 100, featured: false, created_at: "2026-04-28T00:00:00Z",
    brands: { name: "Nike", slug: "nike" },
  },
]
