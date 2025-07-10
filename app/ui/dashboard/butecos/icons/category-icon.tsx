import Image from "next/image";

interface CategoryIconProps {
  category: 'food' | 'drink' | 'ambience' | 'service' | 'price';
}


export default function CategoryIcon({ category }: CategoryIconProps) {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#febf00]">
      <Image
        src={`/icons/${category}.svg`}
        alt={`${category} icon`}
        width={36}
        height={36}
        className=""
      />
    </div>
  );
}