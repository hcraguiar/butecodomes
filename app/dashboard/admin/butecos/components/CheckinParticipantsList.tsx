'use client';

import { CheckInParticipant, FormReviewType } from '@/app/lib/types';
import Button from '@/app/ui/button';
import { Star } from 'lucide-react';

type Props = {
  participants: CheckInParticipant[];
  reviews: FormReviewType[];
  onReview: (userId: string, userReview: FormReviewType | undefined) => void;
};

export default function CheckinParticipantsList({
  participants,
  reviews,
  onReview,
}: Props) {
  return (
    <div>
      <p className="text-sm font-semibold">Participantes:</p>
      <ul className="list-disc list-inside text-sm ml-5">
        {participants.map((p) => {
          const userReview = reviews?.find((r) => r.user.id === p.user.id);
          return (
            <li key={p.user.id}>
              {p.user.name}
              <Button
                size="icon"
                variant="outline"
                className={`w-6 h-6 px-1.5 py-1 ml-4 ${
                  userReview ? 'bg-yellow-300' : ''
                }`}
                onClick={() => onReview(p.user.id, userReview)}
              >
                <Star className="w-3 h-3" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
