import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

/**
 * Email API routes: allow server-to-server calls with x-internal-secret,
 * or authenticated admin sessions.
 */
export async function assertEmailApiAuthorized(
  request: NextRequest
): Promise<NextResponse | null> {
  const secret = process.env.INTERNAL_API_SECRET
  const header = request.headers.get("x-internal-secret")

  if (secret && header === secret) {
    return null
  }

  const supabase = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return null
}

/** Headers for server-side fetch to /api/emails/* (webhooks, ship route). */
export function buildInternalEmailHeaders(): Record<string, string> | null {
  const secret = process.env.INTERNAL_API_SECRET
  if (!secret) return null
  return {
    "Content-Type": "application/json",
    "x-internal-secret": secret,
  }
}
