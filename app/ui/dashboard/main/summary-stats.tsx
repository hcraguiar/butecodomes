'use client'

import { Star, CalendarCheck, House } from 'lucide-react'

type Props = {
  totalReviews: number
  totalCheckIns: number
  totalVisited: number
}

export default function SummaryStats({ totalReviews, totalCheckIns, totalVisited }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="col-span-2 sm:col-span-1 bg-session dark:bg-dark-session shadow rounded-2xl p-4 flex items-center gap-4">
        <Star className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-sm">Total de Avaliações</p>
          <p className="text-xl font-bold">{totalReviews}</p>
        </div>
      </div>
      <div className="bg-session dark:bg-dark-session shadow rounded-2xl p-4 flex items-center gap-4">
        <CalendarCheck className="w-8 h-8 text-green-600" />
        <div>
          <p className="text-sm">Check-ins Realizados</p>
          <p className="text-xl font-bold">{totalCheckIns}</p>
        </div>
      </div>
      <div className="bg-session dark:bg-dark-session shadow rounded-2xl p-4 flex items-center gap-4">
        <House className="w-8 h-8 text-green-600" />
        <div>
          <p className="text-sm">Butecos Visitados</p>
          <p className="text-xl font-bold">{totalVisited}</p>
        </div>
      </div>
    </div>
  )
}
