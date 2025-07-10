'use client';

import Image from 'next/image';
import ButecoActions from './buteco-actions';
import { ButecoListType } from '@/app/lib/types';
import { useState } from 'react';

type Props = {
  buteco: ButecoListType
  onView: () => void;
  onDelete: () => void;
  onReview: () => void;
  checkInId?: string;
  onCheckInChange: (checkIn: boolean, checkedId?: string) => void;
};


export default function ButecoListItem({ buteco, onView, onDelete, onReview, checkInId, onCheckInChange }: Props) {

  return (
    <div className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-session dark:bg-dark-session">
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
          <p className="text-sm text-accent dark:text-dark-accent">Nota: {Number(buteco.rating ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Ações Desktop */}
      <div className="hidden md:flex">
        <ButecoActions
          butecoId={buteco.id}
          checkInId={checkInId}
          onDelete={onDelete}
          onView={onView}
          onReview={onReview}
          onCheckInChange={onCheckInChange}
        />
      </div>

      {/* Ações Mobile */}
      <div className="md:hidden">
        <ButecoActions
          butecoId={buteco.id}
          checkInId={checkInId}
          isMobile
          onDelete={onDelete}
          onView={onView}
          onReview={onReview}
          onCheckInChange={onCheckInChange}
        />
      </div>
    </div>
  );
}
