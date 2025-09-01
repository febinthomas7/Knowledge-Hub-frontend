import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SparklesIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();
  const [isBtn, setIsBtn] = useState(false);
  const [pswd, setPswd] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [isWait, setIsWait] = useState(false);
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
      const { name, email, password } = data;

      if (!name || !email || !password) {
        setIsBtn(false);
        return handleError("All fields are required");
      }

      const url = `${import.meta.env.VITE_BASE_URL}/api/auth/signin`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const { sucess, message, error } = result;
      if (!sucess) {
        handleError(message);
        setIsBtn(false);
        setLoading(false);
        setIsWait(false);
      }

      if (sucess) {
        // try {
        //   const emailResponse = await fetch(
        //     `${import.meta.env.VITE_BASE_URL}/api/auth/send-welcome-email`,
        //     {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({ email, name }),
        //     }
        //   );

        //   const emailResult = await emailResponse.json();
        //   if (emailResponse.ok) {
        //     console.log("Welcome email sent:", emailResult.message);
        //   } else {
        //     console.error("Failed to send welcome email:", emailResult.error);
        //   }
        // } catch (emailError) {
        //   console.error("Error while sending email:", emailError);
        // }
        setLoading(false);
        setIsWait(false);
        handleSuccess(message);

        setTimeout(() => {
          navigate("/login");
          setIsBtn(false);
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
    <div className=" z-10 w-full h-svh flex justify-center items-center  bg-black  aspect-video ">
      <div className=" w-full h-svh flex justify-center items-center fixed  z-10"></div>
      <header
        className={` text-white  sm:px-10 sm:py-2 z-40 flex top-0 justify-between fixed w-full  items-center duration-75 ease-in`}
      ></header>
      <ToastContainer />
      <div className="flex justify-center text-black h-full items-center w-full z-40 backdrop-blur-[2px]">
        <div className="bg-white  p-8 rounded-lg shadow-lg w-full max-w-md relative mx-5 ">
          <Link to="/">
            <div className="text-center">
              <div className="flex justify-center">
                <SparklesIcon className="h-12 w-12 text-indigo-600" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join the Knowledge Hub community
              </p>
            </div>
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block  mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="name"
                id="name"
                name="name"
                className="w-full p-3 rounded bg-[#39393938] outline outline-white  focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block  mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 rounded bg-[#39393938] outline outline-white  focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
                  className="w-full  p-3 rounded bg-[#39393938] outline outline-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
              className={`w-full  ${
                !isBtn
                  ? "hover:scale-105 bg-indigo-600"
                  : "bg-indigo-600 cursor-not-allowed"
              }  duration-100 ease-in text-white cursor-pointer font-bold py-3 flex justify-center items-center rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
              {Loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />

                  {isWait && (
                    <p className="ml-2 text-gray-400">please wait...</p>
                  )}
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <div>
              <p className="text-gray-400 mt-4">
                already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
