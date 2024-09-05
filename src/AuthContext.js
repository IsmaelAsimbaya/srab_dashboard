import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("invitado");
  const [password, setPassword] = useState("invitado");

  return (
    <AuthContext.Provider value={{ username, setUsername, password, setPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);