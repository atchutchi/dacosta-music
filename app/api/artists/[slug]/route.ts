import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()
  const { slug } = await params

  const { data, error } = await supabase.from("artists").select("*").eq("slug", slug).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()

  const auth = await requireAdmin(supabase)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { slug } = await params
  const data = await request.json()

  // @ts-ignore - TypeScript type narrowing issue with Supabase client
  const { data: artist, error } = await supabase.from("artists").update(data).eq("slug", slug).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(artist)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()

  const auth = await requireAdmin(supabase)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { slug } = await params

  const { error } = await supabase.from("artists").delete().eq("slug", slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
