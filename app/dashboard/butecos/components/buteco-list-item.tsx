'use client';

import Image from 'next/image';
import ButecoActions from './buteco-actions';
import { ButecoListType } from '@/app/lib/types';

type Props = {
  buteco: ButecoListType
  onView: () => void;
  onDelete: () => void;
  onReview: () => void;
  checkInId?: string;
  onCheckInChange: (checkIn: boolean, checkedId?: string) => void;
  openCheckInForm: () => void; 
};


export default function ButecoListItem({ buteco, onView, onDelete, onReview, checkInId, onCheckInChange, openCheckInForm }: Props) {
  const firstCheckIn = buteco.checkIn[0]
  const hasEvaluated = firstCheckIn?.participants?.some((p) => p.hasEvaluated) ?? false

  return (
    <div className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-session">
      <div className="flex items-center gap-4">
        <Image
          src={buteco.logo_url || '/logo.png'}
          alt={buteco.name}
          width={100}
          height={100}
          className="object-cover"
        />
        <div>
          <p className="font-semibold text-lg">{buteco.name}</p>
          <p className="text-sm font-extrabold text-muted">
            Nota: {Number(buteco.rating ?? 0).toFixed(2)}
          </p>
          <p className="text-sm text-muted">
            {buteco._count.reviews} {buteco._count.reviews === 1 ? 'avaliação' : 'avaliações'}
            </p>
        </div>
      </div>

      {/* Ações Desktop */}
      <div className="hidden md:flex">
        <ButecoActions
          butecoId={buteco.id}
          checkInId={checkInId}
          status={hasEvaluated}
          onDelete={onDelete}
          onView={onView}
          onReview={onReview}
          onCheckInChange={onCheckInChange}
          openCheckInForm={openCheckInForm}
          />
      </div>

      {/* Ações Mobile */}
      <div className="md:hidden">
        <ButecoActions
          butecoId={buteco.id}
          checkInId={checkInId}
          status={hasEvaluated}
          isMobile
          onDelete={onDelete}
          onView={onView}
          onReview={onReview}
          onCheckInChange={onCheckInChange}
          openCheckInForm={openCheckInForm}
          />
      </div>
    </div>
  );
}
