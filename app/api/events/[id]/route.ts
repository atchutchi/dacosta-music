import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/app-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { id } = params

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      event_artists (
        artists:artist_id (
          id,
          name,
          slug
        )
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { id } = params
  const data = await request.json()

  // Extrair artistas antes de atualizar o evento
  const { artists, ...eventData } = data

  // Atualizar evento
  const { data: event, error } = await supabase.from("events").update(eventData).eq("id", id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Se houver artistas, atualizar relacionamentos
  if (artists && Array.isArray(artists)) {
    // Primeiro, remover relacionamentos existentes
    const { error: deleteError } = await supabase.from("event_artists").delete().eq("event_id", id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Depois, inserir novos relacionamentos
    if (artists.length > 0) {
      const eventArtists = artists.map((artistId: string) => ({
        event_id: id,
        artist_id: artistId,
      }))

      const { error: insertError } = await supabase.from("event_artists").insert(eventArtists)

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }
  }

  return NextResponse.json(event)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { id } = params

  // Primeiro, remover relacionamentos
  const { error: relationError } = await supabase.from("event_artists").delete().eq("event_id", id)

  if (relationError) {
    return NextResponse.json({ error: relationError.message }, { status: 500 })
  }

  // Depois, remover o evento
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
