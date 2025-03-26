import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as RegularStar } from '@heroicons/react/24/outline';

const RatingStars = ({ rating }: { rating: number | null }) => {
  let fullStars = 0;
  if (rating) {
    fullStars = Math.floor(rating);
  }
  const emptyStars = 5 - fullStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<SolidStar key={`full-${i}`} className="h-5 w-5 text-orange-600" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<RegularStar key={`empty-${i}`} className="h-5 w-5 text-gray-600" />);
  }

  return <div className='flex'>{stars}</div>;
}

export default RatingStars;
