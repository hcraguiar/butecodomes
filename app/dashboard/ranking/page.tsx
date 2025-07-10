// app/(dashboard)/ranking/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Button from '@/app/ui/button';

type Buteco = {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
  food: number;
  drink: number;
  service: number;
  ambiance: number;
  price: number;
};

export default function RankingPage() {
  const [butecos, setButecos] = useState<Buteco[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ranking?page=${page}`);
      const json = await res.json();
      setButecos(json.data);
      setTotalPages(json.pagination.totalPages);
    } catch (err) {
      console.error("Erro ao carregar ranking", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [page]);

  const top3 = butecos.slice(0, 3);
  const rest = butecos.slice(3);

  const [first, second, third] = [
    top3[0] ?? null,
    top3[1] ?? null,
    top3[2] ?? null,
  ]

  const renderCard = (
  buteco: typeof top3[number],
  place: '🥇' | '🥈' | '🥉',
  bgColor: string,
  borderColor: string
  ) => (
    <div
      className={`rounded-xl p-4 w-36 text-center shadow-md border ${bgColor} ${borderColor}`}
    >
      <p className="text-4xl font-bold mb-2">{place}</p>
      <p className="font-bold mb-2">{buteco.name}</p>
      <p className="text-4xl mb-2"><strong>{Number(buteco.rating).toFixed(1)}</strong></p>
      <div className="text-xs text-muted dark:text-dark-muted space-y-1 text-left mt-2">
        <p>🍽️ Comida: {Number(buteco.food).toFixed(1)}</p>
        <p>🍹 Bebida: {Number(buteco.drink).toFixed(1)}</p>
        <p>🛎️ Serviço: {Number(buteco.service).toFixed(1)}</p>
        <p>🎵 Ambiente: {Number(buteco.ambiance).toFixed(1)}</p>
        <p>💰 Preço: {Number(buteco.price).toFixed(1)}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Ranking</h1>

      <section aria-labelledby='pódio'>
      {/* Pódio com degraus e troféus */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* Segundo lugar */}
        <div className="flex flex-col items-center">
          {second && (
            <>
              {renderCard(second, '🥈', 'bg-gray-100 dark:bg-gray-800', 'border-gray-300 dark:border-gray-600')}
              <div className="bg-gray-300 dark:bg-gray-700 h-12 w-full rounded-b-md" />
            </>
          )}
        </div>

        {/* Primeiro lugar */}
        <div className="flex flex-col items-center">
          {first && (
            <>
              {renderCard(first, '🥇', 'bg-yellow-100 dark:bg-yellow-700', 'border-yellow-400')}
              <div className="bg-yellow-300 dark:bg-yellow-600 h-20 w-full rounded-b-md" />
            </>
          )}
        </div>

        {/* Terceiro lugar */}
        <div className="flex flex-col items-center">
          {third && (
            <>
              {renderCard(third, '🥉', 'bg-orange-100 dark:bg-orange-800', 'border-orange-300 dark:border-orange-500')}
              <div className="bg-orange-300 dark:bg-orange-600 h-8 w-full rounded-b-md" />
            </>
          )}
        </div>
      </div> 
      </section>

      {/* Lista completa (4º em diante) */}
      <div className="space-y-4">
        {rest.map((buteco, idx) => (
          <div key={buteco.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">{idx + 4}</span>
              <Image src={buteco.logo_url} alt={buteco.name} width={50} height={50} className="rounded-full" />
              <div>
                <div className="font-semibold">{buteco.name}</div>
                <div className="text-sm text-muted">
                  Geral: {Number(buteco.rating).toFixed(1)} | 🍔 {buteco.food} | 🍻 {buteco.drink} | 🛎 {buteco.service} | 🎶 {buteco.ambiance} | 💸 {buteco.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
