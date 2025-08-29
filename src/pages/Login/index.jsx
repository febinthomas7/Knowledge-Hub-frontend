import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
import { useState, useContext } from "react";
// import { Helmet } from "react-helmet";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Watch } from "../../Context";

const Login = () => {
  const navigate = useNavigate();
  const [isBtn, setIsBtn] = useState(false);
  const [pswd, setPswd] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [isWait, setIsWait] = useState(false);
  const { setEmail, setUserName, setAvatarUrl, setBio } = useContext(Watch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBtn(true);
    setLoading(true);

    setTimeout(() => {
      setIsWait(true);
    }, 10000);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const url = `${import.meta.env.VITE_BASE_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const {
        sucess,
        message,
        error,
        jwtToken,
        name,
        email,
        _id,
        avatar,
        memories,
        albums,
        bio,
      } = result;
      if (!sucess) {
        handleError(message);
        setIsBtn(false);
        setLoading(false);
        setIsWait(false);
      }
      if (sucess) {
        setLoading(false);
        setIsWait(false);
        handleSuccess(message);
        setUserName(name);
        setEmail(email);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", _id);

        // fetchDeviceDetails();

        if (!avatar === undefined || "undefined" || "") {
          localStorage.setItem("avatar", avatar);
          setAvatarUrl(avatar);
        }

        if (!bio == undefined || "undefined" || "") {
          localStorage.setItem("bio", bio);
          setBio(bio);
        }

        if (!memories === undefined || "undefined" || "") {
          localStorage.setItem("memories", memories);
        }

        if (!albums === undefined || "undefined" || "") {
          localStorage.setItem("albums", albums);
        }

        setTimeout(() => {
          navigate("/");
          setIsBtn(true);
        }, 1000);
      } else if (error) {
        handleError(error?.details[0].message);
        setIsBtn(false);
      }
    } catch (error) {
      console.log(error);
      setIsBtn(false);
    }
  };
  return (
    <div className="z-10 w-full h-svh flex justify-center items-center    bg-no-repeat bg-center bg-cover bg-[url('/coverpage.png')] aspect-video">
      {/* <Helmet>
        <title>Login - Flexifyy</title>
        <meta name="description" content="user login page" />
      </Helmet> */}
      <div className=" w-full h-svh flex justify-center items-center  fixed z-10"></div>
      <header
        className={` text-white sm:px-10 sm:py-2 z-40 flex top-0 justify-between fixed w-full  items-center duration-75 ease-in`}
      ></header>
      <ToastContainer />
      <div className="flex justify-center text-black items-center w-full h-full z-40  backdrop-blur-[2px]">
        <div className="bg-[#ffffff] p-8 rounded-lg shadow-lg w-full  max-w-md relative mx-5 ">
          <Link to="/">
            <div className="logo   flex justify-center items-center">
              <img src="full_logo.png" alt="" className="w-40 h-15" />
            </div>
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block  mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 rounded bg-[#39393938] outline outline-white  focus:outline-none focus:ring-2 focus:ring-[#ff4522]"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block  mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={pswd ? "password" : "text"}
                  id="password"
                  name="password"
                  className="w-full  p-3 rounded bg-[#39393938] outline outline-white  focus:outline-none focus:ring-2 focus:ring-[#ff4522]"
                  placeholder="Password"
                  required
                />
                <div onClick={() => setPswd(!pswd)} className="cursor-pointer">
                  {pswd ? (
                    <GoEyeClosed className="absolute top-1/4 right-3  text-2xl" />
                  ) : (
                    <GoEye className="absolute top-1/4 right-3  text-2xl" />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isBtn}
              className={`w-full  ${
                !isBtn
                  ? "hover:scale-105 bg-[#ff4522] cursor-pointer"
                  : "bg-[#ff4522] cursor-not-allowed"
              }  duration-100 ease-in text-white font-bold py-3 flex justify-center items-center rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
              {Loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />

                  {isWait && (
                    <p className="ml-2 text-gray-400">please wait...</p>
                  )}
                </>
              ) : (
                "Login"
              )}
            </button>
            <div>
              <p className="text-gray-400 mt-4 text-right">
                <Link
                  to="/request_reset"
                  className="text-[#ff4522]  hover:underline"
                >
                  forget password?
                </Link>
              </p>
            </div>
            <div>
              <p className="text-gray-400 mt-4">
                Don't have an account?{" "}
                <Link to="/signin" className="text-[#ff4522] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
