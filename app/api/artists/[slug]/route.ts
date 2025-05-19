import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/app-server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { slug } = params

  const { data, error } = await supabase.from("artists").select("*").eq("slug", slug).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { slug } = params
  const data = await request.json()

  const { data: artist, error } = await supabase.from("artists").update(data).eq("slug", slug).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(artist)
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { slug } = params

  const { error } = await supabase.from("artists").delete().eq("slug", slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
