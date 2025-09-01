import { createContext, useState } from "react";

export const Watch = createContext();
const Context = ({ children }) => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [userName, setUserName] = useState(localStorage.getItem("name"));
  const [editedUserName, setEditedUserName] = useState("");

  return (
    <Watch.Provider
      value={{
        userName,
        setUserName,
        editedUserName,
        setEditedUserName,
        email,
        setEmail,
      }}
    >
      {children}
    </Watch.Provider>
  );
};

export default Context;
