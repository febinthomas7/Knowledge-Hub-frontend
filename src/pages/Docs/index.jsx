import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  File,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  FileSpreadsheet,
  // FilePresentation,
  Plus,
} from "lucide-react";

import Layout from "../../components/Layout";

const Docs = () => {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docs, setDocs] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    // Replace with your API
    fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/user/docs?userId=${localStorage.getItem("userId")}`
    )
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", localStorage.getItem("name")); // optional user field
    formData.append("userId", localStorage.getItem("userId"));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/doc-upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedFile(data.doc);
      setDocs((prev) => [...prev, data.doc]);
      setFile(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setLoading(false);
    }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Remove from frontend state
        setDocs((prev) => prev.filter((d) => d.gridfsId !== id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File className="w-8 h-8 text-gray-500" />;
    const type = fileType.toLowerCase();
    if (type.includes("doc"))
      return <FileText className="w-8 h-8 text-blue-500" />;

    // Excel Sheets
    if (type.includes("xls"))
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;

    // PowerPoint
    if (type.includes("ppt"))
      return <FileText className="w-8 h-8 text-orange-500" />;

    // PDF
    if (type.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-500" />;

    // Default
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <File className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black   mb-4">
            Document Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload, organize, and manage your documents with ease. Drag and drop
            files or click to browse.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-16">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Upload New Document
              </h2>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,
          .doc,
          .docx,
          .xls,
          .xlsx,
          .ppt,
          .pptx,
          .odt,
          .ods,
          .odp,
          .txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />

              <div className="space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    file ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  {file ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Upload className="w-8 h-8 text-blue-600" />
                  )}
                </div>

                {file ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-green-700">
                      File Selected
                    </p>
                    <p className="text-gray-700 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-700">
                      Drag and drop your file here, or{" "}
                      <span className="text-blue-600">click to browse</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx,
                      .odt, .ods, .odp, .txt
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex-1">
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : file
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Upload Document"
                )}
              </button>
            </div>

            {uploadedFile && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-1">
                      Upload Successful!
                    </p>
                    <p className="text-green-700">{uploadedFile.filename}</p>
                  </div>
                  <Link
                    to={`/doc/${uploadedFile.gridfsId}?fieldId=${uploadedFile.filename}&type=${uploadedFile.fileType}`}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View Document
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <File className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Documents
            </h2>
            <div className="hidden sm:flex-1 sm:flex h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {docs.length} {docs.length === 1 ? "doc" : "docs"}
            </div>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <File className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No documents yet
              </h3>
              <p className="text-gray-600">
                Upload your first document to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {docs.map((doc, index) => (
                <div
                  key={doc._id}
                  className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <button
                        onClick={() => deleteDoc(doc.gridfsId)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {doc.filename}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-3">
                    <Link
                      to={`/doc/${doc.gridfsId}?fieldId=${doc.filename}&type=${doc.fileType}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Eye className="w-4 h-4" />
                      View & Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Docs;
