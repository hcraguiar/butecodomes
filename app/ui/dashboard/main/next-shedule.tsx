import { Scheduled } from "@/app/lib/types"
import Button from "@/app/ui/button"
import { ExternalLink, Link2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type Props = {
  scheduled: Scheduled[]
}

export default function NextSchedule({ scheduled }: Props) {
  if (!scheduled || scheduled.length === 0) {
    return (
      <div className="bg-session rounded-2xl shadow p-4 h-full">
        <h2 className="text-lg font-semibold mb-4">Próximo encontro</h2>
        <p className="text-sm text-muted">Nada agendado.</p>
      </div>
    )
  }

  const data = scheduled[0]
  const date = new Date(data.date)
  const day = date.toLocaleString("pt-BR", { day: 'numeric' })
  const month = date.toLocaleString("pt-BR", { month: 'long' })

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  if (date < startOfDay) return

  const backgroundImageUrl = data.buteco?.image_url ?? '/bar-image.png'
  
  return (
    <div className="bg-session rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Próximo encontro</h2>
      <div className="relative w-full rounded-lg overflow-hidden border shadow-md h-36 text-white">
        {backgroundImageUrl && (
          <Image 
            src={backgroundImageUrl}
            alt='Imagem do bar'
            fill
            priority
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="absolute flex flex-row w-full z-50">
          {/* Coluna data */}
          <div className="flex flex-col justify-center items-center h-36 min-w-32 leading-8 py-4 z-10">
            <p className="text-4xl font-bold mb-1">{day}</p>
            <p className="font-semibold uppercase tracking-wider">{month}</p>
          </div>
          {/* Conteúdo */}
          <div className="flex flex-col w-full p-4 leading-normal">
            <h5 className="text-2xl font-semibold mb-2">
              { data.buteco ? data.buteco.name : "Buteco não escolhido" }
            </h5>
            { data.buteco && (
              <div className="flex justify-end space-x-2 mt-auto">
                <Link href={`/dashboard/butecos?q=${data.buteco.name}`}>
                  <Button variant="accent" size="sm" className="flex items-center">
                    Ver <ExternalLink className="ml-4 h-5 w-5" />
                  </Button>
                </Link>
                
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
