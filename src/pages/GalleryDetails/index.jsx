import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageCard from "../../components/ImageCard";
import { FaArrowLeft } from "react-icons/fa";
import { Images, Upload, Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";

// const details = [
//   {
//     _id: "68a5a7435cf89352da0daa12",
//     title: "febin",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686721/memory-map/file_y5lphm.jpg",
//     updatedAt: "2025-08-20T13:49:45.818Z",
//   },
//   {
//     _id: "68a5a82d5cf89352da0daa1e",
//     title: "matti",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686955/memory-map/file_jmtorc.jpg",
//     updatedAt: "2025-08-20T10:49:47.765Z",
//   },
//   {
//     _id: "68a5a7435cf89352da0daa12",
//     title: "febin",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686721/memory-map/file_y5lphm.jpg",
//     updatedAt: "2025-08-20T13:49:45.818Z",
//   },
//   {
//     _id: "68a5a82d5cf89352da0daa1e",
//     title: "matti",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686955/memory-map/file_jmtorc.jpg",
//     updatedAt: "2025-08-20T10:49:47.765Z",
//   },
//   {
//     _id: "68a5a7435cf89352da0daa12",
//     title: "febin",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686721/memory-map/file_y5lphm.jpg",
//     updatedAt: "2025-08-20T13:49:45.818Z",
//   },
//   {
//     _id: "68a5a82d5cf89352da0daa1e",
//     title: "matti",
//     coverImage:
//       "https://res.cloudinary.com/dpoarajtk/image/upload/v1755686955/memory-map/file_jmtorc.jpg",
//     updatedAt: "2025-08-20T10:49:47.765Z",
//   },
// ];
const index = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // /album/:id
  // console.log(id);

  const fetchAlbum = async (albumId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/albums/${albumId}?userId=${localStorage.getItem("userId")}`
      );
      const data = await res.json();
      setAlbum(data.memories);
    } catch (error) {
      console.log("Single album:", data);
    } finally {
      setLoading(false); // 🔹 stop loading when done
    }
  };

  useEffect(() => {
    fetchAlbum(id);
  }, []);
  return (
    <div className="h-svh bg-black relative">
      <Link to="/gallery" className="fixed left-5 top-8 text-3xl">
        <FaArrowLeft />
      </Link>
      <ToastContainer />
      <div className="space-y-8 h-auto bg-black flex  flex-col items-center   pt-22 pb-6">
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        )}
        {!loading && album?.length == 0 ? (
          <div className="text-center px-2 sm:px-0 py-16">
            <Images className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No memories yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start uploading your favorite images to create your memory map.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Memory
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 px-3 gap-6">
            {album?.map((image, index) => (
              <ImageCard
                key={index}
                image={image}
                singlePhoto={false}
                setAlbum={setAlbum}
                album={album}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
