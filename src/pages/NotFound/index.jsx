import { Link } from "react-router-dom";
const index = () => {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <>
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#010308] text-white bg-no-repeat bg-center overflow-y-auto p-6 relative bg-[url('/bgImage.svg')]">
        <h1 className="text-3xl sm:text-5xl font-bold capitalize tracking-wide text-center">
          Page Not Found
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-400 text-center">
          The page you are looking for doesn't exist.
        </p>
        <div className="flex flex-col items-center w-full sm:w-1/2 mt-6">
          <div className="w-2/3 sm:w-1/2 h-1 rounded-full bg-red-600 animate-pulse"></div>
          <div className="w-1/2 sm:w-1/3 h-1 mt-2 rounded-full bg-red-600 animate-pulse"></div>
        </div>
        <Link to={isAuthenticated ? "/map" : "/login"} className="mt-8 ">
          <button className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            {isAuthenticated ? "Go to Home" : "Go Back"}
          </button>
        </Link>
        <p className="mt-4 text-base sm:text-lg text-gray-400 text-center">
          Oops!
        </p>
      </div>
    </>
  );
};

export default index;
