import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const
type OrderStatus = (typeof VALID_STATUSES)[number]

function isValidStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value)
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { status } = body as { status?: unknown }

  if (!isValidStatus(status)) {
    return NextResponse.json(
      {
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 }
    )
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", params.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const { data, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
