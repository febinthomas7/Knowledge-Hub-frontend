import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import { FaMapMarkerAlt } from "react-icons/fa";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FitBounds({ locations }) {
  const map = useMap();
  if (locations?.length) {
    const bounds = locations.map((loc) => [loc.lat, loc.lon]);
    map.fitBounds(bounds);
  }
  return null;
}

const index = () => {
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const memories = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/memories?userId=${localStorage.getItem(
          "userId"
        )}`
      );
      const data = await res.json();
      setLocations(data.memories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    // console.log("User memories:", data?.memories);
  };

  useEffect(() => {
    memories();
  }, []);
  const jitter = (value) => value + (Math.random() - 0.5) * 0.001;

  // console.log(mapRef.current);
  return (
    <>
      <Navbar />
      <div className="h-full sm:h-svh w-full  bg-black pt-25 pb-8 px-4">
        {/* Content */}

        <div className="w-full h-full border-2 border-white flex flex-col sm:flex-row rounded-3xl bg-amber-200 overflow-hidden ">
          {/* Sidebar */}
          <Sidebar memories={locations} mapRef={mapRef} loading={loading} />

          {/* Map */}
          <main className="w-full h-70 sm:h-full z-10  ">
            <MapContainer
              center={[20, 77]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {locations?.length > 0 &&
                locations?.map(
                  (loc, i) =>
                    loc.lat &&
                    loc.lon && (
                      <Marker
                        key={i}
                        position={[jitter(loc.lat), jitter(loc.lon)]}
                      >
                        <Popup>
                          <div className="text-center w-30  bg-[#fee0cb]  rounded-lg ">
                            {/* Image */}
                            <img
                              src={loc.url}
                              alt={loc.caption}
                              className="w-full h-28 object-cover rounded-md mb-1"
                            />

                            {/* Caption */}
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">
                              {loc.caption}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center justify-center text-xs text-gray-600 mb-1">
                              <FaMapMarkerAlt className="text-red-500 mr-1" />
                              <span>{loc.location}</span>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-gray-400">
                              {new Date(loc.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                )}
              {locations?.length > 0 && <FitBounds locations={locations} />}
            </MapContainer>
          </main>
        </div>
      </div>
    </>
  );
};

export default index;
