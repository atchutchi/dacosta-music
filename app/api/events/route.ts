import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/app-server"

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("events").select("*").order("start_date")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const data = await request.json()

  // Inserir evento
  const { data: event, error } = await supabase.from("events").insert([data]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Se houver artistas associados, inserir na tabela de relacionamento
  if (data.artists && data.artists.length > 0 && event) {
    const eventArtists = data.artists.map((artistId: string) => ({
      event_id: event.id,
      artist_id: artistId,
    }))

    const { error: relationError } = await supabase.from("event_artists").insert(eventArtists)

    if (relationError) {
      return NextResponse.json({ error: relationError.message }, { status: 500 })
    }
  }

  return NextResponse.json(event)
}
