"use client"

import { Scheduled, Suggested, Visited } from "@/app/lib/types"
import { useEffect, useRef, useState } from "react"
import CalendarCard from "./components/CalendarCard"
import Image from "next/image"
import { useModal } from "@/app/context/modal-context"
import CalendarForm from "./components/CalendarForm"
import Button from "@/app/ui/button"
import toast from "react-hot-toast"

export default function Page() {
  const [scheduled, setScheduled] = useState<Scheduled[]>([])
  const [suggested, setSuggested] = useState<Suggested[]>([])
  const [visited, setVisited] = useState<Visited[]>([])

  const [loading, setLoading] = useState(true)

  const { setModalOpen, setModalContent }  = useModal()

  // paginação de visitados
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingVisited, setLoadingVisited] = useState(false)
  
  const loader = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchCalendar()
  }, [])

  // primeira carga de visitados
  useEffect(() => {
    fetchVisited(1)
  }, [])

  type dataFormProps = {
    id: string,
    date: string,
    butecoId: string
  }

  const openCalendarForm = (
    data?: dataFormProps
  ) => {
    const select: Suggested[] = scheduled
    .map(item => {
      if (!item.buteco) {
        return undefined
      }

      return (
        {
          id: item.buteco.id,
          name: item.buteco.name,
          logo_url: item.buteco.logo_url,
          image_url: item.buteco.image_url,
        }
      )
    })
    .filter((item): item is Suggested => item !== undefined)

    if (!data) {
      setModalContent({
        title: 'Agendamento',
        content: (
          <CalendarForm select={[...suggested, ...select]} 
            onDone={() => {
              setModalOpen(false)
              fetchCalendar()
            }}
          />
        )
      })
    } else {
      setModalContent({
        title: 'Editar agendamento',
        content: (
          <CalendarForm 
            select={[...suggested, ...select]} 
            data={data}
            onDone={() => {
              setModalOpen(false)
              fetchCalendar()
            }}
          />
        )
      })
    }
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await toast.promise(
      fetch("/api/calendar", {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ id }) 
      }).then(async (res) => {
        if (!res.ok) throw new Error('Erro ao apagar agendamento')
        fetchCalendar()
      }),
      {
        loading: 'Apagando...',
        success: 'Agendamento apagado.',
        error: 'Erro ao apagar agendamento.'
      }
    )
  }

  const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/calendar")
        const data = await res.json()
        setScheduled(data.scheduled ?? [])
        setSuggested(data.suggested ?? [])
      } catch (error) {
        console.error("Erro ao buscar agenda", error)
      } finally {
        setLoading(false)
      }
    }

  const fetchVisited = async (pageNumber: number) => {
    setLoadingVisited(true)
    try {
      const res = await fetch(`/api/calendar/visited?page=${pageNumber}&limit=6`)
      const data = await res.json()

      if (!data.visited || data.visited.length === 0) {
        setHasMore(false)
        return
      }

      if (pageNumber === 1) {
        setVisited(data.visited)
      } else {
        setVisited((prev) => [...prev, ...data.visited])
      }

      setPage(pageNumber + 1)
    } catch (error) {
      console.error("Erro ao buscar visitados", error)
    } finally {
      setLoadingVisited(false)
    }
  }

  // scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingVisited) {
          fetchVisited(page)
        } 
      },
      { threshold: 1.0 }
    )
    if (loader.current) observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [hasMore, loadingVisited])

  if (loading) return <p className="p-4">Carregando...</p>

  return (
    <div className="p-6 space-y-8">
      {/* Próximos encontros */}
      <section>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => openCalendarForm()} className="mb-4">Agendar</Button>
        </div>
        <h2 className="text-xl font-semibold mb-4">📅 Próximos encontros</h2>
        {scheduled.length === 0 ? (
          <p className="text-muted">Nada agendado</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduled.map((item) => {
              const data = {
                id: item.id,
                date: item.date,
                butecoId: item.buteco ? item.buteco.id : "",
              }
              return(
              <CalendarCard
                key={item.id + item.date}
                date={item.date}
                butecoId={item.buteco ? item.buteco.id : ""}
                name={item.buteco ? item.buteco.name : "Buteco não escolhido"}
                editAction={() => openCalendarForm(data)}
                deleteAction={() => handleDelete(item.id)}
              />
            )})}
          </div>
        )}
      </section>

      {/* Butecos Sugeridos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">💡 Butecos sugeridos</h2>
        {suggested.length === 0 ? (
          <p className="text-muted">Nada de novo por aqui.</p>
        ) : (
          <div className="flex flex-row space-x-3 md:space-x-6 overflow-x-auto whitespace-nowrap">
            {suggested.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className="flex-shrink-0 w-24 h-24 md:h-[150px] md:w-[150px] bg-secondary/20 rounded-full">
                  <Image src={s.logo_url} alt="logo bar" width={200} height={200} />
                </div>
                <span className="text-foreground-heading mt-2">{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Butecos visitados */}
      <section>
        <h2 className="text-xl font-semibold mb-4">✅ Butecos visitados</h2>
        {visited.length === 0 ? (
          <p className="text-muted">Ainda não há butecos visitados.</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {visited
              .filter((v) => v.checkIn[0]?.createdAt)
              .map((v) => (
                <CalendarCard
                  key={v.id}
                  date={v.checkIn[0]?.createdAt}
                  butecoId={v.id}
                  name={v.name}
                  checkIns={v.checkIn}
                />
              ))}
          </div>
        )}
        {loadingVisited && <p className="p-2 text-center">Carregando mais...</p>}
        {!hasMore && visited.length > 0 && (
          <p className="p-2 text-center text-muted">Fim da lista 🎉</p>
        )}

        <div ref={loader} />
      </section>
    </div>
  )
}
