import { useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { documentsAPI, aiAPI } from '../utils/api';
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
// import toast from 'react-hot-toast';

const DocumentCard = ({ document, onUpdate, onDelete }) => {
  //   const { user } = useAuth();
  const user = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/document?docId=${docId}&userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if auth needed
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      onDelete(docId);

      alert("Document deleted successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Error deleting document ❌");
    }
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    // try {
    //   const response = await aiAPI.generateSummary({
    //     title: document.title,
    //     content: document.content,
    //   });

    //   await documentsAPI.update(document._id, {
    //     summary: response.data.summary,
    //   });

    //   toast.success("Summary generated successfully");
    //   onUpdate?.();
    // } catch (error) {
    //   toast.error("Failed to generate summary");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleGenerateTags = async () => {
    setLoading(true);
    // try {
    //   const response = await aiAPI.generateTags({
    //     title: document.title,
    //     content: document.content,
    //   });

    //   const newTags = [...new Set([...document.tags, ...response.data.tags])];

    //   await documentsAPI.update(document._id, { tags: newTags });

    //   toast.success("Tags generated successfully");
    //   onUpdate?.();
    // } catch (error) {
    //   toast.error("Failed to generate tags");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              to={`/teams/documents/${document._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {document.title}
            </Link>
            <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {document.updatedBy.name}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(document.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Edit + Delete */}
          <div className="flex space-x-2">
            {(localStorage.getItem("role") === "admin" ||
              user === document.createdBy._id) && (
              <>
                <Link
                  to={`/teams/documents/${document._id}/edit`}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(document._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* content */}
        {document.content && (
          <p className="text-gray-600 mb-4 line-clamp-3">{document.content}</p>
        )}

        {/* Summary */}
        {/* {document.summary && (
          <p className="text-gray-600 mb-4 line-clamp-3">{document.summary}</p>
        )} */}

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex items-center mb-4">
            <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
            <div className="flex flex-wrap gap-2">
              {document.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
              {document.tags.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{document.tags.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {/* <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="h-3 w-3 mr-1" />
            {loading ? "Generating..." : "Summarize with Gemini"}
          </button>

          <button
            onClick={handleGenerateTags}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <TagIcon className="h-3 w-3 mr-1" />
            {loading ? "Generating..." : "Generate Tags"}
          </button> */}

          {document.versions && document.versions.length > 0 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <DocumentTextIcon className="h-3 w-3 mr-1" />
              History ({document.versions.length})
            </button>
          )}
        </div>

        {/* Version History Modal */}
        {showVersions && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
                onClick={() => setShowVersions(false)}
              />
              <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Version History
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {document?.versions?.map((version, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-indigo-200 pl-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            Version {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(version.editedAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Edited by {version.editedBy?.name || "Unknown"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
