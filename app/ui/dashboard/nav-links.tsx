'use client';

import {
  UserGroupIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  CalendarIcon,
  QrCodeIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Início', href: '/dashboard', icon: HomeIcon },
  { name: 'Butecos', href: '/dashboard/butecos', icon: BuildingStorefrontIcon },
  {
    name: 'Avaliações',
    href: '/dashboard/reviews',
    icon: StarIcon,
  },
  { name: 'Comunidade', href: '/dashboard/community', icon: UserGroupIcon },
  { name: 'Agenda', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Ranking', href: '/dashboard/ranking', icon: TrophyIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              pathname === link.href 
                ? 'bg-secondary/50 text-foreground dark:bg-dark-secondary/50 dark:text-dark-foreground pointer-events-none'
                : 'text-muted hover:text-foreground dark:text-dark-muted hover:dark:text-dark-foreground',
              
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
