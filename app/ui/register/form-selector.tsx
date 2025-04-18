"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { validateInviteToken } from "@/app/lib/invite-validator";
import { signIn } from "next-auth/react";
import Button from "@/app/ui/button";
import Logo from "@/app/ui/logo";

export default function FormSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validate() {
      if (!token) {
        setError("Token de convite ausente.");
        setValidating(false);
        return;
      }

      const isValidToken = await validateInviteToken(token);
      if (!isValidToken) {
        setError("Convite inválido, expirado ou já utilizado.");
      } else {
        setIsValid(true);
      }

      setValidating(false);
    }

    validate();
  }, [token]);

  const handleEmailRegister = () => {
    router.push(`/register/email?token=${token}`);
  };

  const handleGoogleRegister = async () => {
    if (!token) return;
    document.cookie = `inviteToken=${token}; path/; max-age=300; SameSite=Lax`;

    await signIn("google", {
      callbackUrl: `/auth/check-password`,
    });
  };

  if (validating) return <p className="text-sm text-muted-foreground">Validando convite...</p>;

  if (!isValid) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="mt-6 w-full max-w-sm">
      <Logo />
      <h2 className="my-2 text-base md:text-lg max-w-xl font-secondary">Escolha como deseja se registrar</h2>
      <Button className="mb-2" onClick={handleEmailRegister}>
        Registrar com E-mail
      </Button>
      <Button variant="outline" onClick={handleGoogleRegister}>
      <div className='flex justify-center items-center'>
        <div className='pr-4'>
          <svg xmlns="https://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 40 48" aria-hidden="true">
            <path fill="#4285F4" d="M39.2 24.45c0-1.55-.16-3.04-.43-4.45H20v8h10.73c-.45 2.53-1.86 4.68-4 6.11v5.05h6.5c3.78-3.48 5.97-8.62 5.97-14.71z"></path>
            <path fill="#34A853" d="M20 44c5.4 0 9.92-1.79 13.24-4.84l-6.5-5.05C24.95 35.3 22.67 36 20 36c-5.19 0-9.59-3.51-11.15-8.23h-6.7v5.2C5.43 39.51 12.18 44 20 44z"></path>
            <path fill="#FABB05" d="M8.85 27.77c-.4-1.19-.62-2.46-.62-3.77s.22-2.58.62-3.77v-5.2h-6.7C.78 17.73 0 20.77 0 24s.78 6.27 2.14 8.97l6.71-5.2z"></path>
            <path fill="#E94235" d="M20 12c2.93 0 5.55 1.01 7.62 2.98l5.76-5.76C29.92 5.98 25.39 4 20 4 12.18 4 5.43 8.49 2.14 15.03l6.7 5.2C10.41 15.51 14.81 12 20 12z"></path>
          </svg>
        </div>
        <div>
          Registrar com Google
        </div>
      </div>
      </Button>
    </div>
  );
}

