import { api } from "../api";

const base = "/recommendations";

const recommendationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    approveRecommendation: build.mutation<any, string>({
      query: (id: string) => ({
        url: `${base}/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["RECOMMENDATIONS"],
    }),
    deleteRecommendation: build.mutation<any, string>({
      query: (id: string) => ({
        url: `${base}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["RECOMMENDATIONS"],
    }),
    getRecommendations: build.query<any, void>({
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
