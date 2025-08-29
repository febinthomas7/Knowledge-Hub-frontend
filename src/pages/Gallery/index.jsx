import React, { useEffect, useState } from "react";
// import { useImages } from '../context/ImageContext';
import ImageCard from "../../components/ImageCard";
// import LoadingSpinner from "../components/LoadingSpinner";
import { Images, Upload, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const details = [
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a7435cf89352da0daa12",
    title: "febin",

    updatedAt: "2025-08-20T13:49:45.818Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
  {
    _id: "68a5a82d5cf89352da0daa1e",
    title: "matti",

    updatedAt: "2025-08-20T10:49:47.765Z",
  },
];
const index = () => {
  const [album, setAlbum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // albums per page

  const albums = async (pageNum = 1) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/albums?userId=${localStorage.getItem(
          "userId"
        )}&page=${pageNum}&limit=${limit}`
      );
      const data = await res.json();
      setAlbum(data.albums);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (error) {
      console.log("User albums:", error);
    } finally {
      setLoading(false); // 🔹 stop loading when done
    }
  };

  useEffect(() => {
    albums(page);
  }, [page]);

  return (
    <div className="h-svh bg-black">
      <Navbar />
      <div className="space-y-8 h-auto bg-black text-white flex  flex-col items-center   pt-30 pb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold  mb-4">Your Memory Collection</h1>
          <p className="text-lg px-2 sm:px-0 max-w-2xl mx-auto">
            Capture and preserve your precious moments. Every image tells a
            story.
          </p>
        </div>

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
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-[#ff4522] text-white rounded-lg hover:scale-105 transition-colors shadow-md"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Memory
            </Link>
          </div>
        ) : (
          <div className="w-full px-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {album?.map((image, index) => (
                <ImageCard
                  key={index}
                  image={image}
                  singlePhoto={true}
                  setAlbum={setAlbum}
                  album={album}
                />
              ))}
            </div>
            {totalPages > limit && (
              <div className="flex items-center w-full justify-center space-x-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className={`px-4 py-2 bg-gray-700 rounded disabled:opacity-50 ${
                    page !== 1 ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className={`px-4 py-2 bg-gray-700 rounded disabled:opacity-50 ${
                    page !== totalPages
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
