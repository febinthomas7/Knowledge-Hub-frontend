import { useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { documentsAPI, aiAPI } from '../utils/api';
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { deleteDoc } from "../../api/user";
import { handleSuccess } from "../../utils";
// import toast from 'react-hot-toast';

const DocumentCard = ({ document, onDelete }) => {
  const user = localStorage.getItem("userId");
  const [showVersions, setShowVersions] = useState(false);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const credentials = { docId, user };
      const data = await deleteDoc(credentials);

      onDelete(docId);

      handleSuccess(data.message || "Document deleted successfully");
    } catch (error) {
      console.error(error);
      handleDelete("Error deleting document");
    }
  };

  return (
    <div className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              to={`/teams/documents/${document._id}`}
              className="text-lg font-semibold text-[var(--text-color)] hover:text-indigo-600 transition-colors"
            >
              {document.title}
            </Link>
            <div className="flex items-center mt-2 text-sm text-[var(--text-color-2)] space-x-4">
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
            {document?.permissions?.some(
              (member) => member.userId === user
            ) && (
              <>
                <Link
                  to={`/teams/documents/${document._id}/edit`}
                  className="text-[var(--icon-color)] hover:text-[var(--edit-hover-color)] transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(document._id)}
                  className="text-[var(--icon-color)] cursor-pointer hover:text-[var(--delete-hover-color)] transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* content */}
        {document.content && (
          <p className=" text-[var(--text-color-2)] mb-4 line-clamp-3">
            {document.content}
          </p>
        )}

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex items-center mb-4">
            <TagIcon className="h-4 w-4 text-[var(--text-color-2)] mr-2" />
            <div className="flex flex-wrap gap-2">
              {document.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  bg-[var(--nav-button-active-bg)] text-[var(--nav-button-active-text)]"
                >
                  {tag}
                </span>
              ))}
              {document.tags.length > 5 && (
                <span className="text-xs text-[var(--text-color-2)]">
                  +{document.tags.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {document.versions && document.versions.length > 0 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[var(--text-color-2)] bg-[var(--nav-button-hover-bg)]  rounded-md  transition-colors"
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
                className="fixed inset-0 bg-[#00000087]"
                onClick={() => setShowVersions(false)}
              />
              <div className="relative bg-[var(--color-bg-2)] rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-[var(--text-color)]">
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
                          <p className="text-sm font-medium text-[var(--text-color)]">
                            Version {index + 1}
                          </p>
                          <p className="text-xs text-[var(--nav-button-text)]">
                            {new Date(version.editedAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-[var(--nav-button-text)] mt-1">
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
