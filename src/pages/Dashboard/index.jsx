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
  const [documents, setDocuments] = useState(fakeDocuments);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    myDocs: 0,
    publicDocs: 0,
  });

  //   useEffect(() => {
  //     fetchDocuments();
  //   }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentsAPI.getAll({ limit: 6 });
      setDocuments(response.data.documents);

      // Calculate stats
      const total = response.data.pagination.total;
      const myDocs = response.data.documents.filter(
        (doc) => doc.createdBy._id === user._id
      ).length;
      const publicDocs = response.data.documents.filter(
        (doc) => doc.isPublic
      ).length;

      setStats({ total, myDocs, publicDocs });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpdate = () => {
    fetchDocuments();
  };

  const handleDocumentDelete = (deletedId) => {
    setDocuments((docs) => docs.filter((doc) => doc._id !== deletedId));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600">
              Manage your knowledge documents and collaborate with your team
            </p>
          </div>
          <Link
            to="/documents/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Document
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

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

            {!loading ? (
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
            ) : documents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first document.
                </p>
                <div className="mt-6">
                  <Link
                    to="/documents/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Document
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {documents.map((document) => (
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
            <ActivityFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
