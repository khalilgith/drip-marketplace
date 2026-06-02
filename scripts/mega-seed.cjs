/**
 * DRIP Mega Seed — updates all existing product images and adds
 * 6 new brands (Jordan, New Balance, Stone Island, Stüssy, Carhartt WIP, Supreme)
 * plus 50+ new products with high-quality Unsplash imagery.
 *
 * Run: node scripts/mega-seed.cjs
 */
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  "https://nyklrrynqyrbtdletkos.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a2xycnlucXlyYnRkbGV0a29zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA5OTk1MSwiZXhwIjoyMDk0Njc1OTUxfQ.XsxgTdD1EfN3PH7K5T8ls3PKuGKZGLTOKXatGI8Dpc0"
)

// ─── Image library ────────────────────────────────────────────────────────────
// High-quality, confirmed-working Unsplash photos for streetwear/sneakers
const IMG = {
  // Sneakers
  nikeAirMax90:     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90",
  nikeAF1:          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=90",
  nikeDunk:         "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=90",
  nikePegasus:      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=90",
  nikeZoom:         "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=90",
  nikeWomenShoe:    "https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=800&q=90",
  nikeMultiple:     "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=90",
  jordanHigh:       "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=90",
  jordanLow:        "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=90",
  jordanRetro:      "https://images.unsplash.com/photo-1612968855216-1da671af8264?w=800&q=90",
  adidasBoost:      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=90",
  adidasWhite:      "https://images.unsplash.com/photo-1605196188105-af39f84e06d8?w=800&q=90",
  adidasForum:      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=90",
  adidasOnFoot:     "https://images.unsplash.com/photo-1556906781-9dcd19c36b43?w=800&q=90",
  adidasColorful:   "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=90",
  sneakerOverhead:  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=90",
  sneakerFlatlay:   "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=90",
  chunkySneaker:    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90",
  offCourtSneak:    "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=90",
  nbClassic:        "https://images.unsplash.com/photo-1556906781-9dcd19c36b43?w=800&q=90",
  nbGrey:           "https://images.unsplash.com/photo-1605196188105-af39f84e06d8?w=800&q=90",
  // Hoodies / Sweatshirts
  darkHoodie:       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=90",
  greyHoodie:       "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=90",
  modelHoodie:      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=90",
  vintageHoodie:    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=90",
  creamHoodie:      "https://images.unsplash.com/photo-1591394016949-be8fcd0e49be?w=800&q=90",
  zipHoodie:        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=90",
  // Jackets
  bomberJacket:     "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&q=90",
  runningJacket:    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90",
  // T-shirts
  whiteTee:         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90",
  blackTee:         "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=90",
  fashionTee:       "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=90",
  graphicTee:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90",
  // Bottoms
  sweatpants:       "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=90",
  darkJeans:        "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=90",
  casualPants:      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=90",
  // Accessories
  snapback:         "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=90",
  flatBrimCap:      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=90",
  whiteCap:         "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=90",
  sunglasses:       "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=90",
  luxBag:           "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=90",
  backpack:         "https://images.unsplash.com/photo-1561861422-a549073e547a?w=800&q=90",
  crewSocks:        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=90",
  slides:           "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=90",
}

// ─── Brand IDs ────────────────────────────────────────────────────────────────
const B = {
  nike:        "72d5834b-8c82-4d32-b6be-d31e44309fc4",
  adidas:      "b457e310-195c-4d9d-b152-cb9480fab6f7",
  offWhite:    "0112c7b3-739c-462a-874a-aed51e1cf797",
  fog:         "a1b2c3d4-0001-4000-8000-000000000001",
  balenciaga:  "a1b2c3d4-0002-4000-8000-000000000002",
  jordan:      "a1b2c3d4-0003-4000-8000-000000000003",
  nb:          "a1b2c3d4-0004-4000-8000-000000000004",
  stoneIsland: "a1b2c3d4-0005-4000-8000-000000000005",
  stussy:      "a1b2c3d4-0006-4000-8000-000000000006",
  carhartt:    "a1b2c3d4-0007-4000-8000-000000000007",
  supreme:     "a1b2c3d4-0008-4000-8000-000000000008",
}

// ─── New brands ───────────────────────────────────────────────────────────────
const NEW_BRANDS = [
  { id: B.jordan,      name: "Jordan Brand",   slug: "jordan",      description: "Air Jordan — born on the court, built for the culture.", approved: true, featured: true },
  { id: B.nb,          name: "New Balance",     slug: "new-balance", description: "Fearlessly independent since 1906.",                     approved: true, featured: true },
  { id: B.stoneIsland, name: "Stone Island",    slug: "stone-island", description: "Research and experimentation in fabric treatment.",      approved: true, featured: true },
  { id: B.stussy,      name: "Stüssy",          slug: "stussy",      description: "Original World Wide Tribe. Est. 1980.",                 approved: true, featured: true },
  { id: B.carhartt,    name: "Carhartt WIP",    slug: "carhartt-wip", description: "Work In Progress — workwear reimagined for street.",    approved: true, featured: true },
  { id: B.supreme,     name: "Supreme",         slug: "supreme",     description: "New York City. Est. 1994.",                             approved: true, featured: true },
]

// ─── Image updates for ALL existing products ─────────────────────────────────
const IMAGE_UPDATES = [
  // Nike
  { brand_id: B.nike, name: "Air Max 90",           images: [IMG.nikeAirMax90, IMG.nikeMultiple]    },
  { brand_id: B.nike, name: "Air Force 1",           images: [IMG.nikeAF1, IMG.nikeWomenShoe]        },
  { brand_id: B.nike, name: "Dunk Low Retro",        images: [IMG.nikeDunk, IMG.jordanHigh]          },
  { brand_id: B.nike, name: "Classic Crew Socks",    images: [IMG.crewSocks]                         },
  { brand_id: B.nike, name: "Tech Fleece Hoodie",    images: [IMG.darkHoodie, IMG.greyHoodie]        },
  { brand_id: B.nike, name: "Windrunner Jacket",     images: [IMG.runningJacket, IMG.bomberJacket]   },
  { brand_id: B.nike, name: "Pegasus Trail 4",       images: [IMG.nikePegasus, IMG.nikeZoom]         },
  { brand_id: B.nike, name: "Air Zoom Vapor",        images: [IMG.nikeZoom, IMG.nikeAirMax90]        },
  { brand_id: B.nike, name: "Dri-FIT Training Tee",  images: [IMG.blackTee, IMG.whiteTee]            },
  { brand_id: B.nike, name: "Air Force 1 Sage Low",  images: [IMG.nikeWomenShoe, IMG.nikeAF1]        },
  // Adidas
  { brand_id: B.adidas, name: "Ultraboost 23",       images: [IMG.adidasBoost, IMG.adidasOnFoot]     },
  { brand_id: B.adidas, name: "Superstar",            images: [IMG.adidasWhite, IMG.sneakerFlatlay]   },
  { brand_id: B.adidas, name: "Forum Low",            images: [IMG.adidasForum, IMG.adidasColorful]   },
  { brand_id: B.adidas, name: "Adilette Slides",     images: [IMG.slides]                            },
  { brand_id: B.adidas, name: "3-Stripes Tee",       images: [IMG.whiteTee, IMG.blackTee]            },
  { brand_id: B.adidas, name: "Adicolor Classic Hoodie", images: [IMG.vintageHoodie, IMG.darkHoodie] },
  { brand_id: B.adidas, name: "Runfalcon 3.0",       images: [IMG.adidasColorful, IMG.adidasOnFoot]  },
  { brand_id: B.adidas, name: "Gazelle Indoor",      images: [IMG.adidasOnFoot, IMG.adidasForum]     },
  // Off-White
  { brand_id: B.offWhite, name: "Arrows Hoodie",     images: [IMG.darkHoodie, IMG.modelHoodie]       },
  { brand_id: B.offWhite, name: "Diagonal Zip Hoodie", images: [IMG.zipHoodie, IMG.bomberJacket]     },
  { brand_id: B.offWhite, name: "Off-Court Sneakers", images: [IMG.offCourtSneak, IMG.jordanLow]     },
  { brand_id: B.offWhite, name: "Industrial Belt",   images: [IMG.flatBrimCap]                       },
  { brand_id: B.offWhite, name: "Caravaggio Tee",    images: [IMG.fashionTee, IMG.graphicTee]        },
  { brand_id: B.offWhite, name: "Out Of Office Sneakers", images: [IMG.nikeWomenShoe, IMG.adidasWhite] },
  // Fear of God
  { brand_id: B.fog, name: "Essentials Hoodie",      images: [IMG.greyHoodie, IMG.creamHoodie]       },
  { brand_id: B.fog, name: "Essentials Jogger",      images: [IMG.sweatpants, IMG.casualPants]       },
  { brand_id: B.fog, name: "Essentials Tee",         images: [IMG.graphicTee, IMG.whiteTee]          },
  { brand_id: B.fog, name: "California Bomber",      images: [IMG.bomberJacket, IMG.runningJacket]   },
  { brand_id: B.fog, name: "Eternal Denim",          images: [IMG.darkJeans, IMG.casualPants]        },
  // Balenciaga
  { brand_id: B.balenciaga, name: "Speed Trainer",   images: [IMG.sneakerOverhead, IMG.chunkySneaker] },
  { brand_id: B.balenciaga, name: "Triple S Sneaker", images: [IMG.chunkySneaker, IMG.sneakerOverhead] },
  { brand_id: B.balenciaga, name: "Hourglass Sunglasses", images: [IMG.sunglasses]                  },
  { brand_id: B.balenciaga, name: "Logo T-Shirt",    images: [IMG.fashionTee, IMG.graphicTee]        },
  { brand_id: B.balenciaga, name: "City Bag",        images: [IMG.luxBag, IMG.backpack]              },
]

// ─── New products ─────────────────────────────────────────────────────────────
const NEW_PRODUCTS = [
  // ── Jordan Brand ─────────────────────────────────────────────────────────
  { brand_id: B.jordan, name: "Air Jordan 1 Retro High OG 'Chicago'", description: "The shoe that started it all. Black toe collar, red ankle collar, Chicago colorway.", price: 180, category: "Men", sizes: ["7","8","9","10","11","12","13"], colors: [{"hex":"#ff0000","name":"Chicago Red"},{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}], images: [IMG.jordanHigh, IMG.jordanRetro], stock: 25, featured: true },
  { brand_id: B.jordan, name: "Air Jordan 1 Low 'Triple White'", description: "Clean all-white low-top AJ1 perfect for everyday wear.", price: 110, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"}], images: [IMG.jordanLow, IMG.nikeAF1], stock: 40, featured: true },
  { brand_id: B.jordan, name: "Air Jordan 3 Retro 'Black Cement'", description: "Nike Air-visible heel, elephant print overlays, iconic cement coloring.", price: 200, category: "Men", sizes: ["7","8","9","10","11","12","13"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Cement Grey"}], images: [IMG.jordanRetro, IMG.jordanHigh], stock: 15, featured: true },
  { brand_id: B.jordan, name: "Air Jordan 4 Retro 'Military Blue'", description: "Mid-ankle collar, mesh side panels, military blue accents. A grail reissue.", price: 210, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#6b7ea0","name":"Military Blue"},{"hex":"#f5f5f5","name":"White"}], images: [IMG.jordanHigh, IMG.jordanLow], stock: 20, featured: true },
  { brand_id: B.jordan, name: "Air Jordan 11 Retro 'Bred'", description: "Patent leather mudguard, mesh upper — the most anticipated drop of any year.", price: 220, category: "Men", sizes: ["7","8","9","10","11","12","13"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}], images: [IMG.jordanRetro, IMG.nikeDunk], stock: 12, featured: true },
  { brand_id: B.jordan, name: "Jordan Essentials Fleece Hoodie", description: "Heavyweight pullover with embroidered Jumpman logo and kangaroo pocket.", price: 85, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}], images: [IMG.darkHoodie, IMG.greyHoodie], stock: 60, featured: false },
  { brand_id: B.jordan, name: "Jordan Sport Crossover Shorts", description: "Dual-layer Dri-FIT shorts built for gym and street.", price: 55, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Carbon Grey"}], images: [IMG.sweatpants, IMG.casualPants], stock: 75, featured: false },
  { brand_id: B.jordan, name: "Jordan Flight Graphic Tee", description: "Heavyweight cotton tee with vintage Jumpman graphic.", price: 40, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}], images: [IMG.graphicTee, IMG.whiteTee], stock: 90, featured: false },
  { brand_id: B.jordan, name: "Jordan Steph Cap", description: "6-panel structured cap with embroidered Jumpman. One of the most clean caps in streetwear.", price: 32, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"},{"hex":"#ffffff","name":"White"}], images: [IMG.snapback, IMG.flatBrimCap], stock: 120, featured: false },
  { brand_id: B.jordan, name: "Air Jordan Women's 1 Mid SE", description: "Sail, metallic gold, and patent leather — the women's mid gets an elevated treatment.", price: 120, category: "Women", sizes: ["5","6","7","8","9","10"], colors: [{"hex":"#f5f5dc","name":"Sail"},{"hex":"#c5a642","name":"Gold"}], images: [IMG.nikeWomenShoe, IMG.jordanLow], stock: 30, featured: true },

  // ── New Balance ───────────────────────────────────────────────────────────
  { brand_id: B.nb, name: "New Balance 550 'White Grey'", description: "80s basketball reissue with clean leather upper and bold OG branding.", price: 110, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#808080","name":"Grey"}], images: [IMG.nbGrey, IMG.adidasWhite], stock: 35, featured: true },
  { brand_id: B.nb, name: "New Balance 990v6 'Made in USA'", description: "The pinnacle of NB craftsmanship. Grey suede, mesh upper, ENCAP midsole.", price: 185, category: "Men", sizes: ["7","8","9","10","11","12","13"], colors: [{"hex":"#808080","name":"Grey"},{"hex":"#000000","name":"Black"}], images: [IMG.nbClassic, IMG.nbGrey], stock: 20, featured: true },
  { brand_id: B.nb, name: "New Balance 2002R 'Protection Pack'", description: "Suede and mesh upper with dramatic color-blocking. The grail for the serious collector.", price: 120, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#808080","name":"Rain Cloud"},{"hex":"#a0b4a0","name":"Mineral Green"}], images: [IMG.adidasForum, IMG.nbClassic], stock: 28, featured: true },
  { brand_id: B.nb, name: "New Balance 574 Core Plus", description: "The everyday icon — EVA foam midsole, suede overlays, versatile coloring.", price: 90, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#808080","name":"Grey"},{"hex":"#000080","name":"Navy"}], images: [IMG.adidasColorful, IMG.nbGrey], stock: 50, featured: false },
  { brand_id: B.nb, name: "New Balance Athletics Windbreaker", description: "Lightweight packable shell with classic NB branding and athletic fit.", price: 95, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000080","name":"Navy"},{"hex":"#808080","name":"Grey"}], images: [IMG.runningJacket, IMG.bomberJacket], stock: 30, featured: false },
  { brand_id: B.nb, name: "NB Essentials Crewneck", description: "French terry crewneck with embroidered arch NB wordmark.", price: 65, category: "Women", sizes: ["XS","S","M","L","XL"], colors: [{"hex":"#f5f5dc","name":"Angora"},{"hex":"#ffc0cb","name":"Pink"},{"hex":"#ffffff","name":"White"}], images: [IMG.creamHoodie, IMG.greyHoodie], stock: 45, featured: false },
  { brand_id: B.nb, name: "New Balance 327 'Sea Salt'", description: "Retro runner silhouette with wavy outsole and vintage track inspiration.", price: 100, category: "Women", sizes: ["5","6","7","8","9","10"], colors: [{"hex":"#f5f5dc","name":"Sea Salt"},{"hex":"#ff69b4","name":"Pink"}], images: [IMG.nikeWomenShoe, IMG.adidasWhite], stock: 38, featured: true },
  { brand_id: B.nb, name: "NB Numeric Skate Tee", description: "100% cotton tee with tonal NB logo — the skate division's daily staple.", price: 35, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}], images: [IMG.whiteTee, IMG.graphicTee], stock: 80, featured: false },

  // ── Stone Island ──────────────────────────────────────────────────────────
  { brand_id: B.stoneIsland, name: "Garment Dyed Crewneck Sweatshirt", description: "Enzyme-washed cotton fleece with hand-stitched Compass Rose badge — each piece unique.", price: 295, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#8b7355","name":"Tobacco"},{"hex":"#000000","name":"Black"},{"hex":"#228b22","name":"Military Green"}], images: [IMG.modelHoodie, IMG.vintageHoodie], stock: 20, featured: true },
  { brand_id: B.stoneIsland, name: "Nylon Metal Overshirt", description: "Metallic nylon with ripstop weave and tonal compass badge. Function meets sculpture.", price: 425, category: "Men", sizes: ["S","M","L","XL"], colors: [{"hex":"#c0c0c0","name":"Silver"},{"hex":"#000000","name":"Black"}], images: [IMG.bomberJacket, IMG.runningJacket], stock: 12, featured: true },
  { brand_id: B.stoneIsland, name: "Compass Patch Tee", description: "Heavy jersey tee with detachable badge — signature Stone Island detail.", price: 125, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#228b22","name":"Military"}], images: [IMG.fashionTee, IMG.whiteTee], stock: 35, featured: false },
  { brand_id: B.stoneIsland, name: "Ghost Piece Down Jacket", description: "Tonal treatment with hidden badge — the garment that defined quiet luxury in streetwear.", price: 895, compare_price: 1095, category: "Men", sizes: ["S","M","L","XL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}], images: [IMG.bomberJacket, IMG.runningJacket], stock: 8, featured: true },
  { brand_id: B.stoneIsland, name: "Micro Reps Shorts", description: "Ripstop nylon with stretch panels and compass badge at hem.", price: 195, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#808080","name":"Grey"},{"hex":"#000080","name":"Navy"},{"hex":"#000000","name":"Black"}], images: [IMG.sweatpants, IMG.casualPants], stock: 25, featured: false },
  { brand_id: B.stoneIsland, name: "Nylon Twill Cap", description: "Six-panel structured cap with woven Compass Rose badge and tonal stitching.", price: 130, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#8b7355","name":"Tobacco"},{"hex":"#000080","name":"Navy"}], images: [IMG.flatBrimCap, IMG.snapback], stock: 40, featured: false },

  // ── Stüssy ────────────────────────────────────────────────────────────────
  { brand_id: B.stussy, name: "Stock Logo Hoodie", description: "Heavyweight fleece with the OG Stüssy hand-drawn logo — the one that started the whole movement.", price: 110, compare_price: 130, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"},{"hex":"#ffffff","name":"Natural"}], images: [IMG.darkHoodie, IMG.greyHoodie], stock: 50, featured: true },
  { brand_id: B.stussy, name: "8 Ball Fleece Crewneck", description: "Pigment-dyed crewneck with 8 Ball print on chest and spine — a Stüssy archive piece.", price: 120, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#808080","name":"Pigment Grey"},{"hex":"#000000","name":"Black"}], images: [IMG.modelHoodie, IMG.vintageHoodie], stock: 35, featured: true },
  { brand_id: B.stussy, name: "Surfman Zip Jacket", description: "Nylon shell zip jacket with Stüssy embroidery and a single chest pocket.", price: 180, category: "Men", sizes: ["S","M","L","XL"], colors: [{"hex":"#000080","name":"Navy"},{"hex":"#000000","name":"Black"}], images: [IMG.bomberJacket, IMG.zipHoodie], stock: 22, featured: false },
  { brand_id: B.stussy, name: "Stock Logo Tee", description: "Pre-shrunk cotton tee with vintage Stüssy logo — the entry point to the brand.", price: 45, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}], images: [IMG.whiteTee, IMG.graphicTee], stock: 100, featured: false },
  { brand_id: B.stussy, name: "Stussy Stock Cap", description: "Structured 6-panel cap with woven logo badge. The essential streetwear lid.", price: 40, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"Natural"},{"hex":"#ff0000","name":"Red"}], images: [IMG.snapback, IMG.whiteCap], stock: 80, featured: false },
  { brand_id: B.stussy, name: "Basic Sport Short", description: "Mesh shorts with drawstring waist and embroidered logo.", price: 65, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"},{"hex":"#000080","name":"Navy"}], images: [IMG.sweatpants, IMG.casualPants], stock: 55, featured: false },
  { brand_id: B.stussy, name: "Paisley Bandana Tee", description: "All-over paisley print tee with Stüssy signature on chest.", price: 60, category: "Women", sizes: ["XS","S","M","L","XL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}], images: [IMG.fashionTee, IMG.graphicTee], stock: 40, featured: true },

  // ── Carhartt WIP ──────────────────────────────────────────────────────────
  { brand_id: B.carhartt, name: "Chase Hoodie", description: "Heavy sweat with gold heart logo. The most recognisable pullover in European streetwear.", price: 115, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey Heather"},{"hex":"#f5f5dc","name":"Wax"}], images: [IMG.darkHoodie, IMG.modelHoodie], stock: 55, featured: true },
  { brand_id: B.carhartt, name: "Active Jacket", description: "Durable cotton canvas with a zip-front and Carhartt WIP script label. The OG workwear jacket.", price: 200, compare_price: 240, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#8b7355","name":"Hamilton Brown"},{"hex":"#000000","name":"Black"},{"hex":"#000080","name":"Navy"}], images: [IMG.runningJacket, IMG.bomberJacket], stock: 30, featured: true },
  { brand_id: B.carhartt, name: "Pocket Tee", description: "Single-jersey tee with small WIP chest pocket. The blueprint for the perfect basics.", price: 40, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#f5f5dc","name":"Wax"},{"hex":"#808080","name":"Grey"}], images: [IMG.whiteTee, IMG.blackTee], stock: 120, featured: false },
  { brand_id: B.carhartt, name: "Simple Pant", description: "Straight-cut ripstop pant with Carhartt WIP patch. Work utility meets street style.", price: 115, category: "Men", sizes: ["28","29","30","31","32","33","34"], colors: [{"hex":"#8b7355","name":"Tanami"},{"hex":"#000000","name":"Black"},{"hex":"#000080","name":"Navy"}], images: [IMG.casualPants, IMG.darkJeans], stock: 35, featured: false },
  { brand_id: B.carhartt, name: "Military Snapback", description: "6-panel twill cap with WIP patch. Clean silhouette, adjustable fit.", price: 35, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#228b22","name":"Rover Green"},{"hex":"#000000","name":"Black"},{"hex":"#8b7355","name":"Tanami"}], images: [IMG.snapback, IMG.flatBrimCap], stock: 70, featured: false },
  { brand_id: B.carhartt, name: "Chase Sweat Shorts", description: "Heavy fleece shorts with elastic waist and gold heart logo at thigh.", price: 70, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey Heather"}], images: [IMG.sweatpants, IMG.casualPants], stock: 45, featured: false },
  { brand_id: B.carhartt, name: "WIP Tote Bag", description: "Heavy canvas tote with WIP logo print — the bag that goes everywhere.", price: 25, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#f5f5dc","name":"Wax"},{"hex":"#000000","name":"Black"}], images: [IMG.backpack, IMG.luxBag], stock: 150, featured: false },

  // ── Supreme ───────────────────────────────────────────────────────────────
  { brand_id: B.supreme, name: "Box Logo Hooded Sweatshirt", description: "The most coveted hoodie in streetwear history. Heavyweight cotton, embroidered box logo.", price: 168, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ff0000","name":"Red"},{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}], images: [IMG.darkHoodie, IMG.modelHoodie], stock: 10, featured: true },
  { brand_id: B.supreme, name: "Arc Logo Crewneck", description: "Fleece crewneck with arched Supreme wordmark. Dropped once a season. Never enough.", price: 158, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#000080","name":"Navy"},{"hex":"#808080","name":"Heather Grey"},{"hex":"#000000","name":"Black"}], images: [IMG.modelHoodie, IMG.greyHoodie], stock: 15, featured: true },
  { brand_id: B.supreme, name: "Small Box Logo Tee", description: "The cornerstone of any Supreme collection. 100% cotton, embroidered box logo at chest.", price: 54, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"},{"hex":"#000080","name":"Navy"}], images: [IMG.whiteTee, IMG.graphicTee], stock: 25, featured: true },
  { brand_id: B.supreme, name: "Denim Trucker Jacket", description: "Rigid selvedge denim trucker with Supreme woven label. Stiffens beautifully with wear.", price: 228, category: "Men", sizes: ["S","M","L","XL"], colors: [{"hex":"#000080","name":"Washed Indigo"},{"hex":"#000000","name":"Black"}], images: [IMG.bomberJacket, IMG.zipHoodie], stock: 12, featured: true },
  { brand_id: B.supreme, name: "5-Panel Camp Cap", description: "Unstructured 5-panel in twill with embroidered logo. The streetwear cap formula.", price: 48, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#ff0000","name":"Red"},{"hex":"#000000","name":"Black"},{"hex":"#f5f5dc","name":"Natural"}], images: [IMG.whiteCap, IMG.flatBrimCap], stock: 30, featured: false },
  { brand_id: B.supreme, name: "Mesh Back Trucker Cap", description: "Foam front, mesh back, embroidered logo — one of the most imitated caps ever made.", price: 44, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#ff0000","name":"Red/White"},{"hex":"#000000","name":"Black"}], images: [IMG.snapback, IMG.whiteCap], stock: 35, featured: false },
  { brand_id: B.supreme, name: "Box Logo Crewneck Socks", description: "Terry cotton blend crew socks with Supreme jacquard knit. Three-pack.", price: 28, category: "Accessories", sizes: ["One Size"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}], images: [IMG.crewSocks], stock: 100, featured: false },
  { brand_id: B.supreme, name: "Cargo Pant", description: "Cotton ripstop cargo pant with flap pockets and embroidered signature waistband label.", price: 178, category: "Men", sizes: ["28","29","30","31","32","33","34"], colors: [{"hex":"#8b7355","name":"Khaki"},{"hex":"#000000","name":"Black"},{"hex":"#000080","name":"Navy"}], images: [IMG.casualPants, IMG.darkJeans], stock: 18, featured: false },

  // ── More Nike drops ───────────────────────────────────────────────────────
  { brand_id: B.nike, name: "Air Max 270 React", description: "270-unit heel Air bag meets React foam for all-day cushioning.", price: 159.99, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff8c00","name":"Orange"}], images: [IMG.nikeMultiple, IMG.nikeAirMax90], stock: 35, featured: false },
  { brand_id: B.nike, name: "Blazer Mid '77 Vintage", description: "Vintage-inspired basketball shoe with retro Nike branding.", price: 109.99, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#a0522d","name":"Brown"}], images: [IMG.nikeAF1, IMG.nikeWomenShoe], stock: 40, featured: false },
  { brand_id: B.nike, name: "Club Fleece Crew", description: "Classic fleece crewneck with embroidered Swoosh. The OG Nike essential.", price: 65, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#808080","name":"Dark Grey Heather"},{"hex":"#000000","name":"Black"}], images: [IMG.greyHoodie, IMG.creamHoodie], stock: 60, featured: false },
  { brand_id: B.nike, name: "Air Max 1 SC", description: "The original Air Max with Heritage mesh upper and waffle outsole.", price: 139.99, category: "Women", sizes: ["5","6","7","8","9","10"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#c41e3a","name":"Red Crush"}], images: [IMG.nikeWomenShoe, IMG.nikeAF1], stock: 28, featured: true },

  // ── More Adidas drops ─────────────────────────────────────────────────────
  { brand_id: B.adidas, name: "Samba OG 'White Black'", description: "Indoor soccer legend turned streetwear obsession. Suede overlays, gum outsole.", price: 100, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}], images: [IMG.adidasWhite, IMG.adidasForum], stock: 30, featured: true },
  { brand_id: B.adidas, name: "Campus 00s", description: "Campus silhouette updated with contrast stitching and suede overlays.", price: 110, category: "Women", sizes: ["5","6","7","8","9","10"], colors: [{"hex":"#f5f5dc","name":"Off White"},{"hex":"#808080","name":"Grey"}], images: [IMG.adidasColorful, IMG.nikeWomenShoe], stock: 38, featured: true },
  { brand_id: B.adidas, name: "Spezial Handball", description: "The handball trainer with SPZL branding — originals perfected.", price: 120, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#8b4513","name":"Brown"},{"hex":"#ffffff","name":"White"}], images: [IMG.adidasOnFoot, IMG.nbClassic], stock: 22, featured: false },
  { brand_id: B.adidas, name: "Trefoil Logo Crewneck", description: "Fitted French terry crewneck with raised Trefoil logo — archive Adicolor.", price: 80, category: "Women", sizes: ["XS","S","M","L","XL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"},{"hex":"#ff69b4","name":"Pink"}], images: [IMG.creamHoodie, IMG.greyHoodie], stock: 50, featured: false },

  // ── More Off-White ────────────────────────────────────────────────────────
  { brand_id: B.offWhite, name: "Varsity Jacket", description: "Wool varsity with leather sleeves and Off-White diagonal stripe — a statement piece.", price: 1295, category: "Men", sizes: ["S","M","L","XL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}], images: [IMG.bomberJacket, IMG.runningJacket], stock: 6, featured: true },
  { brand_id: B.offWhite, name: "Quote Tee 'for Walking'", description: "Quote print tee with Abloh's signature Helvetica text — wearable conceptual art.", price: 295, category: "Women", sizes: ["XS","S","M","L","XL"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}], images: [IMG.fashionTee, IMG.graphicTee], stock: 20, featured: false },
  { brand_id: B.offWhite, name: "Zip Tie Sneaker", description: "Arrow detail, zip-tie lace jewel, and Off-White text on the midsole.", price: 745, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#ffff00","name":"Yellow"}], images: [IMG.offCourtSneak, IMG.jordanLow], stock: 8, featured: true },

  // ── More Balenciaga ───────────────────────────────────────────────────────
  { brand_id: B.balenciaga, name: "Track 2 Sneaker", description: "Multi-panel panelled runner with layered mesh and rubber components.", price: 895, category: "Men", sizes: ["7","8","9","10","11","12","13"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"},{"hex":"#ffffff","name":"White"}], images: [IMG.chunkySneaker, IMG.sneakerOverhead], stock: 10, featured: true },
  { brand_id: B.balenciaga, name: "Defender Sneaker", description: "Chunky hiking-inspired sole with asymmetric lace placement.", price: 1050, category: "Men", sizes: ["7","8","9","10","11","12"], colors: [{"hex":"#ffffff","name":"White"},{"hex":"#808080","name":"Grey"}], images: [IMG.sneakerOverhead, IMG.chunkySneaker], stock: 8, featured: false },
  { brand_id: B.balenciaga, name: "Oversized Hoodie", description: "Fully oversized pullover with Balenciaga embroidered logo — comfort as statement.", price: 795, category: "Men", sizes: ["XS","S","M","L","XL"], colors: [{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}], images: [IMG.darkHoodie, IMG.modelHoodie], stock: 12, featured: false },

  // ── More Fear of God ─────────────────────────────────────────────────────
  { brand_id: B.fog, name: "Essentials Shorts", description: "Heavyweight fleece shorts with Fear of God branding at waistband.", price: 75, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#f5f5dc","name":"Cream"},{"hex":"#808080","name":"Light Heather Grey"},{"hex":"#000000","name":"Black"}], images: [IMG.sweatpants, IMG.casualPants], stock: 70, featured: false },
  { brand_id: B.fog, name: "Vintage Crewneck", description: "Garment-dyed sweatshirt with rubber patch logo and distressed feel.", price: 195, compare_price: 225, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: [{"hex":"#8b7355","name":"Camel"},{"hex":"#808080","name":"Vintage Grey"}], images: [IMG.vintageHoodie, IMG.creamHoodie], stock: 25, featured: true },
]

// ─── Main execution ───────────────────────────────────────────────────────────
async function run() {
  console.log("🏁 DRIP Mega Seed starting…\n")

  // 1. Upsert new brands
  console.log("① Upserting new brands…")
  const { error: brandErr } = await supabase
    .from("brands")
    .upsert(NEW_BRANDS, { onConflict: "id" })
  if (brandErr) { console.error("Brand error:", brandErr.message); return }
  console.log(`   ✓ ${NEW_BRANDS.length} brands upserted\n`)

  // 2. Update images for all existing products
  console.log("② Updating existing product images…")
  let updateCount = 0
  for (const u of IMAGE_UPDATES) {
    const { error } = await supabase
      .from("products")
      .update({ images: u.images })
      .eq("brand_id", u.brand_id)
      .eq("name", u.name)
    if (error) {
      console.warn(`   ⚠ Could not update "${u.name}": ${error.message}`)
    } else {
      updateCount++
    }
  }
  console.log(`   ✓ ${updateCount}/${IMAGE_UPDATES.length} products updated\n`)

  // 3. Insert new products
  console.log("③ Inserting new products…")
  const chunkSize = 10
  let inserted = 0
  for (let i = 0; i < NEW_PRODUCTS.length; i += chunkSize) {
    const chunk = NEW_PRODUCTS.slice(i, i + chunkSize)
    const { error } = await supabase.from("products").insert(chunk)
    if (error) {
      console.error(`   ✗ Chunk ${i/chunkSize+1} failed: ${error.message}`)
    } else {
      inserted += chunk.length
      process.stdout.write(`   ✓ ${inserted}/${NEW_PRODUCTS.length} inserted\r`)
    }
  }
  console.log(`\n   ✓ ${inserted} new products inserted\n`)

  // 4. Summary
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: brandCount } = await supabase.from("brands").select("*", { count: "exact", head: true })
  console.log("━".repeat(50))
  console.log(`✅ Done! Brands: ${brandCount} | Products: ${count}`)
  console.log("━".repeat(50))
}

run().catch(console.error)
