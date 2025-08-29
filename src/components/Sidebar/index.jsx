import { useState, useContext } from "react";
import { Watch } from "../../Context";
import { Link } from "react-router-dom";
import { Images, Upload, Loader2 } from "lucide-react";

const index = ({ memories, mapRef, loading }) => {
  const [isLoggedIN, setIsLoggedIn] = useState(localStorage.getItem("token"));
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModel = (item) => {
    setSelectedMemory(item);
    setIsOpen(true);
  };
  return (
    <aside className=" w-full h-svh sm:w-90 gap-3 sm:h-full bg-white text-black  p-4 relative  items-center flex flex-col shadow-md shadow-[#000000]">
      <div className="flex justify-center gap-2 items-center absolute z-10 bg-white w-full top-0 h-15 sm:h-20">
        <h1 className="font-bold text-2xl">Memories</h1>{" "}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo([20, 77], 5, { animate: true, duration: 1 });
            }
          }}
          title="refresh map"
          className=" cursor-pointer   hover:scale-105 "
        >
          🔄
        </button>
      </div>
      <div className="w-full flex flex-col pt-15 sm:pt-20 h-full  overflow-y-auto scrollbar-hide  px-2 pb-20 items-start gap-2">
        {loading && (
          <div className=" w-full flex justify-center items-center py-16">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        )}
        {!loading && memories.length == 0 ? (
          <div className="w-full text-center py-16">
            <Images className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No memories yet
            </h3>
          </div>
        ) : (
          memories?.map((item, i) => {
            const isoDate = item.date;
            const date = new Date(isoDate);

            const day = date.getDate();
            const month = date.toLocaleString("en-US", { month: "short" });

            const formatted = `${day} ${month}`;
            // console.log(formatted);
            return (
              <div
                key={i}
                onClick={() => openModel(item)}
                className="flex p-2 w-full border-1 cursor-pointer  border-white bg-[#fff3e4b1] gap-2 font-semibold  rounded-2xl shadow-md shadow-[#e4a784] hover:opacity-90 transition-opacity duration-300"
              >
                <img
                  className="h-12 w-12 rounded-2xl object-cover"
                  src={item.url || "park.webp"}
                  alt=""
                />

                <div className="w-[calc(100%-3rem)]">
                  <h1 className="font-bold truncate" title={item.caption}>
                    {item.caption}
                  </h1>
                  <span className="flex  w-full  items-center gap-2 relative">
                    {" "}
                    <h2 className=" text-start truncate" title={item.location}>
                      {item.location}
                    </h2>{" "}
                    <h2 className="text-gray-500 text-xs absolute right-0">
                      {formatted}
                    </h2>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className=" absolute bottom-0 h-15 w-full flex justify-center items-center bg-white">
        {isLoggedIN ? (
          <Link
            to="/upload"
            className="border-1  border-white cursor-pointer bg-[#ff4522] text-white font-semibold py-2 px-6 rounded-2xl shadow-md shadow-[#e4a784] hover:opacity-90 transition-opacity duration-300"
          >
            + Add To Memory
          </Link>
        ) : (
          <Link
            to="/login"
            className="border-1 border-white cursor-pointer bg-[#ff4522] text-white font-semibold py-2 px-6 rounded-2xl shadow-md shadow-[#e4a784] hover:opacity-90 transition-opacity duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-4 relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 cursor-pointer px-2 shadow-2xl shadow-amber-400 bg-white rounded-full text-gray-600 hover:text-red-500"
            >
              ✖
            </button>

            {/* Image */}
            <img
              src={selectedMemory?.url || "park.webp"}
              alt=""
              className="w-full h-48 object-cover rounded-lg select-none"
            />

            {/* Title & date */}
            <h2 className="text-xl font-bold mt-3">
              {selectedMemory?.location || "Walk"}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedMemory?.date
                ? new Date(selectedMemory.date).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Aug 16"}
            </p>

            {/* Description */}
            <p className="mt-2 text-gray-700">
              {selectedMemory?.caption || "A wonderful memory at the park."}
            </p>

            {/* Locate buttons */}
            <div className="mt-4 flex flex-col gap-2">
              {/* Locate on App Map */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (mapRef.current) {
                    mapRef.current.flyTo(
                      [selectedMemory.lat, selectedMemory.lon],
                      15,
                      {
                        animate: true,
                        duration: 1,
                      }
                    );
                  }
                }}
                className="px-4 py-2 cursor-pointer rounded-lg bg-amber-400 text-white font-semibold hover:bg-amber-500 shadow-md"
              >
                🗺 Locate on Map
              </button>

              {/* Locate on Google Maps */}
              <a
                href={`https://www.google.com/maps?q=${selectedMemory.lat},${selectedMemory.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md text-center"
              >
                🌍 Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default index;
