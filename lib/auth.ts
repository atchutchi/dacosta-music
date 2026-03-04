import { SupabaseClient } from "@supabase/supabase-js"

type AdminCheckResult =
  | { authorized: true; userId: string }
  | { authorized: false; status: 401 | 403; message: string }

export async function requireAdmin(
  supabase: SupabaseClient
): Promise<AdminCheckResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { authorized: false, status: 401, message: "Unauthorized" }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden" }
  }

  return { authorized: true, userId: user.id }
}
