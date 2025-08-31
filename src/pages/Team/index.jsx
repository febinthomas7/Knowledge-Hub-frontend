import React, { useState } from "react";
import Layout from "../../components/Layout";
import DocumentCard from "../../components/DocumentCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const fakeTeams = [
  {
    _id: "team1",
    name: "Engineering Team",
    role: "admin", // current user's role
    members: [
      {
        user: { _id: "u1", name: "Alice Johnson", email: "alice@example.com" },
        role: "admin",
      },
      {
        user: { _id: "u2", name: "Bob Smith", email: "bob@example.com" },
        role: "user",
      },
      {
        user: { _id: "u3", name: "Sophia Lee", email: "sophia@example.com" },
        role: "user",
      },
    ],
  },
  {
    _id: "team2",
    name: "Marketing Team",
    role: "user", // current user's role
    members: [
      {
        user: { _id: "u2", name: "Bob Smith", email: "bob@example.com" },
        role: "admin",
      },
      {
        user: { _id: "u1", name: "Alice Johnson", email: "alice@example.com" },
        role: "user",
      },
      {
        user: { _id: "u4", name: "Emily Davis", email: "emily@example.com" },
        role: "user",
      },
      {
        user: { _id: "u5", name: "Daniel Kim", email: "daniel@example.com" },
        role: "user",
      },
    ],
  },
  {
    _id: "team3",
    name: "AI Research Team",
    role: "user",
    members: [
      {
        user: { _id: "u6", name: "Michael Chen", email: "michael@example.com" },
        role: "admin",
      },
      {
        user: { _id: "u7", name: "Olivia Brown", email: "olivia@example.com" },
        role: "admin",
      },
      {
        user: { _id: "u1", name: "Alice Johnson", email: "alice@example.com" },
        role: "user",
      },
    ],
  },
];

const fakeDocumentsByTeam = {
  team1: [
    // Engineering Team
    {
      _id: "doc1",
      title: "MERN Stack Setup Guide",
      content: "Step-by-step guide to setting up a MERN stack project.",
      summary: "Quick setup guide for MongoDB, Express, React, and Node.js.",
      tags: ["MERN", "Setup", "Backend", "Frontend"],
      createdBy: { _id: "u1", name: "Alice Johnson" },
      createdAt: new Date("2025-08-20T10:30:00"),
      updatedAt: new Date("2025-08-25T14:15:00"),
      viewCount: 23,
      versions: [
        {
          editedAt: new Date("2025-08-23T11:00:00"),
          editedBy: { name: "Alice Johnson" },
          content: "Updated guide with Tailwind integration.",
        },
      ],
    },
    {
      _id: "doc2",
      title: "API Authentication with JWT",
      content: "How to implement JWT-based authentication in Express.",
      summary: "Learn how to secure your backend with JWT tokens.",
      tags: ["Auth", "JWT", "Express", "Security"],
      createdBy: { _id: "u2", name: "Bob Smith" },
      createdAt: new Date("2025-08-18T09:00:00"),
      updatedAt: new Date("2025-08-21T10:45:00"),
      viewCount: 12,
      versions: [],
    },
    {
      _id: "doc3",
      title: "API Authentication with JWT",
      content: "How to implement JWT-based authentication in Express.",
      summary: "Learn how to secure your backend with JWT tokens.",
      tags: ["Auth", "JWT", "Express", "Security"],
      createdBy: { _id: "u2", name: "Bob Smith" },
      createdAt: new Date("2025-08-18T09:00:00"),
      updatedAt: new Date("2025-08-21T10:45:00"),
      viewCount: 12,
      versions: [],
    },
  ],

  team2: [
    // Marketing Team
    {
      _id: "doc3",
      title: "Social Media Strategy Q3",
      content: "Plan for growing social media presence in Q3.",
      summary: "Outlined strategies for Twitter, LinkedIn, and Instagram.",
      tags: ["Marketing", "Strategy", "Social Media"],
      createdBy: { _id: "u4", name: "Emily Davis" },
      createdAt: new Date("2025-08-10T08:20:00"),
      updatedAt: new Date("2025-08-22T16:10:00"),
      viewCount: 37,
      versions: [
        {
          editedAt: new Date("2025-08-15T12:00:00"),
          editedBy: { name: "Emily Davis" },
          content: "Added TikTok as new platform.",
        },
      ],
    },
  ],

  team3: [
    // AI Research Team
    {
      _id: "doc4",
      title: "Semantic Search with Embeddings",
      content: "Using embeddings + cosine similarity for document search.",
      summary: "Explains semantic search implementation with AI models.",
      tags: ["AI", "Embeddings", "Search", "NLP"],
      createdBy: { _id: "u6", name: "Michael Chen" },
      createdAt: new Date("2025-08-05T15:20:00"),
      updatedAt: new Date("2025-08-25T09:45:00"),
      viewCount: 55,
      versions: [
        {
          editedAt: new Date("2025-08-18T10:00:00"),
          editedBy: { name: "Olivia Brown" },
          content: "Expanded explanation on cosine similarity.",
        },
        {
          editedAt: new Date("2025-08-10T13:00:00"),
          editedBy: { name: "Michael Chen" },
          content: "Initial draft about embeddings.",
        },
      ],
    },
    {
      _id: "doc5",
      title: "Q&A Systems with RAG",
      content: "Retrieval-Augmented Generation for Q&A over knowledge bases.",
      summary: "Guide to building Q&A with embeddings + LLMs.",
      tags: ["AI", "RAG", "Q&A", "Gemini"],
      createdBy: { _id: "u7", name: "Olivia Brown" },
      createdAt: new Date("2025-08-12T14:40:00"),
      updatedAt: new Date("2025-08-22T11:25:00"),
      viewCount: 29,
      versions: [],
    },
  ],
};

const Team = () => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teamId, setTeamId] = useState(0);
  const [teams, setTeams] = useState([]);
  const [email, setEmail] = useState("");

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/my-teams?userId=${localStorage.getItem("userId")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams");

      const data = await response.json();
      setTeams(data); // save in state
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const sendInvite = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/team/${teamId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use auth
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("User invited successfully!");
        e.target.reset();
      } else {
        alert(data.message || "Failed to invite user");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleDocumentDelete = (deletedId) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => ({
        ...team,
        documents: team.documents.filter((doc) => doc._id !== deletedId),
      }))
    );
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/team/${teamId}/member/${memberId}?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to remove member");
        return;
      }

      // Update state locally
      setTeams((prevTeams) =>
        prevTeams.map((t) =>
          t._id === teamId
            ? {
                ...t,
                members: t.members.filter((m) => m.user._id !== memberId),
              }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error removing member");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row gap-6 items-start text-black">
        {/* Teams List - Left Sidebar */}
        <div className="w-full sm:w-64 bg-white shadow rounded-lg p-4  ">
          <h2 className="text-lg font-semibold mb-4">My Teams</h2>
          <ul className="divide-y divide-gray-200">
            {teams?.map((team) => (
              <li
                key={team._id}
                className={`py-2 px-2 cursor-pointer rounded-md hover:bg-gray-50 ${
                  teamId === team._id ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  setTeamId(team._id);
                  localStorage.setItem("role", team.role);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{team.name}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      team.role === "admin"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {team.role}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Team Details + Documents */}
        <div className="flex-1 space-y-6">
          {teamId ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documents
                </h2>

                {/* ✅ Add Document Button */}
                <Link
                  to={`/teams/${teamId}/documents/new`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  + Add Document
                </Link>
              </div>
              {/* Team Details */}

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Team Details</h2>
                {teams
                  ?.filter((t) => t._id === teamId)
                  ?.map((team) => (
                    <div key={team._id}>
                      <p className="font-medium text-gray-900 mb-2">
                        {team.name}
                      </p>
                      <ul className="space-y-2">
                        {team.members.map((m, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border p-2 rounded"
                          >
                            <span>{m.user.name}</span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                m.role === "admin"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {m.role}
                            </span>

                            {/* Show delete option if user is admin */}
                            {team.role === "admin" && m.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handleRemoveMember(team._id, m.user._id)
                                }
                                className="text-red-500 text-xs hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* Only admin can add users */}
                      {team.role === "admin" && (
                        <form onSubmit={sendInvite} className="mt-4 flex gap-2">
                          <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Invite user by email"
                            className="flex-1 border px-3 py-1 rounded-md"
                            required
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
                          >
                            Invite
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
              </div>

              {/* Documents */}
              <div className="grid gap-6">
                {teams
                  ?.find((i) => i._id === teamId) // 👈 find the team by id
                  ?.documents?.map((document, index) => (
                    <DocumentCard
                      key={index}
                      document={document}
                      onUpdate={() => console.log("Update", document._id)}
                      onDelete={handleDocumentDelete}
                    />
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a team to see details</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Team;
