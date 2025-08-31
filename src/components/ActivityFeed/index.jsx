import { useState, useEffect } from "react";
// import { documentsAPI } from '../utils/api';
import { ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
const fakeActivities = [
  {
    _id: "act1",
    title: "How to Integrate Gemini with MERN",
    lastEditedBy: { _id: "user1", name: "Alice Johnson" },
    updatedAt: new Date("2025-08-28T14:32:00"),
  },
  {
    _id: "act2",
    title: "JWT Authentication in Express",
    lastEditedBy: { _id: "user2", name: "Michael Chen" },
    updatedAt: new Date("2025-08-28T10:15:00"),
  },
  {
    _id: "act3",
    title: "Semantic Search with Embeddings",
    lastEditedBy: { _id: "user3", name: "Sophia Lee" },
    updatedAt: new Date("2025-08-27T17:45:00"),
  },
  {
    _id: "act4",
    title: "Document Versioning Strategy",
    lastEditedBy: { _id: "user4", name: "Daniel Kim" },
    updatedAt: new Date("2025-08-27T09:20:00"),
  },
  {
    _id: "act5",
    title: "Team Q&A with Gemini",
    lastEditedBy: { _id: "user5", name: "Emily Davis" },
    updatedAt: new Date("2025-08-26T21:05:00"),
  },
];

const ActivityFeed = ({ activities, loading }) => {
  // const fetchFeed = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BASE_URL
  //       }/api/user/feed?userId=${localStorage.getItem("userId")}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     setActivities(data);
  //   } catch (error) {
  //     console.error("Failed to fetch activity:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchFeed();
  // }, []);
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Team Activity Feed
        </h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">
          Team Activity Feed
        </h3>
      </div>

      {activities?.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">
                    {activity?.updatedBy?.name}
                  </span>{" "}
                  updated <span className="font-medium">{activity?.title}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity?.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
