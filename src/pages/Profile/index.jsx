import React, { useState, useRef, useContext } from "react";
import { Camera, Save, Edit3, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { Watch } from "../../Context";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";

const index = () => {
  const { email, userName, avatarUrl, setAvatarUrl, bio } = useContext(Watch);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userName);
  const [profilePicture, setProfilePicture] = useState(avatarUrl);
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate("");

  const handleSave = async () => {
    try {
      setName(tempName);
      setLoading(true);
      const formData = new FormData();
      formData.append("name", tempName);
      formData.append("bio", tempBio);
      if (file) {
        formData.append("avatar", file); // 👈 must match multer field name
      }
      const res = await fetch(
        `http://localhost:5000/api/user/${localStorage.getItem("userId")}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        handleError(res.statusText);
        throw new Error(`Failed to update user: ${res.statusText}`);
      }

      const data = await res.json();

      const { name, bio, avatar } = data.user;
      localStorage.setItem("name", name);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("bio", bio);
      setAvatarUrl(avatar);
      console.log(data);
    } catch (err) {
      console.error("Update user error:", err);
      throw err;
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const logout = () => {
    handleSuccess("logged out successfully");
    setTimeout(() => {
      window.localStorage.clear();
      navigate("/login");
    }, 1000);
  };
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    setFile(file);
    if (file && file.type.startsWith("image/")) {
      setUploading(true);

      // setSelectedFile(file);
      const url = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(url);
        setUploading(false);
        // Here you would typically upload to your backend
        console.log("Uploading profile picture:", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Navbar />

      <div className="w-full h-full bg-black">
        <ToastContainer />

        <div className="w-[310px] sm:w-[700px] sm:max-w-2xl mx-auto space-y-8 pt-25 pb-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">My Profile</h1>
            <p className="text-white">
              Manage your personal information and preferences.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-[#22a9ed] px-8 py-12 relative">
              <div className="flex flex-col items-center space-y-4">
                <div
                  onClick={logout}
                  className="absolute right-5 top-5 flex justify-center items-center cursor-pointer px-4 py-2 bg-[#ff4522] group hover:scale-105 duration-75 ease-in rounded"
                >
                  LogOut
                </div>

                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {uploading ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <img
                        alt="Profile"
                        src={profilePicture || localStorage.getItem("avatar")}
                        onError={(e) => {
                          e.target.src = "/no_image.svg";
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={triggerFileInput}
                        disabled={uploading}
                        className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{name}</h2>
                  <p className="text-blue-100">{email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {name}
                      </div>
                    )}
                  </div>

                  {/* Email (always readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                      {email}
                      <span className="text-xs block mt-1">
                        Email cannot be changed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Write a short bio..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                      {tempBio || bio || "No bio added yet."}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#ff4522] text-white rounded-lg hover:scale-105 cursor-pointer transition-colors shadow-md"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        {loading ? (
                          <div className=" w-full flex justify-center items-center  px-5 ">
                            <Loader2 className="animate-spin h-5 w-5 text-white" />
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
