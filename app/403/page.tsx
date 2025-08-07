'use client'
import { signOut } from 'next-auth/react'

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl font-semibold mb-2">Acesso Negado</p>
      <p className="text-muted-foreground mb-6">
        Você não tem permissão para acessar esta área do sistema.
      </p>

      <div className="flex gap-4">
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Voltar para Início
        </a>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

