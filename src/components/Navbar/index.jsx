import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Upload, Map } from "lucide-react";
import { Watch } from "../../Context";
import { RxCross1 } from "react-icons/rx";
import { VscThreeBars } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

const Index = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { avatarUrl } = useContext(Watch);
  const [dropDown, setDropDown] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change 50px to whatever feels right
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = [
    { id: 1, link: "/map", name: "Map", icon: <Map className="h-4 w-4" /> },
    {
      id: 2,
      link: "/gallery",
      name: "Gallery",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: 3,
      link: "/upload",
      name: "Upload",
      icon: <Upload className="h-4 w-4" />,
    },
  ];

  const mobileNav = [
    { id: 1, link: "/map", name: "Map", icon: <Map className="h-4 w-4" /> },
    {
      id: 2,
      link: "/gallery",
      name: "Gallery",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: 3,
      link: "/upload",
      name: "Upload",
      icon: <Upload className="h-4 w-4" />,
    },
    {
      id: 4,
      link: "/profile",
      name: "profile",
      icon: <CgProfile className="h-4 w-4" />,
    },
  ];

  return (
    <nav className={`w-full fixed z-15 mt-3 px-4`}>
      <div
        className={` border-2 w-full border-white transition-colors duration-300 rounded-3xl   px-4 ${
          scrolled ? "bg-white " : "bg-[#ffffff]"
        }`}
      >
        <div className="flex justify-between items-center h-16">
          <Link
            to="/map"
            className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 transition-colors"
          >
            <img className="w-40 h-15" src="full_logo.png" alt="" srcSet="" />
          </Link>

          <div className=" hidden sm:flex space-x-1 ">
            {nav?.map((page, index) => {
              return (
                <Link
                  key={index}
                  to={page.link}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(page.link)
                      ? "bg-[#ff4522] text-white shadow-sm"
                      : "text-gray-600  hover:bg-[#dfdfdf]"
                  }`}
                >
                  {page.icon}
                  <span className="font-medium">{page.name}</span>
                </Link>
              );
            })}

            <Link to="/profile">
              <img
                className={`rounded-full h-12 w-12 ring-2 ${
                  isActive("/profile") ? "ring-[#ff4522]" : ""
                }  space-x-2 bg-white border-1 border-white object-cover`}
                alt="Profile"
                src={avatarUrl || localStorage.getItem("avatar")}
                onError={(e) => {
                  e.target.src = "/no_image.svg";
                }}
              />
            </Link>
          </div>

          <nav className="flex flex-col justify-center items-center text-black  md:hidden relative">
            {dropDown ? (
              <RxCross1
                className="text-[20px]"
                onClick={() => setDropDown(!dropDown)}
              />
            ) : (
              <VscThreeBars
                className="text-[20px]"
                onClick={() => setDropDown(!dropDown)}
              />
            )}

            {dropDown && (
              <div className="absolute  top-6 flex flex-col gap-4 bg-black p-4 rounded">
                {mobileNav.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className={`hover:text-[#b01818] block font-semibold rounded-full ${
                      isActive(item.link)
                        ? "text-[#ff4522]"
                        : "text-[#c5c5c5c1]"
                    } `}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Index;
