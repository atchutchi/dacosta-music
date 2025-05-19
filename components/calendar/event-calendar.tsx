"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  start_date: string
  location: string
  image_url: string | null
  event_artists: {
    artists: {
      id: string
      name: string
      slug: string
      logo_url: string | null
    }
  }[]
}

export default function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async (year: number, month: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/events?year=${year}&month=${month}`)

      if (!res.ok) {
        throw new Error("Erro ao buscar eventos")
      }

      const data = await res.json()
      setEvents(data)
    } catch (err: any) {
      setError(err.message || "Erro ao buscar eventos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date) {
      fetchEvents(date.getFullYear(), date.getMonth() + 1)
    }
  }, [date])

  // Função para verificar se uma data tem eventos
  const hasEventOnDay = (day: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.start_date)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      )
    })
  }

  // Função para obter eventos de um dia específico
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      )
    })
  }

  // Função para formatar a data
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Navegar para o mês anterior
  const previousMonth = () => {
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() - 1)
      setDate(newDate)
    }
  }

  // Navegar para o próximo mês
  const nextMonth = () => {
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + 1)
      setDate(newDate)
    }
  }

  // Obter o nome do mês atual
  const getCurrentMonthName = () => {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  // Obter eventos do dia selecionado
  const selectedDayEvents = date ? getEventsForDay(date) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Calendário de Eventos</h2>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium">{getCurrentMonthName()}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvent: (day) => hasEventOnDay(day),
              }}
              modifiersClassNames={{
                hasEvent: "bg-primary text-primary-foreground font-bold",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{date ? <>Eventos em {date.toLocaleDateString("pt-BR")}</> : <>Selecione uma data</>}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500">Carregando eventos...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge>{formatEventDate(event.start_date)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{event.location}</p>

                    {event.event_artists.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Artistas:</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {event.event_artists.map(({ artists }) => (
                            <Badge key={artists.id} variant="outline">
                              {artists.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <Button asChild size="sm">
                        <Link href={`/events/${event.id}`}>Ver detalhes</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Nenhum evento nesta data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
