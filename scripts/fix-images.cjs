const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  "https://nyklrrynqyrbtdletkos.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a2xycnlucXlyYnRkbGV0a29zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA5OTk1MSwiZXhwIjoyMDk0Njc1OTUxfQ.XsxgTdD1EfN3PH7K5T8ls3PKuGKZGLTOKXatGI8Dpc0"
)

// Verified URLs organized by product type – each gets a photo that matches
const productImages = {
  // Nike sneakers
  "Air Max 90": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Air Force 1": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Dunk Low Retro": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Pegasus Trail 4": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Air Zoom Vapor": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
  "Air Force 1 Sage Low": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  // Nike clothing
  "Tech Fleece Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  "Windrunner Jacket": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  "Dri-FIT Training Tee": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  "Classic Crew Socks": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
  // Adidas sneakers
  "Ultraboost 23": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  "Superstar": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Forum Low": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
  "Runfalcon 3.0": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Gazelle Indoor": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  // Adidas clothing
  "3-Stripes Tee": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  "Adicolor Classic Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  "Adilette Slides": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80",
  // Off-White
  "Arrows Hoodie": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  "Diagonal Zip Hoodie": "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80",
  "Off-Court Sneakers": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Industrial Belt": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  "Caravaggio Tee": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  "Out Of Office Sneakers": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  // Fear of God
  "Essentials Hoodie": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  "Essentials Jogger": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  "Essentials Tee": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
  "California Bomber": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  "Eternal Denim": "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80",
  // Balenciaga
  "Speed Trainer": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Triple S Sneaker": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  "Hourglass Sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "Logo T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  "City Bag": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name")

  if (error) {
    console.error("Failed:", error.message)
    return
  }

  console.log(`Checking ${products.length} products...`)

  let updated = 0
  for (const product of products) {
    const url = productImages[product.name]
    if (!url) {
      console.log("  ⚠ No mapping for:", product.name)
      continue
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ images: [url] })
      .eq("id", product.id)

    if (updateError) {
      console.error("  ✗", product.name, updateError.message)
    } else {
      updated++
      console.log("  ✓", product.name)
    }
  }

  console.log(`Done! Updated ${updated} products.`)
}

main().catch(console.error)
