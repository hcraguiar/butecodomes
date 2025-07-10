"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "@/app/ui/button";
import Input from "@/app/ui/input";
import { AtSymbolIcon, UserIcon, ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import withInviteValidation from "./invite-validate";
import Logo from "@/app/ui/logo";

function RegisterWithEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Token de convite ausente.");

    setError(null);
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    
    setLoading(true);
    const res = await fetch("/api/register/email", {
      method: "POST",
      body: JSON.stringify({ token, name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao registrar.");
      setLoading(false);
      return;
    } else {
      // redirecionar para login caso 'success'
      router.push(`/login?success=AccountCreated`);
    }

  };

  return (
    <>
    <Logo />
    <h1 className="text-3xl md:text-4xl font-bold mt-6">Registrar</h1>
    <p className="mt-2 text-base md:text-lg max-w-xl font-secondary">
      Insira seus dados.
    </p>
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
        <Input
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserIcon />}
          required
          />
      
        <Input
          placeholder="Seu e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<AtSymbolIcon />}
          required
          />

        <Input
          placeholder="Sua senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<KeyIcon />}
          required
          />
      
        <Input
          placeholder="Confirme sua senha"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<KeyIcon />}
          required
          />
          
      {error && 
        <div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      }
      <Button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Continuar"}
      </Button>
    </form>       
    </>
  );
}

export default withInviteValidation(RegisterWithEmailForm);
