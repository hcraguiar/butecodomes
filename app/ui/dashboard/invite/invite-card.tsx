"use client";

import Button from "@/app/ui/button";
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Square2StackIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { InviteWithUser } from "@/app/lib/types";
import { formatDateToLocal } from "@/app/lib/utils";

type Props = {
  invite: InviteWithUser
}

export function InviteCard({ invite }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/register?token=${invite.token}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="p-4 space-y-2">
        <QRCode value={url} size={128} viewBox={'0 0 128 128'} className="mx-auto mb-10" />
        <p className="text-sm font-medium break-words">
          Token: <span className="text-blue-600">{invite.token}</span>
        </p>
        <p className="text-gray-500 text-sm">
          Expira em: {formatDateToLocal(invite.expiresAt.toLocaleString())}
        </p>
        <div className="flex justify-end items-center">
          {copied && (
            <span className="mr-5 text-xs text-green-600">Copiado!</span>
          )}
          <Button
            variant="ghost"
            size='icon'
            className="top-2 right-2"
            onClick={handleCopy}
            >
            <Square2StackIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SimpleInviteCard({ invite }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <p className="text-sm font-medium">
        Token: <span className="font-medium">{invite.token.slice(0, 8)}...</span>
      </p>
      <div>
        <span className="font-medium">Status:</span>{" "}
        {invite.acceptedBy ? (
          <>
            Aceito por <strong>{invite.acceptedBy.name ?? invite.acceptedBy.email}</strong>
          </>
        ) : (
          <>
          <span className="text-yellow-600">Aguardando aceitação</span>
          <span className="flex text-sm text-gray-500">
            Expira em: {formatDateToLocal(invite.expiresAt.toLocaleString())}
          </span>
          {/* <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(invite)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCancel(invite.id)}
          >
            <TrashIcon className="w-4 h-4 text-red-600" />
          </Button>
          </div> */}
          </>
        )};
      </div>
    </div>
  );
}
