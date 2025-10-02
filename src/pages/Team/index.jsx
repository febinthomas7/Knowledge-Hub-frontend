import React, { useState } from "react";
import Layout from "../../components/Layout";
import DocumentCard from "../../components/DocumentCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Team = () => {
  const [teamId, setTeamId] = useState(0);
  const [teams, setTeams] = useState([]);
  const [email, setEmail] = useState("");
  const [teamLoading, setTeamLoading] = useState(true);

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
    } finally {
      setTeamLoading(false);
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
        <div className="w-full sm:w-64 bg-[var(--color-bg-2)] shadow rounded-lg p-4  ">
          <h2 className="text-lg text-[var(--text-color)] font-semibold mb-4">
            My Teams
          </h2>
          <ul className="flex flex-col gap-2 ">
            {teamLoading && (
              <div className=" grid gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-bg-2)] flex gap-1 rounded-lg shadow-sm border border-gray-200 p-3 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 " />
                    {/* <div className="h-3 bg-gray-200 rounded w-full mb-2" /> */}
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            )}

            {teams?.map((team) => (
              <li
                key={team._id}
                className={`py-2 px-2 cursor-pointer rounded-md  ${
                  teamId === team._id
                    ? " bg-[var(--nav-button-active-bg)] text-[var(--nav-button-active-text)] "
                    : " text-[var(--nav-button-text)] hover:bg-[var(--nav-button-hover-bg)] "
                }`}
                onClick={() => {
                  setTeamId(team._id);
                  localStorage.setItem("role", team.role);
                }}
              >
                <div className="flex justify-between items-center text-[var(--text-color)]">
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
        <div className=" w-full space-y-6">
          {teamId ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[var(--text-color)]">
                  Documents
                </h2>

                {/* ✅ Add Document Button */}
                <Link
                  to={`/teams/${teamId}/documents/new`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--text-color)] bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  + Add Document
                </Link>
              </div>
              {/* Team Details */}

              <div className="bg-[var(--color-bg-2)] rounded-lg shadow p-6  text-[var(--nav-button-text)]">
                <h2 className="text-xl font-semibold mb-4">Team Details</h2>
                {teams
                  ?.filter((t) => t._id === teamId)
                  ?.map((team) => (
                    <div key={team._id}>
                      <p className="font-medium  text-[var(--nav-button-text)] mb-2">
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
              <div className="grid grid-cols-1 gap-6">
                {teams
                  ?.find((i) => i._id === teamId) // 👈 find the team by id
                  ?.documents?.map((document, index) => (
                    <DocumentCard
                      key={index}
                      document={document}
                      onDelete={handleDocumentDelete}
                    />
                  ))}
              </div>
            </>
          ) : (
            <p className="text-[var(--text-color)]">
              Select a team to see details
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Team;
