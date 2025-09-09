"use client";

import { useState } from "react";
import Input from "@/app/ui/input";
import { Scheduled, Suggested } from "@/app/lib/types";
import Button from "@/app/ui/button";
import toast from "react-hot-toast";

function getLocalDatetime(utcDateString: string): string {
  const date = new Date(utcDateString)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

type Props = {
   select: Suggested[]
   data?: { 
    id: string, 
    date: string,
    butecoId: string,
   }
   onDone?: () => void
}

export default function CalendarForm({ select, data, onDone }: Props) {
  const localDate = data?.date ? getLocalDatetime(data.date) : ""
  const [date, setDate] = useState(localDate)
  const [butecoId, setButecoId] = useState(data?.butecoId ?? undefined)
  const [scheduleId, setScheduleId] = useState(data?.id ?? undefined)
  const [butecos, setButecos] = useState(select)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const body = scheduleId ?
    {
      id: scheduleId,
      date,
      buteco_id: butecoId,
    } 
    : {
      date,
      buteco_id: butecoId
    }

    const method = scheduleId ? "PUT" : "POST"

    await toast.promise(
      fetch('/api/calendar', {
        method,
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (res) => {
        onDone?.()
        if (!res.ok) {
          throw new Error('Erro ao salvar avaliação')
        }
      }),
      {
        loading: 'Salvando...',
        success: 'Agendamento realizado.',
        error: 'Erro ao salvar agendamento.',
      }
    )

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="date-input">Data e Hora</label>
      <Input
        id='date-input' 
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label htmlFor="buteco-select">Selecione o buteco:</label>
      <select
        id="buteco-select"
        className="border rounded p-2 mb-4"
        value={butecoId ?? ""}
        onChange={(e) => setButecoId(e.target.value || "")}
      >
        <option value="">Nenhum selecionado</option>
        {butecos.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onDone} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  )
}
