import React, { useState } from "react";
import {
  useGetRecommendationsQuery,
  useApproveRecommendationMutation,
  useDeleteRecommendationMutation,
} from "../app/recommendations/recommendations.api";
import type { Recommendation } from "../app/recommendations/recommendation.types";

const defaultAvatar =
  "https://res.cloudinary.com/dxfqf6fgv/image/upload/v1746967371/orig_sxg7yl.svg";

const RecommendationsList: React.FC = () => {
  const {
    data: recommendations,
    error,
    isLoading,
    refetch,
  } = useGetRecommendationsQuery();

  const [approveRecommendation] = useApproveRecommendationMutation();
  const [deleteRecommendation] = useDeleteRecommendationMutation();

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const handleApprove = async (_id: string) => {
    try {
      setApprovingId(_id);
      await approveRecommendation(_id).unwrap();
      refetch();
    } catch (err) {
      console.error("Approval failed", err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      setDeletingId(_id);
      await deleteRecommendation(_id).unwrap();
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-lg text-gray-600">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 text-lg">
        Error loading recommendations.
      </div>
    );
  }

  const approvedRecommendations = recommendations?.data?.filter(
    (rec: Recommendation) => rec.approved
  );
  const pendingRecommendations = recommendations?.data?.filter(
    (rec: Recommendation) => !rec.approved
  );

  const renderRecommendation = (recommendation: Recommendation) => (
    <li
      key={recommendation._id}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <img
          src={recommendation?.image?.url || defaultAvatar}
          alt={`${recommendation.fullName}'s image`}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {recommendation.fullName}
          </h2>
          <p className="text-gray-500">{recommendation.profession}</p>

          {recommendation.stars && (
            <div className="mt-1 text-yellow-500">
              ⭐ {recommendation.stars}
            </div>
          )}

          <p className="mt-4 text-gray-700">{recommendation.recommendation}</p>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                recommendation.approved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {recommendation.approved ? "Approved" : "Pending"}
            </span>

            {!recommendation.approved && (
              <button
                onClick={() => handleApprove(recommendation._id)}
                disabled={approvingId === recommendation._id}
                className="px-4 py-1.5 cursor-pointer min-w-[75px] bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {approvingId === recommendation._id ? (
                  <div className="w-4 h-4 border-2 m-auto border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Approve"
                )}
              </button>
            )}

            <button
              onClick={() => handleDelete(recommendation._id)}
              disabled={deletingId === recommendation._id}
              className="px-4 py-1.5 cursor-pointer min-w-[75px] bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center"
            >
              {deletingId === recommendation._id ? (
                <div className="w-4 h-4 border-2 m-auto border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </li>
  );

  const activeList =
    activeTab === "pending" ? pendingRecommendations : approvedRecommendations;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Recommendations
      </h1>

      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
            activeTab === "pending"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Pending ({pendingRecommendations?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium ${
            activeTab === "approved"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Approved ({approvedRecommendations?.length ?? 0})
        </button>
      </div>

      {(activeList ?? []).length > 0 ? (
        <ul className="space-y-6">
          {(activeList ?? []).map((rec) => renderRecommendation(rec))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No {activeTab} items.</p>
      )}
    </div>
  );
};

export default RecommendationsList;
