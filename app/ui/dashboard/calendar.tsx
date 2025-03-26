import Image from "next/image";
import { lusitana } from "../fonts";

const calendar = [
  {date: '04/04/2025 20:00', name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
  {date: '03/05/2025 20:00', name: 'Nome do Buteco', image: '/butecos/adegaechurrasco.png'},
];

export default function Calendar() {
  return (
    <div className="md:col-span-1 lg:col-span-2">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Agenda</h2>
      <div className="rounded-xl bg-neutral-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg h-[336px] overflow-auto">
          {calendar.map((buteco, i) => {
            return (
              <div key={i} className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500">{buteco.date}</span>
                </div>
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