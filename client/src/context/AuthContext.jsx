// // AuthContext.jsx content placeholder
// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// // Create context
// const AuthContext = createContext();

// // Custom hook for easy access
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
//   const [isLoggedIn, setIsLoggedIn] = useState(!!token);

//   // When user or token changes, persist to localStorage for persistence
//   useEffect(() => {
//     if (user && token) {
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("accessToken", token);
//       setIsLoggedIn(true);
//     } else {
//       localStorage.removeItem("user");
//       localStorage.removeItem("accessToken");
//       setIsLoggedIn(false);
//     }
//   }, [user, token]);

//   // Login/Logout utility functions
//   const login = ({ user, token }) => {
//     setUser(user);
//     setToken(token);
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken("");
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isLoggedIn, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Safely parse only if "user" exists in storage:
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", token);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  }, [user, token]);

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
