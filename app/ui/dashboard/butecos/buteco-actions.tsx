'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import Button from '@/app/ui/button';
import CheckInButton from './check-in-button';

type Props = {
  butecoId: string;
  checkInId?: string;
  isMobile?: boolean;
  onDelete: () => void;
  onView: () => void;
  onReview: () => void;
  onCheckInChange?: (checkedIn: boolean, checkInId?: string) => void;
};

export default function ButecoActions({
  butecoId,
  checkInId,
  isMobile = false,
  onDelete,
  onView,
  onReview,
  onCheckInChange
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const handleClose = () => setOpen(false);

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="p-2"
        >
          ⋮
        </Button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:text-foreground border border-muted rounded-md shadow-lg z-50 py-2 animate-fade-in">
            <CheckInButton
              butecoId={butecoId}
              checkInId={checkInId}
              reviewForm={onReview}
              closePopUp={handleClose}
              onCheckInChange={onCheckInChange}
            />
            <button onClick={() => { onView(); handleClose(); }} className="w-full px-4 py-2 text-sm flex items-center">
              <Eye className="w-5 h-5 mr-2" /> Visualizar
            </button>
            <button onClick={() => { onDelete(); handleClose(); }} className="w-full px-4 py-2 text-sm flex items-center text-red-600 hover:bg-red-50">
              <Trash2 className="w-5 h-5 mr-2" /> Deletar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <CheckInButton
        butecoId={butecoId}
        checkInId={checkInId}
        reviewForm={onReview}
        closePopUp={() => {}}
        onCheckInChange={onCheckInChange}
      />
      <Button variant="outline" size="icon" onClick={onView} title="Visualizar">
        <Eye className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onDelete}
        title="Deletar"
        className="hover:bg-red-100 dark:hover:bg-red-800 transition text-red-600 dark:text-red-400"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
