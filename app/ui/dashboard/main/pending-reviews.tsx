import { formatDateToLocal } from "@/app/lib/utils"
import Button from "../../button"

type PendingReview = {
  createdAt: string
  checkInId: string
  checkIn: {
    buteco: {
      id: string
      name: string
      logo_url: string
    }
  }
}

type Props = {
  pendentes: PendingReview[]
  action: (butecoId: string, checkInId: string) => void
}

export default function PendingReviews({ pendentes, action }: Props) {
  if (!pendentes || pendentes.length === 0) {
    return (
      <div className="p-4 border rounded-x1 text-muted dark:text-dark-muted">
        Nenhuma avaliação pendente.
      </div>
    )
  }
  
  return (
    <div className="bg-session dark:bg-dark-session rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Avaliações Pendentes</h2>
      <ul className="space-y-3">
        {pendentes.map((p, i) => {
          const buteco = p.checkIn.buteco
          const checkInId = p.checkInId
          console.log('[DEBUG] Map Pendings:', buteco)

          return (
            <li key={i} className="flex items-center gap-4">
              <img src={buteco.logo_url} className="w-10 h-10 rounded" />
              <div className="flex-1">
                <p className="text-sm">
                  <strong>{buteco.name}</strong>
                </p>
                <p className="text-xs">Check-in em {formatDateToLocal(p.createdAt)}</p>
              </div>
              <Button size="sm" onClick={() => action(buteco.id, checkInId)}>Avaliar</Button>
            </li>
          )
        })}
      </ul>
    </div>
      
  )
}
