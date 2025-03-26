export type LatestReviews = {
  user: {
    name: string | null;
  };
  buteco: {
    name: string;
  };
  rating: number;
}

export type RankingComponent = {
  name: string;
  rating: number | null;
}
