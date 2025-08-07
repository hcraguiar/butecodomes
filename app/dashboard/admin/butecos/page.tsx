// app/dashboard/admin/butecos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ButecoWithCheckIns, CheckIn, FormReviewType, User } from '@/app/lib/types';
import { toast } from 'react-hot-toast';
import { useModal } from '@/app/context/modal-context';
import EvaluationForm from '@/app/ui/dashboard/reviews/review-form';

import ButecoCard from './components/ButecoCard';
import CheckinModal from './components/CheckinModal';

export default function AdminButecosPage() {
  const [butecos, setButecos] = useState<ButecoWithCheckIns[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen2] = useState(false);
  const [editingButecoId, setEditingButecoId] = useState<string | null>(null);
  const [editingCheckin, setEditingCheckin] = useState<CheckIn | null>(null);

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [checkinDate, setCheckinDate] = useState<string>('');

  const { setModalContent, setModalOpen } = useModal();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [butecoRes, userRes] = await Promise.all([
          fetch('/api/admin/butecos'),
          fetch('/api/admin/users'),
        ]);

        const butecoJson = await butecoRes.json();
        const userJson = await userRes.json();

        setButecos(butecoJson.data ?? []);
        setUsers(userJson.data ?? []);
      } catch {
        toast.error('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function openNewCheckinModal(butecoId: string) {
    setEditingButecoId(butecoId);
    setEditingCheckin(null);
    setSelectedUserIds(new Set());
    setCheckinDate(new Date().toISOString().slice(0, 16));
    setModalOpen2(true);
  }

  function openEditCheckinModal(butecoId: string, checkin: CheckIn) {
    setEditingButecoId(butecoId);
    setEditingCheckin(checkin);

    const userIds = new Set(checkin.participants.map((p) => p.user.id));
    setSelectedUserIds(userIds);

    const dtLocal = new Date(checkin.createdAt).toISOString().slice(0, 16);
    setCheckinDate(dtLocal);
    setModalOpen2(true);
  }

  function closeModal() {
    setModalOpen2(false);
    setEditingButecoId(null);
    setEditingCheckin(null);
    setSelectedUserIds(new Set());
    setCheckinDate('');
  }

  function handleUserToggle(userId: string) {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      return newSet;
    });
  }

  async function handleSubmit() {
    if (!editingButecoId || !checkinDate) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    toast.loading('Salvando check-in...');

    const body = {
      butecoId: editingButecoId,
      participantIds: Array.from(selectedUserIds),
      createdAt: new Date(checkinDate).toISOString(),
      checkInId: editingCheckin?.id ?? undefined,
    };

    try {
      const response = await fetch(`/api/admin/butecos/checkins`, {
        method: editingCheckin
          ? 'PUT'
          : selectedUserIds.size === 0
          ? 'DELETE'
          : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error();

      toast.dismiss();
      toast.success('Check-in salvo com sucesso!');

      // Reload butecos
      const res = await fetch('/api/admin/butecos');
      const json = await res.json();
      setButecos(json.data ?? []);
      closeModal();
    } catch {
      toast.dismiss();
      toast.error('Erro ao salvar check-in.');
    }
  }

  function openReviewModal(
    butecoId: string,
    checkinId: string,
    userReview: FormReviewType | undefined,
    userId: string | undefined
  ) {
    setModalContent({
      title: 'Avaliação',
      content: (
        <EvaluationForm
          butecoId={butecoId}
          checkInId={checkinId}
          userReview={userReview}
          userId={userId}
          onDone={() => setModalOpen(false)}
        />
      ),
    });
    setModalOpen(true);
  }

  function getAvailableUsers(buteco: ButecoWithCheckIns): User[] {
    const usersWithCheckin = new Set(
      buteco.checkIn.flatMap((c) => c.participants.map((p) => p.user.id))
    );
    return users.filter((u) => !usersWithCheckin.has(u.id));
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Gerenciar Butecos</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-8">
          {butecos.map((buteco) => (
            <ButecoCard
              key={buteco.id}
              buteco={buteco}
              onAddCheckin={openNewCheckinModal}
              onEditCheckin={openEditCheckinModal}
              onReview={openReviewModal}
            />
          ))}
        </div>
      )}

      <CheckinModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        checkinDate={checkinDate}
        setCheckinDate={setCheckinDate}
        selectedUserIds={selectedUserIds}
        handleUserToggle={handleUserToggle}
        editingCheckin={editingCheckin}
        availableUsers={
          editingButecoId
            ? getAvailableUsers(butecos.find((b) => b.id === editingButecoId)!)
            : []
        }
      />
    </div>
  );
}
