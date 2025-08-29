import { createContext, useState } from "react";

export const Watch = createContext();
const Context = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [bio, setBio] = useState(localStorage.getItem("bio"));
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [userName, setUserName] = useState(localStorage.getItem("name"));
  const [editedUserName, setEditedUserName] = useState("");
  const [latitude, setLatitude] = useState();
  const [flag, setFlag] = useState(false);
  const [longitude, setLongitude] = useState();

  return (
    <Watch.Provider
      value={{
        backgroundImage,
        setBackgroundImage,
        avatarUrl,
        setAvatarUrl,
        userName,
        setUserName,
        editedUserName,
        setEditedUserName,
        email,
        setEmail,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        bio,
        setBio,
        flag,
        setFlag,
      }}
    >
      {children}
    </Watch.Provider>
  );
};

export default Context;
