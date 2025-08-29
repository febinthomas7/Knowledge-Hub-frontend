import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { documentsAPI, aiAPI } from "../utils/api";
import Layout from "../../components/Layout";
import { SparklesIcon, TagIcon } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchDocument();
    }
  }, [id, isEditing]);

  const fetchDocument = async () => {
    try {
      const response = await documentsAPI.getById(id);
      const doc = response.data.document;
      setFormData({
        title: doc.title,
        content: doc.content,
        tags: doc.tags || [],
        isPublic: doc.isPublic,
      });
    } catch (error) {
      toast.error("Failed to fetch document");
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

  const handleGenerateAISummary = async () => {
    if (!formData.content) {
      toast.error("Please add content first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiAPI.generateSummary({
        title: formData.title,
        content: formData.content,
      });
      toast.success("AI summary generated!");
      // You could show the summary in a modal or preview area
      console.log("Generated summary:", response.data.summary);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAITags = async () => {
    if (!formData.content) {
      toast.error("Please add content first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiAPI.generateTags({
        title: formData.title,
        content: formData.content,
      });

      const newTags = [...new Set([...formData.tags, ...response.data.tags])];
      setFormData({
        ...formData,
        tags: newTags,
      });
      toast.success("AI tags generated!");
    } catch (error) {
      toast.error("Failed to generate tags");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await documentsAPI.update(id, formData);
        toast.success("Document updated successfully");
      } else {
        await documentsAPI.create(formData);
        toast.success("Document created successfully");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update document" : "Failed to create document"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Document" : "Create New Document"}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Update your document"
              : "Add a new document to your knowledge base"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="block text-sm font-medium text-gray-700 mb-2"
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

            {/* AI Actions */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerateAISummary}
                disabled={aiLoading || !formData.content}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                {aiLoading ? "Generating..." : "Preview AI Summary"}
              </button>

              <button
                type="button"
                onClick={handleGenerateAITags}
                disabled={aiLoading || !formData.content}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                <TagIcon className="h-4 w-4 mr-2" />
                {aiLoading ? "Generating..." : "Generate AI Tags"}
              </button>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Public checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Make this document public (visible to all team members)
                </span>
              </label>
            </div>

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
