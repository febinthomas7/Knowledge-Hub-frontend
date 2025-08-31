import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <div className=" w-full h-svh flex justify-center items-center bg-black  backdrop-blur-sm">
      <div className=" w-full h-svh flex justify-center items-center fixed  z-49"></div>
      <header
        className={` text-white bg-white sm:px-10 px-4 py-4 sm:py-2 z-70 flex top-0 justify-between  fixed w-full  items-center duration-75 ease-in`}
      >
        <Link to="/">
          <div className=" pt-5  flex justify-center items-center">
            <img src="full_logo.png" alt="" className="w-40 h-15" />
          </div>
        </Link>

        <Link to="/login">
          <div className=" flex justify-center items-center cursor-pointer px-4 py-2 bg-[#ff4522] font-bold group hover:scale-105 duration-75 ease-in  rounded">
            Login
          </div>
        </Link>
      </header>
      <div className="flex justify-center items-center h-full w-full z-60 ">
        <div className="w-full h-full backdrop-blur-[2px] fixed"></div>
        <div className=" p-8 rounded-lg  w-full flex flex-col gap-3 sm:gap-3  justify-center items-center relative select-none text-shadow-2xs text-shadow-black">
          <h2 className="text-2xl sm:text-5xl font-extrabold text-center ">
            Memory Keeping App
          </h2>
          <h3 className="text-[12px] sm:text-[20px] ">
            Save All your precious moments in one place.
          </h3>

          <Link to="/register">
            <button className=" relative flex justify-center text-white font-bold items-center cursor-pointer px-6 py-2 bg-[#ff4522] group duration-75 ease-in   hover:scale-105 rounded">
              Get Started
              <FaArrowRight className="text-[15px] absolute invisible translate-x-[-5px] group-hover:translate-x-0 duration-75 ease-in-out group-hover:right-0 group-hover:visible" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
