"use client";

import { InviteWithUser } from "@/app/lib/types";
import { redirect, useRouter } from "next/navigation";
import Button from "@/app/ui/button";
import { useEffect, useState } from "react";
import { InviteCard, SimpleInviteCard } from "./invite-card";
import { Modal } from "@/app/ui/modal";
import { InviteListSkeleton } from "./invite-skeleton";
import { formatDateToLocal } from "@/app/lib/utils";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { create } from "domain";

type ApiResponse = InviteWithUser[];

export default function InviteListClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<InviteWithUser | null>(null);
  const [invites, setInvites] = useState<ApiResponse>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      const res = await fetch(`/api/invite/list?page=${currentPage}`);
      const data = await res.json();
      setInvites(data.invites);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchInvites();
  }, [currentPage]);


  const handleView = (invite: InviteWithUser) => {
    setModalContent(invite);
    setModalOpen(true);
  }

  const handleCancel = async (inviteId: string) => {
    await fetch(`/api/invite/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ id: inviteId }),
      headers: { "Content-Type": "application/json" },
    });
  }

  const handleCreate = async () => {
    const res = await fetch('/api/invite/create', {
      method: 'POST',
    });

    const invite = await res.json();

    setModalContent(invite);
    setModalOpen(true);
  }

  const now = new Date;
  
  if (loading) return <InviteListSkeleton />

  return (
    <>
    <div className="flex justify-end my-4">
      <Button onClick={() => handleCreate()} size="sm">Novo convite</Button>
    </div>
    {invites.length === 0 ? (
      <p className="text-sm">Nenhum convite criado!</p>
    ) : (
      invites.map((invite) => {
        const isPending = !invite.acceptedBy && new Date(invite.expiresAt) > now;
        const isExpired = new Date(invite.expiresAt) < now;
        const isCanceled = false; // Temporário: buscando nova opção de cancelamento
        return (
        
        <div className="border rounded-md p-4 flex flex-col bg-white shadow-sm mb-2" key={invite.id}>
          <p className="text-sm">
            Token: <span className="font-mono">{invite.token.slice(0, 8)}...</span>
          </p>
          <p className="text-xs text-gray-500">
            Expira em: {formatDateToLocal(invite.expiresAt.toLocaleString())}
          </p>

          <div className="my-2">
          {invite.acceptedBy ? (
            <p className="text-green-600 text-xs">
              Aceito por: {invite.acceptedBy.name ?? invite.acceptedBy.email}
            </p>
          ) : isExpired ? (
            <p className="text-red-600 text-xs">Expirado</p>
          ) : isCanceled ? (
            <p className="text-red-600 text-xs">Cancelado</p>
          ) : (
            <p className="text-yellow-600 text-xs">Aguardando aceitação</p>
          )}
          </div>

          <div className="flex gap-2 justify-end">
            {isPending && (
              <>
              <Button 
                variant='outline' 
                size='icon' 
                onClick={() => handleView(invite)}
                >
                <EyeIcon className="w-4 h-4" />
              </Button>
              <Button 
                variant='outline' 
                size='icon' 
                onClick={() => handleCancel(invite.id)}
                >
                <TrashIcon className="w-4 h-4 text-red-600" />
              </Button>
              </>
            )}
          </div>
        </div>

        
        );
      })
    )}

    {/* Paginação */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) =>(
        <Button
          key={i}
          variant={i + 1 === currentPage ? "primary" : "outline"}
          size="sm"
          disabled={(i + 1 === currentPage)}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Button>
        ))}
      </div>
    )}

    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Convite"
    >
      {modalContent && (
        <InviteCard invite={modalContent} />
      )}
    </Modal>
    </>
  );
}
