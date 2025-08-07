'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/dashboard/admin', label: 'Início' },
    { href: '/dashboard/admin/butecos', label: 'Gerenciar Butecos' },
    { href: '/dashboard/admin/users', label: 'Gerenciar Usuários' },
  ]

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-session dark:bg-dark-session">
        <h2 className="text-lg font-semibold">Painel Admin</h2>
        <button onClick={() => setOpen(!open)} className="p-2 rounded hover:bg-secondary dark:hover:bg-dark-secondary">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          open ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-session dark:bg-dark-session p-4 space-y-4 absolute md:static`}
      >
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)} // fecha o menu no mobile
              className={`px-3 py-2 rounded hover:bg-secondary dark:hover:bg-dark-secondary ${
                pathname === link.href ? 'bg-accent dark:bg-dark-accent font-semibold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-y-auto bg-background dark:bg-dark-background">
        {children}
      </main>
    </div>
  )
}
