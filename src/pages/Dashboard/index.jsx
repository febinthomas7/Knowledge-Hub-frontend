import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { documentsAPI } from "../utils/api";
import Layout from "../../components/Layout";
import DocumentCard from "../../components/DocumentCard";
import ActivityFeed from "../../components/ActivityFeed";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  //   const { user } = useAuth();
  const user = "";
  const [feedLoading, setFeedLoading] = useState(true);
  const [activities, setActivities] = useState([]);

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
            <h1 className="text-2xl font-bold text-[var(--text-color)]">
              Welcome back, {user?.name || localStorage.getItem("name")}
            </h1>
            <p className="text-[var(--text-color-2)]">
              Manage your knowledge documents and collaborate with your team
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateTeam} className="space-y-4">
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-[var(--text-color)]"
            required
          />
          <button
            type="submit"
            disabled={teamLoading}
            className="w-full py-2 px-4  cursor-pointer bg-[var(--button-bg)] text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {teamLoading ? "Creating..." : "Create Team"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents */}
          <div className=" lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[var(--text-color)]">
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
              <div className=" grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : activities?.length === 0 ? (
              <div className="text-center py-12 bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-[var(--text-color)]">
                  No documents
                </h3>
                <p className="mt-1 text-sm text-[var(--text-color-2)]">
                  You need to create a team before adding documents.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activities?.map((document) => (
                  <DocumentCard
                    key={document._id}
                    document={document}
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
