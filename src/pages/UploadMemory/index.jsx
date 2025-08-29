import {
  // Upload as UploadIcon,
  Image,
  X,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";

const index = () => {
  const dateRef = useRef();
  const [selectedDate, setSelectedDate] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  // console.log(typeof selectedDate);

  const [album, setAlbum] = useState([]);

  const albums = async () => {
    const res = await fetch(
      `http://localhost:5000/api/user/albums?userId=${localStorage.getItem(
        "userId"
      )}`
    );
    const data = await res.json();
    setAlbum(data.albums);
    console.log("User albums:", data);
  };

  useEffect(() => {
    albums();
  }, []);
  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [20.5937, 78.9629], // India center
      zoom: 5,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadSuccess(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file size is greater than 10MB
      const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > maxSize) {
        handleError("File size should not exceed 10 MB");
        return;
      }

      handleFileSelect(file);
    }
  };

  const handleLocationSearch = async (e) => {
    if (e.key == "Enter" || e.type != "keydown") {
      e.preventDefault();
      if (!selectedLocation.trim()) return;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            selectedLocation
          )}&format=json&limit=1`
        );
        const data = await res.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          setLat(lat);
          setLon(lon);
          const coords = [parseFloat(lat), parseFloat(lon)];

          mapRef.current.setView(coords, 13);

          if (markerRef.current) {
            mapRef.current.removeLayer(markerRef.current);
          }
          markerRef.current = L.marker(coords).addTo(mapRef.current);
        } else {
          alert("Location not found");
        }
      } catch (err) {
        console.error("Location search error:", err);
      }
    }
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    handleLocationSearch(e);
  };

  const clearSelection = (e) => {
    // e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl("");
    // setCaption("");
    // setSelectedLocation("");
    setUploadSuccess(false);
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    mapRef.current.setView([20.5937, 78.9629], 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile); // must match backend field name
      if (caption) formData.append("caption", caption);
      if (selectedLocation) formData.append("location", selectedLocation);
      if (lat) formData.append("lat", lat);
      if (lon) formData.append("lon", lon);
      if (selectedDate) formData.append("date", selectedDate);
      if (newAlbumName) formData.append("title", newAlbumName);
      if (selectedAlbum) formData.append("albumId", selectedAlbum);

      formData.append("id", localStorage.getItem("userId"));

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/upload`,
        {
          method: "POST",
          body: formData, // don't set Content-Type manually
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to upload: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Uploaded successfully:", data);

      setUploadProgress(100);
      setUploadSuccess(true);

      if (selectedAlbum == "new") {
        setAlbum((prev) => [...prev, data.album]);

        // ✅ Automatically select the new album
        setSelectedAlbum(data.album._id);

        // Clear input
        setNewAlbumName("");
      }

      // Wait a bit to show success UI
      setTimeout(() => {
        clearSelection();
        setUploading(false);
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setUploadProgress(0);
      setUploadSuccess(false);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return bytes + " B";
    }
  };

  return (
    <>
      <Navbar />

      <div className=" w-full h-full bg-black flex flex-col  items-center text-black ">
        <ToastContainer />
        <div className=" space-y-8 bg-white mx-4 mt-24 mb-8 px-2 py-10 sm:p-5 rounded-3xl shadow-[#ffffff] shadow-md">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Upload a New Memory
            </h1>
            <p className="text-gray-600">
              Share your precious moments and add them to your memory
              collection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mx-3">
            <form
              onSubmit={handleSubmit}
              className="sm:w-2xl max-w-2xl space-y-6"
            >
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={clearSelection}
                        title="remove"
                        className="absolute -top-2 -right-2 bg-red-500 z-10 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)}
                    </p>{" "}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Image className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drop your image here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full bg-blue-100  h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>

              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Caption (optional)
                </label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell us about this memory..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  disabled={uploading}
                />
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date (optional)
                </label>
                <input
                  id="date"
                  type="date"
                  ref={dateRef}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2 pr-10 rounded w-full"
                />
                <Calendar
                  size={18}
                  className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => dateRef.current.showPicker()} // Open date picker
                />
              </div>

              <div className="relative w-full">
                <label
                  htmlFor="album"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Album *
                </label>

                <select
                  id="album"
                  required
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2 pr-10 rounded w-full"
                >
                  <option value="">Select Album</option>
                  {album?.map((album, index) => (
                    <option key={index} value={album._id}>
                      {album.title}
                    </option>
                  ))}
                  <option value="new">➕ Create New Album</option>
                </select>

                {selectedAlbum === "new" && (
                  <input
                    type="text"
                    placeholder="Enter new album name"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    className="mt-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2 rounded w-full"
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location *
                </label>

                <div className=" flex items-center gap-2 justify-center mb-3">
                  <input
                    id="location"
                    type="text"
                    required
                    placeholder="Search location and press Enter"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    onKeyDown={handleLocationSearch}
                    className=" w-full border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors  rounded-lg p-2"
                  />
                  <button
                    type="submit"
                    onClick={handleSearchClick}
                    className="p-3 rounded-2xl bg-amber-200 cursor-pointer hover:scale-105"
                  >
                    search
                  </button>
                </div>

                <div id="map" className="h-60   mb-3 rounded-lg border"></div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm font-medium text-[#66b73f]">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#66b73f] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Memory uploaded successfully!
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  !selectedFile ||
                  uploading ||
                  !selectedLocation ||
                  !selectedAlbum
                }
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  !selectedFile ||
                  uploading ||
                  !selectedLocation ||
                  !selectedAlbum
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#ff4522] text-white hover:scale-105 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                }`}
              >
                {/* <UploadIcon className="h-4 w-4" /> */}
                <span>{uploading ? "Uploading..." : "Upload Memory"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
