'use client'

import DashboardPodium from "./dashboard-podium";
import SummaryStats from "./summary-stats";
import TopUsers from "./top-users";
import RecentReviews from "./recent-reviews";
import PendingReviews from "./pending-reviews";
import { useEffect, useState } from "react";
import { DashboardData } from "@/app/lib/types";
import { useModal } from "@/app/context/modal-context";
import Image from "next/image";
import EvaluationForm from "../reviews/review-form";
import NextSchedule from "./next-shedule";

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false);
  const { setModalOpen, setModalContent } = useModal();

  const handleReview = async (butecoId: string, checkInId: string) => {
    try {
      const res = await fetch(`/api/butecos/${butecoId}`, { cache: 'no-store'})
      if (!res.ok) throw new Error("Erro ao buscar dados do buteco")

      const buteco = await res.json();

      setModalContent({
        title: `Avalie ${buteco.name}`,
        content: (
          <>
            <div className="flex justify-center mb-4">
              <Image src={buteco.logo_url} alt="Logo" width={100} height={100} />
            </div>
            <EvaluationForm 
              butecoId={butecoId}
              checkInId={checkInId}
              onDone={() => {
                setModalOpen(false);
                fetchDashboardData();
              }}
            />
          </>
        )
      })
      setModalOpen(true);
    } catch (err) {
      console.error("Erro ao carregar dados do buteco", err);
    }
  }

  const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/dashboard', {
          method: 'GET',
          next: { revalidate: 0 }
        })

        if (!res.ok) {
          console.error("Erro ao buscar dados do dashboard")
          return 
        }

        const json = await res.json()
        setData(json)
        setUserId(json.userId)
      } catch (err) {
        console.error('Error ao carregar dados do dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <p className="text-muted">Carregando dashboard...</p>
  if (!data) return 
    // <p className="text-muted">Erro ao carregar dashboard.</p>

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {/* Destaques: Avaliações pendentes */}
      <div className="xl:col-span-3">
        <PendingReviews 
          pendentes={data.pendingReviews} 
          action={(butecoId, checkInId) => handleReview(butecoId, checkInId)}
        />
      </div>
      {/* Linha 1: Estatísticas + Pódio */}
      <div className="xl:col-span-2 grid gap-4">
        <SummaryStats totalReviews={data.totalReviews} totalCheckIns={data.totalCheckIns} totalVisited={data.totalVisited} />
        <DashboardPodium butecos={data.topButecos} />
      </div>

      {/* Coluna lateral: Próximos encontros */}
      <div className="xl:col-span-1">
        <NextSchedule scheduled={data.nextSchedule} />
      </div>

      {/* Linha 2: Avaliações recentes */}
      <div className="xl:col-span-2 grid gap-4">
        <RecentReviews reviews={data.recentReviews} />
      </div>
      <div className="xl:col-span-1">
        <TopUsers users={data.topUsers} />
      </div>
    </div>
  )
}

