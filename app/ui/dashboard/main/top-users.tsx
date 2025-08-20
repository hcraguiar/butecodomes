'use client'

type Props = {
  users: {
    name: string | null
    image: string | null
    _count: { reviews: number }
  }[]
}

export default function TopUsers({ users }: Props) {
  return (
    <div className="bg-session rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Usuários Mais Ativos</h2>
      <ul className="space-y-3">
        {users.map((u, idx) => (
          <li key={idx} className="flex items-center gap-4">
            <span className="text-foreground text-lg w-6 text-center">{idx + 1}</span>
            <img src={u.image ?? 'profile-avatar.png'} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="text-sm">{u.name ?? 'Anônimo'}</p>
              <p className="text-xs">{u._count.reviews} avaliações</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
