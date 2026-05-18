import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createServiceClient()

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "_")}`

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
