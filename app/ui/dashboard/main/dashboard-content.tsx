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

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false);
  const { setModalOpen, setModalContent } = useModal();

  const handleReview = async (butecoId: string, checkInId: string) => {
    try {
      const res = await fetch(`/api/buteco/${butecoId}`)
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
              buteco={buteco}
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

  if (loading) return <p className="text-muted dark:text-dark-muted">Carregando dashboard...</p>
  if (!data) return 
  // <p className="text-muted dark:text-dark-muted">Erro ao carregar dashboard.</p>

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Linha 1: Estatísticas + Pódio */}
      <div className="xl:col-span-2 grid gap-6">
        <SummaryStats totalReviews={data.totalReviews} totalCheckIns={data.totalCheckIns} />
        <DashboardPodium butecos={data.topButecos} />
      </div>

      {/* Coluna lateral: Top usuários */}
      <div className="xl:col-span-1">
        <TopUsers users={data.topUsers} />
      </div>

      {/* Linha 2: Avaliações recentes + pendentes */}
      <div className="xl:col-span-2 grid gap-6">
        <RecentReviews reviews={data.recentReviews} />
        <PendingReviews 
          pendentes={data.pendingReviews} 
          action={(butecoId, checkInId) => handleReview(butecoId, checkInId)}
        />
      </div>
    </div>
  )
}

