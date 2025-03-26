import Image from "next/image";
import { lusitana } from "../fonts";

const suggestions = [
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
];

export default function Suggestions() {
  return (
    <div className="md:col-span-1 lg:col-span-2">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Sugestões</h2>
      <div className="rounded-xl bg-neutral-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg h-[336px] overflow-auto">
          {suggestions.map((buteco, i) => {
            return (
              <div key={i} className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}>
                <div className="flex flex-row items-end">
                  <Image src={buteco.image} alt={buteco.name} width={32} height={32} className="rounded-full" />
                  <p className="text-sm sm:font-semibold mx-2 text-end truncate">{buteco.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}