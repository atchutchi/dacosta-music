import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/app-server"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Ticket } from "lucide-react"
import Link from "next/link"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params
  const supabase = createServerClient()

  // Buscar evento pelo ID
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      event_artists!inner (
        artists:artist_id (
          id,
          name,
          slug,
          logo_url,
          photo_url
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Formatar data
  const startDate = new Date(event.start_date)
  const formattedDate = startDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const formattedTime = startDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/events" className="text-primary hover:underline">
          ← Voltar para Eventos
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Imagem do evento */}
        <div className="overflow-hidden rounded-lg bg-gray-100">
          {event.image_url ? (
            <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gray-200">
              <Calendar className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Detalhes do evento */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
          </div>

          {event.description && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold">Sobre o evento</h2>
              <p>{event.description}</p>
            </div>
          )}

          {event.ticket_url && (
            <div>
              <Button asChild className="w-full">
                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                  <Ticket className="mr-2 h-4 w-4" />
                  Comprar Ingressos
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Artistas */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Artistas</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {event.event_artists.map(({ artists }) => (
            <Link
              key={artists.id}
              href={`/artists/${artists.slug}`}
              className="group overflow-hidden rounded-lg border transition-all hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                {artists.photo_url ? (
                  <img
                    src={artists.photo_url || "/placeholder.svg"}
                    alt={artists.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    {artists.logo_url ? (
                      <img
                        src={artists.logo_url || "/placeholder.svg"}
                        alt={artists.name}
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">{artists.name.charAt(0)}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium">{artists.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
