"use client";

import InviteListClient from "@/app/ui/dashboard/invite/invite-list";
import { InviteListSkeleton } from "@/app/ui/dashboard/invite/invite-skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
    <h2 className="text-lg font-semibold mt-6">Meus Convites</h2>
    <Suspense fallback={<InviteListSkeleton />}>
      <InviteListClient />
    </Suspense>
    </>
  )
}