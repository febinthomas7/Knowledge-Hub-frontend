import { useState, useEffect } from "react";
// import { searchAPI } from '../utils/api';
import Layout from "../../components/Layout";
import DocumentCard from "../../components/DocumentCard";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Search = () => {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("text");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]); // full list

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/search?userId=${localStorage.getItem("userId")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            mode: searchType,
          }),
        }
      );

      const data = await response.json();
      setDocuments(data.results);
      setAllDocuments(data.results);
      const allTags = Array.from(
        new Set(data?.results[0]?.tags.flatMap((doc) => doc))
      )
        .sort(() => 0.5 - Math.random()) // shuffle
        .slice(0, 10); // pick first 10 after shuffle

      setTags(allTags);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleTagToggle = (tagName) => {
    const updatedTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName];

    setSelectedTags(updatedTags);

    if (updatedTags.length > 0) {
      const filtered = allDocuments.filter((doc) =>
        doc.tags.some((tag) => updatedTags.includes(tag))
      );
      setDocuments(filtered);
    } else {
      setDocuments(allDocuments); // restore all
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setDocuments(allDocuments);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Documents</h1>
          <p className="text-gray-600">
            Find documents using text search or AI-powered semantic search
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="  flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search documents..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-black">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="text">Text Search</option>
                  <option value="semantic">AI Semantic</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FunnelIcon className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Search Type Info */}
            <div className="flex items-center text-sm text-gray-600">
              {searchType === "semantic" && (
                <>
                  <SparklesIcon className="h-4 w-4 mr-1 text-indigo-500" />
                  AI semantic search finds documents by meaning, not just
                  keywords
                </>
              )}
              {searchType === "text" && (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Text search looks for exact keyword matches
                </>
              )}
            </div>
          </form>
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Filter by Tags
                </h3>
                {selectedTags?.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {documents?.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Search Results ({documents?.length})
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {documents?.map((document) => (
                <DocumentCard
                  key={document._id}
                  document={document}
                  onDelete={(id) =>
                    setDocuments((docs) => docs.filter((doc) => doc._id !== id))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && documents?.length === 0 && query && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No results found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or using semantic search
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
