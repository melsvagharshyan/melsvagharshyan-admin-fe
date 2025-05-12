export type RecommendationImage = {
  url?: string;
  public_id?: string;
};

export type Recommendation = {
  _id: string;
  fullName: string;
  profession: string;
  recommendation: string;
  approved?: boolean;
  stars?: number;
  image?: RecommendationImage;
};

export type RecommendationListResponse = {
  data: Recommendation[];
};
