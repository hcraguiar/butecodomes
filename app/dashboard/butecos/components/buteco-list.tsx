'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../../../ui/input';
import ButecoListItem from './buteco-list-item';
import Button from '../../../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ButecoListType, OpenReviewFormAction, OpenButecoDetailsAction } from '@/app/lib/types';
import { ButecoCard } from './buteco-card';
import { useDebounce } from 'use-debounce';
import EvaluationForm from '../../../ui/dashboard/reviews/review-form';
import Image from 'next/image';
import { useModal } from '@/app/context/modal-context';
import CheckInFormModal from './checkin-form-modal';
import { useSearchParams } from 'next/navigation';

type Props = {
  query?: string
}

export default function ButecoList({ query }: Props) {
  const [butecos, setButecos] = useState<ButecoListType[]>([]);
  const [checkInMap, setCheckInMap] = useState<Record<string, string | undefined>>({});
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 800);
  const [orderBy, setOrderBy] = useState<'name' | 'rating'>('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const { setModalOpen, setModalContent } = useModal();

  async function fetchButecos() {
    setLoading(true);
    try {
      const res = await fetch(`/api/butecos?page=${page}&orderBy=${orderBy}&search=${debouncedSearch}`);
      const { data, pagination } = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
      setButecos(data);
      setTotalPages(pagination.totalPages);
    } catch (err: any) {
      console.error("Erro ao listar butecos", err)
      toast.error('Erro ao carregar os butecos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (action: OpenButecoDetailsAction) => {
    setModalContent({title: action.buteco.name, content: <ButecoCard {...action.buteco} />});
    setModalOpen(true);
  }

  const handleDeleteButeco = async (id: string) => {
    try {
      const res = await fetch(`/api/butecos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success("Buteco deletado");
      fetchButecos();
    } catch (err) {
      console.error('Erro ao tentar apagar buteco', err);
      toast.error('Erro ao deletar buteco');
    }
  };

  function handleCheckInFormOpen(butecoId: string) {
    setModalContent({
      title: 'Registrar Check-in',
      content: (
        <CheckInFormModal
          butecoId={butecoId}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (participantIds, createdAt) => {
            try {
              const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ butecoId, participantIds, createdAt }),
              });

              if (!res.ok) throw new Error();

              toast.success('Check-in registrado com sucesso!');
              // Refetch dados, se necessário
              setModalOpen(false);
            } catch (error) {
              toast.error('Erro ao registrar check-in.');
            }
          }}
        />
      ),
    });
    setModalOpen(true);
  }

  const handleCheckInChange = (butecoId: string, checkedIn: boolean, newCheckInId?: string) => {
    setCheckInMap(prev => ({
      ...prev,
      [butecoId]: checkedIn ? newCheckInId : undefined
    }));
  };

  const handleReview = (action: OpenReviewFormAction) => {
    const buteco = action.buteco
    const updatedCheckInId = checkInMap[buteco.id] ?? buteco.checkIn[0]?.id;

    const userReview = buteco.reviews ? buteco.reviews[0] : undefined;

    setModalContent({ 
      title: `Avalie ${buteco.name}`, 
      content:( 
      <>
      <div className="flex justify-center mb-4">
        <Image src={buteco.logo_url} alt='Logo' width={100} height={100} />
      </div>
      <EvaluationForm 
        butecoId={buteco.id} 
        checkInId={updatedCheckInId}
        {...(userReview ? { userReview } : {} )}
        onDone={() => {
          setModalOpen(false);
          fetchButecos();
        }} 
      />
      </>
      ),
    });
    setModalOpen(true);
  }

  useEffect(() => {
    fetchButecos();
  }, [page, orderBy, debouncedSearch]);

  useEffect(() => {
    if (query) {
      setSearch(query)
    }
  }, [query])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Input
          placeholder='Buscar por nome...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=' '
        />

        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as 'name' | 'rating')}
          className='md:w-60 p-3 rounded-lg border border-gray-300 dark:border-gray-600 mb-3 text-muted'
        >
          <option value="name">Ordenar por nome</option>
          <option value="rating">Ordenar por nota</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : butecos.length === 0 ? (
        <p className="text-center py-8 text-muted">Nenhum buteco encontrado.</p>
      ) : (
        <div className="space-y-2">
          {butecos.map((buteco) => (
            <ButecoListItem 
              key={buteco.id} 
              buteco={buteco} 
              onView={() => handleViewDetails({ buteco })} 
              onDelete={() => handleDeleteButeco(buteco.id)} 
              onReview={() => handleReview({ buteco })} 
              checkInId={checkInMap[buteco.id] ?? buteco.checkIn[0]?.id}
              onCheckInChange={(checkedIn, id) => handleCheckInChange(buteco.id, checkedIn, id)}
              openCheckInForm={() => handleCheckInFormOpen(buteco.id)}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <Button
          variant='outline'
          size='icon'
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className='disabled:opacity-50 disabled:pointer-events-none'
        >
          <ChevronLeft className='w-5 h-5' />
        </Button>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <Button
          variant='outline'
          size='icon'
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className='disabled:opacity-50 disabled:pointer-events-none'
        >
          <ChevronRight className='w-5 h-5' />
        </Button>
      </div>
    </div>
  );
}

