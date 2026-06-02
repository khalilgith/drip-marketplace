import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // Verify the caller is an authenticated admin
  const authClient = createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Delete with service role to bypass RLS
  const supabase = createServiceClient()
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
