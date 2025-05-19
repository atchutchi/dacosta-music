import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/app-server"

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("artists").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const data = await request.json()

  const { data: artist, error } = await supabase.from("artists").insert([data]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(artist)
}
