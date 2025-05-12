// app/recommendations/recommendations.api.ts
import { api } from "../api";
import type { RecommendationListResponse } from "./recommendation.types";

const base = "/recommendations";

const recommendationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    approveRecommendation: build.mutation<void, string>({
      query: (id: string) => ({
        url: `${base}/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["RECOMMENDATIONS"],
    }),
    deleteRecommendation: build.mutation<void, string>({
      query: (id: string) => ({
        url: `${base}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["RECOMMENDATIONS"],
    }),
    getRecommendations: build.query<RecommendationListResponse, void>({
      query: () => ({
        url: `${base}`,
        method: "GET",
      }),
      providesTags: ["RECOMMENDATIONS"],
    }),
  }),
});

export const {
  useApproveRecommendationMutation,
  useGetRecommendationsQuery,
  useDeleteRecommendationMutation,
} = recommendationsApi;
