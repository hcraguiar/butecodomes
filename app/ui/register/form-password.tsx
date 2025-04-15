"use client";

import { KeyIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/ui/input";
import Button from "@/app/ui/button";

import React, { useState } from "react";

export default function FormPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("Email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    
    setLoading(true);
    const res = await fetch("/api/register/password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao criar senha.");
      setLoading(false);
      return;
    } else {
      router.push("/login?success=account_created");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
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
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}