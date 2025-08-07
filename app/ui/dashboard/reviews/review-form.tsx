// components/EvaluationForm.tsx
'use client'

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '@/app/ui/button';
import { ButecoListType, FormReviewType, Review } from '@/app/lib/types';
import toast from 'react-hot-toast';

const CATEGORIAS = {
  food: 'Comida',
  drink: 'Bebida',
  service: 'Serviço',
  ambiance: 'Ambiente',
  price: 'Preço',
}

type Props = {
  butecoId: string
  checkInId: string
  userReview?: FormReviewType | Review
  userId?: string | undefined
  onDone?: () => void
}

export default function EvaluationForm({ butecoId, checkInId, userReview, userId, onDone }: Props) {
  const [ratings, setRatings] = useState({
    food: 0,
    drink: 0,
    service: 0,
    ambiance: 0,
    price: 0,
  })
  const [mean, setMean] = useState(0)
  const [loading, setLoading] = useState(false)

  const review = userReview ? userReview : null;

  useEffect(() => {
    if (review) {
      setRatings({
        food: review.food || 0,
        drink: review.drink || 0,
        ambiance: review.ambiance || 0,
        service: review.service || 0,
        price: review.price || 0,
      })
    }
  }, [review]);

  useEffect(() => {
    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = parseFloat((sum / values.length).toFixed(2));
    setMean(mean)
  },[ratings])

  const handleChange = (key: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  }

  const handleSubmit = async () => {
    setLoading(true)
    const body = review ?
      {
        ...ratings,
        rating: mean,
        id: review.id,
      }
      : {
        butecoId: butecoId,
        ratings: { ...ratings, rating: mean },
        checkInId: checkInId,
        userId: userId,
      };

    const method = review ? 'PUT' : 'POST';

    await toast.promise(
      fetch('/api/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Erro ao salvar avaliação');
        onDone?.();
      }),
      {
        loading: 'Salvando...',
        success: review ? 'Avaliação atualizada!' : 'Avaliação enviada com sucesso!',
        error: 'Erro ao enviar avaliação.',
      }
    );

    setLoading(false)
  }

  return (
    <div className="space-y-2 p-4 border rounded bg-white dark:bg-zinc-900">
      {Object.entries(ratings).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <label className="capitalize w-20">{CATEGORIAS[key as keyof typeof CATEGORIAS]}:</label>
           <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((nota) => (
              <button
                key={nota}
                type="button"
                onClick={() => handleChange(key as keyof typeof ratings, nota)}
                className={`py-1 ${
                  ratings[key as keyof typeof ratings] >= nota
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
                }`}
              >
                <Star />
              </button>
            ))}
          </div>
          <span>{value}</span>  
        </div>
      ))}
      <div>
        <label htmlFor="" className="block font-medium">Nota Geral</label>
        <input 
          type="text" 
          value={mean} 
          disabled 
          className='border-0 px-3 py-1 w-full bg-gray-100 text-center font-semibold text-yellow-500 text-4xl' />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Salvando...' : review ? 'Editar Avaliação' : 'Avaliar'}
      </Button>
    </div>
  )
}
