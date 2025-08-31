import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { documentsAPI } from '../utils/api';
import Layout from "../../components/Layout";
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //   const { user } = useAuth();
  const user = "";
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/document?docId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams");

      const data = await response.json();
      setDocument(data.document);
    } catch (error) {
      // toast.error("Failed to fetch document");
      // navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Document not found
          </h3>
        </div>
      </Layout>
    );
  }

  const canEdit =
    document.createdBy._id === localStorage.getItem("userId") ||
    document.createdByRole === localStorage.getItem("role");
  console.log(document);
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </button>

          {canEdit && (
            <Link
              to={`/teams/documents/${document._id}/edit`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Link>
          )}
        </div>

        {/* Document */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {document.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                Created by {document.createdBy.name}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(document.createdAt).toLocaleDateString()}
              </div>
              {document.updatedAt !== document.createdAt && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Updated {new Date(document.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center mt-4">
                <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {document.summary && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  AI Summary
                </h3>
                <p className="text-blue-800 text-sm">{document.summary}</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="prose max-w-none">
              {document.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Version History */}
          {document.versions && document.versions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Version History
              </h3>
              <div className="space-y-2">
                {document.versions.slice(0, 3).map((version, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      Version {document.versions.length - index} by{" "}
                      {version.editedBy?.name}
                    </span>
                    <span className="text-gray-500">
                      {new Date(version.editedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {document.versions.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{document.versions.length - 3} more versions
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentView;
