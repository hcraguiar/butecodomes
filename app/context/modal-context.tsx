'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ModalComponent } from '@/app/lib/types';
import Modal from '../ui/modal';

type ModalContextType = {
  setModalOpen: (open: boolean) => void;
  setModalContent: (modal: ModalComponent) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalComponent | null>(null);

  return (
    <ModalContext.Provider value={{ setModalOpen, setModalContent }}>
      {children}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalContent?.title}>
        {modalContent?.content}
      </Modal>
    </ModalContext.Provider>
  );
}
