"use client";

import { signOut } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";
import Button from "@/app/ui/button";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex h-48px w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 text-red-600 border-red-600"
    >
      <PowerIcon className="w-5" />
      <div className="">Sair</div>
    </Button>
  )
}
