import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { SparklesIcon, TagIcon } from "@heroicons/react/24/outline";

const DocumentForm = () => {
  const { id, teamId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    summary: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiTagLoading, setTagAiLoading] = useState(false);
  const [aiSummaryLoading, setSummaryAiLoading] = useState(false);

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchDocument();
    }
  }, [id, isEditing]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/document?teamId=${teamId}&docId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const doc = data.document;

      setFormData({
        title: doc.title,
        content: doc.content,
        tags: doc.tags || [],
        summary: doc.summary,
      });
      // setFormData(fakeDocument);
    } catch (error) {
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (
      tagInput.trim() &&
      !formData.tags.includes(tagInput.trim().toLowerCase())
    ) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleGenerateAISummary = async (e) => {
    e.preventDefault();

    setSummaryAiLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/get-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
          }),
        }
      );

      const data = await response.json();
      setFormData({
        ...formData,
        summary: data.summary,
      });
      console.log("Generated summary:", data.summary);
    } catch (error) {
      console.log(error);
      // toast.error("Failed to generate summary");
    } finally {
      setSummaryAiLoading(false);
    }
  };

  const handleGenerateAITags = async () => {
    console.log("✅ function triggered"); // this prints, good

    setTagAiLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/get-tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: formData.content,
          }),
        }
      );

      const data = await response.json();
      const newTags = [...new Set([...formData.tags, ...data.tags])];
      setFormData({
        ...formData,
        tags: newTags,
      });
      // toast.success("AI tags generated!");
    } catch (error) {
      // toast.error("Failed to generate tags");
    } finally {
      setTagAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isEditing) {
        // Update existing document
        response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/user/document/${id}?userId=${localStorage.getItem("userId")}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Create new document

        response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/user/document?team=${teamId}&userId=${localStorage.getItem(
            "userId"
          )}&role=${localStorage.getItem("role")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Server error");
      }

      // toast.success(
      //   isEditing ? "Document updated successfully" : "Document created successfully"
      // );
      navigate("/dashboard");
    } catch (error) {
      // toast.error(
      //   isEditing ? "Failed to update document" : "Failed to create document"
      // );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-[var(--text-color)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-color)]">
            {isEditing ? "Edit Document" : "Create New Document"}
          </h1>
          <p className="text-[var(--text-color-2)]">
            {isEditing
              ? "Update your document"
              : "Add a new document to your knowledge base"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className=" bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[var(--text-color-2)] mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter document title"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-[var(--text-color)] mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your document content here..."
              />
            </div>

            {/* Tags */}
            {isEditing && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateAITags}
                  disabled={aiTagLoading || !formData.content}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <TagIcon className="h-4 w-4 mr-2" />
                  {aiTagLoading ? "Generating..." : "Generate AI Tags"}
                </button>
              </div>
            )}

            {isEditing && (
              <div className="mb-6">
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-[var(--text-color)] mb-2"
                >
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  required
                  rows={12}
                  value={formData.summary}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write your document summary here..."
                />
              </div>
            )}

            {isEditing && (
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={aiSummaryLoading || !formData.content}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {aiSummaryLoading ? "Generating..." : "Generate AI Summary"}
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Document"
                  : "Create Document"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DocumentForm;
