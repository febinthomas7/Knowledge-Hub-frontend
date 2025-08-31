import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { documentsAPI } from "../utils/api";
import Layout from "../../components/Layout";
import DocumentCard from "../../components/DocumentCard";
import ActivityFeed from "../../components/ActivityFeed";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
const fakeDocuments = [
  {
    _id: "doc1",
    title: "How to Integrate Gemini with MERN",
    content:
      "This document explains how to use Gemini API for summarization and tagging in a MERN stack app.",
    summary:
      "Guide to integrating Gemini API with a MERN app for AI-powered summaries and tags.",
    tags: ["AI", "Gemini", "MERN", "Summarization", "Tags", "Q&A"],
    createdBy: { _id: "user1", name: "Alice Johnson" },
    createdAt: new Date("2025-08-01T10:30:00"),
    updatedAt: new Date("2025-08-20T14:15:00"),
    viewCount: 42,
    versions: [
      {
        editedAt: new Date("2025-08-15T12:00:00"),
        editedBy: { name: "Bob Smith" },
      },
      {
        editedAt: new Date("2025-08-10T09:30:00"),
        editedBy: { name: "Alice Johnson" },
      },
    ],
  },
  {
    _id: "doc2",
    title: "JWT Authentication in Express",
    content:
      "Step-by-step guide to implementing JWT authentication in a Node.js + Express backend.",
    summary: "Learn how to secure APIs with JWT in an Express server.",
    tags: ["Auth", "JWT", "Express", "Node.js", "Security"],
    createdBy: { _id: "user2", name: "Michael Chen" },
    createdAt: new Date("2025-07-18T09:00:00"),
    updatedAt: new Date("2025-07-19T11:45:00"),
    viewCount: 18,
    versions: [
      {
        editedAt: new Date("2025-07-19T11:45:00"),
        editedBy: { name: "Michael Chen" },
      },
    ],
  },
  {
    _id: "doc3",
    title: "Semantic Search with Embeddings",
    content:
      "Explanation of how to use embeddings and cosine similarity to implement semantic search.",
    summary:
      "Use embeddings + cosine similarity to find meaning-based matches instead of keyword matches.",
    tags: ["Search", "Embeddings", "AI", "Cosine Similarity"],
    createdBy: { _id: "user3", name: "Sophia Lee" },
    createdAt: new Date("2025-08-05T15:20:00"),
    updatedAt: new Date("2025-08-05T15:20:00"),
    viewCount: 33,
    versions: [],
  },
];

const Dashboard = () => {
  //   const { user } = useAuth();
  const user = "";
  const [documents, setDocuments] = useState();
  const [feedLoading, setFeedLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [teamLoading, setTeamLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFeed = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/feed?userId=${localStorage.getItem("userId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleDocumentUpdate = () => {
    // fetchDocuments();
  };

  const handleDocumentDelete = (deletedId) => {
    setActivities((docs) => docs.filter((doc) => doc._id !== deletedId));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/create-team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
          body: JSON.stringify({
            name: teamName,
            userId: localStorage.getItem("userId"), // store userId at login
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();
      setSuccess("Team created successfully!");
      console.log("Created Team:", data);

      setTeamName(""); // reset input
    } catch (err) {
      setError(err.message);
    } finally {
      setTeamLoading(false);
    }
  };
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || localStorage.getItem("name")}
            </h1>
            <p className="text-gray-600">
              Manage your knowledge documents and collaborate with your team
            </p>
          </div>
          {/* <Link
            to="/team"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Team
          </Link> */}
        </div>

        <form onSubmit={handleCreateTeam} className="space-y-4">
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-black"
            required
          />
          <button
            type="submit"
            disabled={teamLoading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {teamLoading ? "Creating..." : "Create Team"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.myDocs}
                </p>
                <p className="text-sm text-gray-600">My Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.publicDocs}
                </p>
                <p className="text-sm text-gray-600">Public Documents</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Documents
              </h2>
              <Link
                to="/search"
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                View all →
              </Link>
            </div>

            {feedLoading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : activities?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to create a team before adding documents.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {activities?.map((document) => (
                  <DocumentCard
                    key={document._id}
                    document={document}
                    onUpdate={handleDocumentUpdate}
                    onDelete={handleDocumentDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActivityFeed loading={feedLoading} activities={activities} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
