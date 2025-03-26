import { RankingComponent } from "@/app/lib/definitions";
import { lusitana } from "../fonts";
import Image from "next/image";
import RatingStars from "../rating-stars";
import { ranking } from "@/prisma/prisma.service";

export default async function PodioRanking() {
  const data: RankingComponent[] = await ranking();
  return (
    <div className="w-full md:col-span-4 items-center justify-center">
      <h2 className={`${lusitana.className} text-xl md:text-2xl mb-4`}>Ranking</h2>
      <div className="rounded-xl bg-neutral-50 p-4">
        <div className="flex w-full justify-center gap-4 items-end rounded-lg bg-white p-2">
          {data.map((item, index) => (
            <div
            key={index}
            className={`flex flex-col justify-between items-center p-4 rounded-md shadow-md max-w-24 sm:max-w-32 ${
              index === 0
              ? 'bg-gradient-to-b from-yellow-200 to-yellow-400 min-h-80'
              : index === 1
              ? 'bg-gradient-to-b from-slate-200 to-slate-400 order-first min-h-72'
              : 'bg-gradient-to-b from-stone-200 to-stone-400 order-last min-h-64'
            }`}
            >
              <div>
                <div className="relative w-24 h-24 mb-4">
                  <Image
                    src="/butecos/adegaechurrasco.png"
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    />
                </div>
                <h3 className="text-sm font-light mb-2 text-center break-words whitespace-normal">{item.name}</h3>
              </div>
              <div className="flex flex-col items-center pb-2">
                <RatingStars rating={item.rating} />
                <p className="text-5xl text-gray-500 mt-2">{`${item.rating ? item.rating.toFixed(1) : "--"}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
