'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, QrCodeIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline'
import SignOutButton from '../login/sign-out'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../button'

interface UserDropdownProps {
  user: {
    name?: string
    email?: string
    image?: string
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant='topbar'
        size='icon'
        onClick={() => setOpen(!open)}
        className='p-0 overflow-hidden relative'
      >
          <Image
            src={user.image || '/profile-avatar.png'}
            alt="User"
            fill
            className='object-cover'
          />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface border border-muted rounded-md shadow-lg z-50 py-2 animate-fade-in">
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="border-t border-muted my-1" />
          <div className="px-4 py-2 space-y-2">

          <Link
            href={'/dashboard/user/profile'}
            className='flex flex-row text-sm'
            >
            <UserIcon className="w-5 h-5 mr-2" /> Perfil
          </Link>
          <Link
            href={'/dashboard/user/invites'}
            className='flex flex-row text-sm'
            >
            <QrCodeIcon className="w-5 h-5 mr-2" /> Convites
          </Link>
          <div className="border-t border-muted my-1" />
          <SignOutButton />
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 py-2 text-sm text-left text-foreground hover:bg-muted dark:hover:bg-muted/20 transition-colors"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  )
}
