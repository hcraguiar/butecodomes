import { lusitana } from "../fonts";
import Image from "next/image";
import RatingStars from "../rating-stars";
import { listLastReviews } from "@/prisma/prisma.service";
import { LatestReviews } from "@/app/lib/definitions";

export default async function LastReviews() {
  console.log('Fatching latest reviews...'); //test
  await new Promise((resolve) => setTimeout(resolve, 3000)); //test

  const reviews: LatestReviews[] = await listLastReviews();

  console.log('Data fetch completed.'); // test

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Últimas Avaliações</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-neutral-50 p-2 sm:p-4">
        <div className="bg-white px-2 h-[336px] overflow-auto">
          {reviews.map((review, i) => {
            return (
              <div 
              key={i}
              className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src="/customers/balazs-orban.png"
                    alt={`${review.user.name}'s profile picture`}
                    className="rounded-full"
                    width={32} 
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs">{review.user.name}</p>
                  </div>
                </div>
                <div className="flex flex-row items-end">
                  <p className="text-sm sm:font-semibold mx-2 text-end truncate">{review.buteco.name}</p>
                  <div className={`flex flex-col text-sm font-medium md:text-base break-words whitespace-normal text-end`}>
                    {review.rating}
                    <RatingStars rating={review.rating} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
