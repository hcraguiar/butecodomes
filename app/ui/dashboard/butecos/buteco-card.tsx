import Image from 'next/image';
import { Star, MapPin } from 'lucide-react'; // Pode trocar por ícones de sua preferência
import { Buteco } from '@/app/lib/types';
import CategoryIcon from './icons/category-icon';

export function ButecoCard(buteco: Buteco) {
  const categoryData = [
    { icon: <CategoryIcon category='food' />, value: buteco.food },
    { icon: <CategoryIcon category='drink' />, value: buteco.drink },
    { icon: <CategoryIcon category='ambience' />, value: buteco.ambiance },
    { icon: <CategoryIcon category='service' />, value: buteco.service },
    { icon: <CategoryIcon category='price' />, value: buteco.price },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative aspect-[3/4] w-full max-w-[300px] rounded-lg overflow-hidden shadow-md">
        <Image
          src={buteco.image_url}
          alt={buteco.name}
          fill
          className="object-cover"
          />
        <div className="absolute inset-0 bg-[#575138]/50" />

        {/* Logo do Buteco */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-36 h-36 overflow-hidden flex items-center">
          <Image src={buteco.logo_url} alt={`${buteco.name} logo`} width={150} height={150} className="object-cover" />
        </div>

        {/* Nota principal e estrelas */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-6 text-center text-[#feeec6] z-10">
          <div className="text-6xl font-bold font-primary">{Number(buteco.rating).toFixed(2)}</div>
          <div className="flex justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
              key={i}
              size={20}
              className={i < Math.round(buteco.rating) ? 'text-[#febf00]' : 'text-gray-300'}
              fill={i < Math.round(buteco.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>

        {/* Notas por categoria */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {categoryData.map(({ icon, value }, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#febf00]">
                {icon}
              </div>
              <span className="text-sm text-[#feeec6] font-medium">{Number(value).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="flex mt-6">
        <MapPin className='h-6 w-6 mr-4' /> {buteco.address}
      </p>
    </div>
  );
}
