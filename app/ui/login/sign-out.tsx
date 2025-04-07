"use client";

import { signOut } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";
import Button from "@/app/ui/button";

export default function SignOutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex h-48px w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sair</div>
    </Button>
  )
}
