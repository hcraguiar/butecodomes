import {
  BellIcon,
} from '@heroicons/react/24/outline';  
import Button from '../button';
import UserDropdown from './user-dropdown';
import { auth } from '@/auth';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default async function Topbar() {
  const session = await auth();
  const user = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    image: session?.user?.image || "/profile-avatar.png",
  }

  const isAdmin = session?.user?.role === 'ADMIN';
   
   return ( 
    <div className="flex justify-end items-center py-4 pr-16 md:pr-20 md:py-6 bg-background dark:bg-dark-background border-b border-muted dark:border-dark-muted shadow-sm">
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Botão de notificações */}
        <Button size='icon' variant='topbar' className="w-10 h-10 p-2.5 bg-transparent">
          <BellIcon className="w-5 h-5 text-muted dark:text-dark-muted" />
        </Button>

        {/* Botão para Admin Dashboard */}
        {isAdmin && (
          <Link href='/dashboard/admin' >
            <Button size='icon' variant='topbar' className='w-10 h-10 p-2.5 bg-transparent'>
              <Wrench className='w-5 h-5 text-muted dark:text-dark-muted' />
            </Button>
          </Link>
        )}


        {/* Dropdown do usuário */}
        <UserDropdown user={user} />
   
      </div>
    </div>
  );
}

