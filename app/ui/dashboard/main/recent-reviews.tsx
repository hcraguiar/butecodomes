'use client'

type Props = {
  reviews: {
    id: string
    rating: number
    createdAt: string
    user: { name: string | null; image: string | null }
    buteco: { name: string; logo_url: string }
  }[]
}

export default function RecentReviews({ reviews }: Props) {
  return (
    <div className="bg-session rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Últimas Avaliações</h2>
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="flex items-center gap-4">
            <img src={r.user.image ?? 'profile-avatar.png'} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {r.user.name} avaliou <strong>{r.buteco.name}</strong>
              </p>
              <p className="text-xs">Nota: {Number(r.rating).toFixed(2)}</p>
            </div>
            <img src={r.buteco.logo_url} className="w-10" />
          </li>
        ))}
      </ul>
    </div>
  )
}

