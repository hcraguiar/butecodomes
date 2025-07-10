import { MedalIcon } from "lucide-react"


type Props = {
  butecos: {
    id: string
    name: string
    logo_url: string
    rating: number
  }[]
}

export default function DashboardPodium({ butecos }: Props) {
  const medals = ['🥇', '🥈', '🥉'];


  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MedalIcon className="w-5 h-5" /> Top Butecos
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {butecos.map((buteco, idx) => (
          <div key={buteco.id} className="text-center">
            <div className="text-3xl">{medals[idx]}</div>
            <img src={buteco.logo_url} alt={buteco.name} className="h-16 mx-auto" />
            <div className="font-medium mt-2">{buteco.name}</div>
            <div className="text-sm">Nota: {Number(buteco.rating).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
