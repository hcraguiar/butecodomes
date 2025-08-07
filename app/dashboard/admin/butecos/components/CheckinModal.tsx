'use client';

import { User, CheckIn } from '@/app/lib/types';
import Button from '@/app/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  checkinDate: string;
  setCheckinDate: (date: string) => void;
  selectedUserIds: Set<string>;
  handleUserToggle: (userId: string) => void;
  editingCheckin: CheckIn | null;
  availableUsers: User[];
};

export default function CheckinModal({
  open,
  onClose,
  onSubmit,
  checkinDate,
  setCheckinDate,
  selectedUserIds,
  handleUserToggle,
  editingCheckin,
  availableUsers,
}: Props) {
  if (!open) return null;

  const checkInParticipants = editingCheckin?.participants.map((p) => p.user) ?? [];
  const combinedUsersMap = new Map<string, User>();
  checkInParticipants.forEach((u) => combinedUsersMap.set(u.id, u));
  availableUsers.forEach((u) => combinedUsersMap.set(u.id, u));
  const usersToDisplay = editingCheckin ? Array.from(combinedUsersMap.values()) : availableUsers;

  const disabledParticipants = editingCheckin?.participants
    .filter((p) => p.hasEvaluated)
    .map((p) => p.user.id);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black rounded p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {editingCheckin ? 'Editar Check-in' : 'Novo Check-in'}
        </h2>

        <label className="block mb-2 font-semibold">
          Data e Hora do Check-in
          <input
            type="datetime-local"
            className="w-full border rounded p-2 mt-1"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            required
          />
        </label>

        <fieldset className="mb-4 border rounded">
          <legend className="mx-auto px-2 font-semibold mb-2">Participantes</legend>

          <div className="max-h-40 overflow-y-auto p-2">
            {usersToDisplay.length === 0 ? (
              <p>Todos já fizeram check-in neste buteco.</p>
            ) : (
              usersToDisplay.map((user) => {
                const disabled = disabledParticipants?.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center space-x-2 mb-1 cursor-pointer ${
                      disabled ? 'text-slate-600 opacity-50 line-through' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 disabled:opacity-50 disabled:checked:bg-slate-800"
                      disabled={disabled}
                    />
                    <span>{user.name}</span>
                  </label>
                );
              })
            )}
          </div>
        </fieldset>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
