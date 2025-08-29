import { Calendar, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
// import { FiMoreVertical } from "react-icons/fi";
import { FaDotCircle } from "react-icons/fa";
import { handleError, handleSuccess } from "../../utils";

const index = ({ image, singlePhoto, setAlbum, album }) => {
  const [isOpen, setIsOpen] = useState(false); // for view modal
  const [isEditOpen, setIsEditOpen] = useState(false); // for edit modal
  const [isEditAlbumOpen, setIsEditAlbumOpen] = useState(false); // for edit modal
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editImage, setEditImage] = useState(image);
  const [editAlbum, setEditAlbum] = useState(image);

  const dateRef = useRef();

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", editImage.caption);
      formData.append("date", editImage.date);

      // If a new image was selected
      if (editImage.newFile) {
        formData.append("image", editImage.newFile);
      }

      // Replace with your backend API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/memory/${image._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      const data = await response.json();

      // Update UI with backend response
      setAlbum((prevImages) =>
        prevImages.map((img) =>
          img._id === image._id ? data.updatedImage || data : img
        )
      );
    } catch (error) {
      console.error("Error updating image:", error);
    } finally {
      setLoading(false);
      setIsEditOpen(false);
    }
  };

  // Delete function
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/memory/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }
      const data = await response.json();

      // Remove deleted image from local state
      setAlbum((prevImages) => prevImages.filter((img) => img._id !== id));

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      alert("Failed to delete image");
    }
  };

  const handleEditAlbum = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/album/${image._id}`,
        {
          method: "PUT", // Use PUT for update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editAlbum.title, // send updated title
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update album");
      }

      const data = await response.json();
      setAlbum((prevImages) =>
        prevImages.map((img) =>
          img._id === image._id ? data.updatedAlbum || data : img
        )
      );
      // Update UI with backend response
      // console.log("Album updated:", data);
      setIsEditAlbumOpen(false);
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  const handleDeleteAlbum = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/album/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }

      // Remove deleted image from local state
      setAlbum((prevImages) => prevImages.filter((img) => img._id !== id));

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      alert("Failed to delete image");
    }
  };

  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-teal-200",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      {singlePhoto ? (
        <div className="relative inline-block">
          {/* Card with Link */}
          <Link to={image._id}>
            <div
              className={`rounded-xl hover:scale-105 relative select-none shadow-xs overflow-hidden transition duration-300 ${getRandomColor()}`}
            >
              {/* 3 dots menu button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // stops Link navigation
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                className="absolute right-2 top-2 p-1 bg-black cursor-pointer rounded-full hover:bg-black/10  shadow"
              >
                <FaDotCircle size={18} />
              </button>

              <div className="w-50 h-50 text-black font-bold text-3xl flex justify-center items-center">
                <h1 className="text-center capitalize">{image.title}</h1>
              </div>
            </div>
          </Link>

          {isEditAlbumOpen && (
            <div className=" rounded-xl w-50 h-50 flex items-center bg-white absolute top-0 left-0">
              <div
                onClick={() => setIsEditAlbumOpen(false)}
                className="absolute top-3 right-3 cursor-pointer hover:scale-105 bg-black py-1 px-3 rounded-full"
              >
                ✕
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditAlbum(); // update logic
                }}
                className="space-y-4 text-black p-4"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Caption
                  </label>
                  <input
                    value={editAlbum.title}
                    onChange={(e) =>
                      setEditAlbum({ ...editAlbum, title: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute top-8 right-2  bg-white shadow-md rounded-lg overflow-hidden text-sm z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  setIsEditAlbumOpen(true);
                }}
                className="block w-full px-4 py-2 cursor-pointer text-green-500 hover:bg-gray-100 text-left"
              >
                ✏️ Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  handleDeleteAlbum(image._id);
                }}
                className="block w-full px-4 py-2 cursor-pointer hover:bg-gray-100 text-left text-red-600"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-[#f9f9f9] rounded-2xl w-[260px] shadow-lg overflow-hidden relative">
            <div className="p-4 space-y-2">
              {/* Title */}
              {image.location && (
                <h3 className="font-bold capitalize text-start text-gray-900 text-base">
                  {image.location}
                </h3>
              )}

              {/* Date */}
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {" "}
                  {new Date(image.updatedAt || image.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 text-sm font-medium rounded-lg hover:scale-105 bg-black absolute right-3 top-5 cursor-pointer"
            >
              View
            </button>

            {/* Photo */}
            {/* <div className="aspect-square overflow-hidden">
              <img
                src={image.url}
                alt={image.title || "memory"}
                className="w-full h-full object-cover"
              />
            </div> */}
            <div className="aspect-square overflow-hidden">
              <img
                id={`img-${image._id}`} // give each img an id
                src={image.coverImage || image.url}
                alt={image.title || "memory"}
                loading="lazy"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  const img = document.getElementById(`img-${image._id}`);
                  if (!img) return;

                  // Create canvas to extract image data
                  const canvas = document.createElement("canvas");
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0);

                  // Convert to blob and trigger download
                  canvas.toBlob((blob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = image.title || "memory.png";
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }, "image/png");
                }}
                className=" mx-auto mt-2 px-4 py-2 bg-[#20aaf1] text-white rounded-lg hover:scale-105 cursor-pointer"
              >
                Download
              </button>
            </div>

            <div className="p-4 space-y-2">
              {/* Caption / Description */}
              <p className="text-gray-700 text-start text-sm line-clamp-3">
                {" "}
                {image.title || image.caption}
              </p>

              {/* Buttons */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-black cursor-pointer hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="px-3 py-1 cursor-pointer text-sm font-medium rounded-lg bg-[#ff2222] text-white hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg h-[60%]  w-[85%] sm:w-[40%] p-6 relative overflow-auto scrollbar-hide">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-black hover:scale-105 cursor-pointer "
                >
                  ✕
                </button>

                {/* Modal Content */}

                <img
                  src={image.coverImage || image.url}
                  alt={image.title}
                  className="w-full h-70 object-contain rounded-lg mb-4 bg-black"
                />
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold mb-2 capitalize text-black">
                    {image.location}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(
                      image.updatedAt || image.date
                    ).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-gray-700  ">{image.caption}</p>
              </div>
            </div>
          )}

          {isEditOpen && (
            <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg h-[60%] w-[40%] p-6 relative overflow-auto scrollbar-hide">
                {/* Close Button */}
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-black hover:scale-105 cursor-pointer"
                >
                  ✕
                </button>

                {/* Edit Modal Content */}
                <h2 className="text-xl font-bold mb-4 text-black">Edit</h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit(); // update logic
                  }}
                  className="space-y-4 text-black"
                >
                  {/* Image Preview */}
                  <img
                    src={editImage.url}
                    alt={editImage.title}
                    className="w-full h-52 object-contain rounded-lg mb-2 bg-black"
                  />

                  {/* Upload New Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload New Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // check size (10 MB = 10 * 1024 * 1024)
                          if (file.size > 10 * 1024 * 1024) {
                            // alert("File size must be less than 10 MB");
                            handleError("File size should not exceed 10 MB");

                            e.target.value = "";
                            return; // stop execution
                          }

                          const previewUrl = URL.createObjectURL(file);
                          setEditImage({
                            ...editImage,
                            url: previewUrl,
                            newFile: file,
                          });
                        }
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Caption
                    </label>
                    <textarea
                      value={editImage.caption}
                      onChange={(e) =>
                        setEditImage({ ...editImage, caption: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      rows={3}
                    />
                  </div>
                  {/* date */}
                  <div className="relative">
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
                      value={editImage.date}
                      onChange={(e) =>
                        setEditImage({ ...editImage, date: e.target.value })
                      }
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2 pr-10 rounded w-full"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => dateRef.current.showPicker()} // Open date picker
                    />
                  </div>
                  {/* Save Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center ">
                        <Loader2 className="animate-spin h-12 w-12 text-black" />
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default index;
