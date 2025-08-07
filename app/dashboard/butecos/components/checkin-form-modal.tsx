'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/ui/button';

type User = { id: string; name: string };

type Props = {
  butecoId: string;
  onSubmit: (participantIds: string[], createdAt: string) => void;
  onCancel: () => void;
};

export default function CheckInFormModal({ butecoId, onSubmit, onCancel }: Props) {
  const now = new Date()
  const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
  const formattedDateTime = localNow.toISOString().slice(0, 16)

  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [checkinDate, setCheckinDate] = useState(formattedDateTime);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch(`/api/butecos/${butecoId}/available-users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Erro ao buscar usuários disponíveis', err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [butecoId]);

  function toggleUser(id: string) {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }

  return (
    <div className="text-black space-y-4">
      <h2 className="text-lg font-bold">Novo Check-in</h2>

      <label className="block">
        <span className="text-sm font-semibold">Data e hora</span>
        <input
          type="datetime-local"
          className="w-full border rounded p-2 mt-1"
          value={checkinDate}
          onChange={(e) => setCheckinDate(e.target.value)}
        />
      </label>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todos já fizeram check-in.</p>
      ) : (
        <fieldset className="border rounded p-2 max-h-48 overflow-y-auto">
          <legend className="text-sm font-semibold">Participantes</legend>
          {users.map(user => (
            <label key={user.id} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                checked={selectedIds.has(user.id)}
                onChange={() => toggleUser(user.id)}
              />
              <span>{user.name}</span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSubmit(Array.from(selectedIds), checkinDate)}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
