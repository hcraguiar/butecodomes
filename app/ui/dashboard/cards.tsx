import {
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/prisma/prisma.service';

const iconMap = {
  reviews: StarIcon,
  members: UserGroupIcon,
  visited: MapPinIcon,
  calendar: CalendarDaysIcon,
};

export default async function CardWrapper() {
  const {
    reviewsCount,
    membersCount,
    visitedButecos,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Avaliações" value={reviewsCount} type="reviews" />
      <Card title="Membros" value={membersCount} type="members" />
      <Card title="Butecos Visitados" value={visitedButecos} type="visited" />
      <Card title="Agendados" value={0} type="calendar" /> 
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'reviews' | 'members' | 'visited' | 'calendar';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-neutral-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-lg bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
