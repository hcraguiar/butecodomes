'use client';

import { ButecoWithCheckIns, CheckIn, FormReviewType } from '@/app/lib/types';
import Button from '@/app/ui/button';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/outline';
import { Edit, Star, UserCheck2 } from 'lucide-react';
import { useState } from 'react';
import CheckinParticipantsList from './CheckinParticipantsList';

type Props = {
  buteco: ButecoWithCheckIns;
  onAddCheckin: (butecoId: string) => void;
  onEditCheckin: (butecoId: string, checkin: CheckIn) => void;
  onReview: (
    butecoId: string,
    checkinId: string,
    userReview: FormReviewType | undefined,
    userId: string | undefined
  ) => void;
};

export default function ButecoCard({ buteco, onAddCheckin, onEditCheckin, onReview }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div key={buteco.id} className="border rounded p-6 shadow space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{buteco.name}</h2>
          <p className="text-xs">{buteco.address}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onAddCheckin(buteco.id)}>
            <UserCheck2 className="w-5 h-5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={`checkins-list-${buteco.id}`}
          >
            {open ? (
              <ChevronDoubleUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleDownIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div
          id={`checkins-list-${buteco.id}`}
          className="space-y-3 border-t pt-4 max-h-72 overflow-y-auto"
        >
          {buteco.checkIn.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum check-in registrado.</p>
          ) : (
            buteco.checkIn.map((checkin) => (
              <div
                key={checkin.id}
                className="border rounded p-3 bg-gray-50 text-black flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium mb-1">
                    Data: {new Date(checkin.createdAt).toLocaleString()}
                  </p>
                  <CheckinParticipantsList
                    participants={checkin.participants}
                    reviews={checkin.review}
                    onReview={(userId, userReview) =>
                      onReview(buteco.id, checkin.id, userReview, userId)
                    }
                  />
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditCheckin(buteco.id, checkin)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
