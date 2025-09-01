import Button from "@/app/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import React, { ReactNode } from "react"

type Props = {
  date: string,
  butecoId: string,
  name: string,
  checkIns?: {
    createdAt: string,
    participants: {
      user: {
        id: string,
        name: string,
        image: string,
      }
    }[]
  }[],
  editAction?:  () => void,
  deleteAction?: () => void,   
}

export default function CalendarCard({ date, butecoId, name, checkIns = [], editAction, deleteAction }: Props) {
  const dateObj = new Date(date)
  const day = dateObj.toLocaleString("pt-BR", { day: "numeric" })
  const month = dateObj.toLocaleString("pt-BR", { month: "long" })

  return (
    <div className="flex flex-row border rounded-lg shadow-md bg-session">
      {/* Coluna com a data */}
      <div className="flex flex-col justify-center items-center min-w-32 leading-8 border-r py-4">
        <p className="text-6xl font-bold mb-1">{day}</p>
        <p className="font-semibold uppercase tracking-wider">{month}</p>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col w-full p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-semibold">{name}</h5>

        {checkIns.length > 0 && (
          <div className="flex flex-col gap-2 pt-2">
            <p className="text-xs text-muted">Quem foi?</p>
            <div className="flex -space-x-2">
              {checkIns.flatMap((c) =>
                c.participants.map((p) => (
                  <div
                    key={p.user.id}
                    className="h-7 w-7 rounded-full border border-white overflow-hidden bg-gray-200"
                  >
                    <Image
                      src={p.user.image || "/profile-avatar.png"}
                      alt={p.user.name || "Participante"}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-auto">
          {editAction && (
            <Button variant="outline" size="icon" onClick={editAction}>
              <Pencil className="h-5 w-5" />
            </Button>
          )}
          {deleteAction && (
            <Button variant="outline" size="icon" onClick={deleteAction}>
              <Trash2 className="h-5 w-5 text-red-600" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
