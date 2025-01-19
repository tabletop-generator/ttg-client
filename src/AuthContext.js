// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getUser, signIn, handleSignOut } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user info on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticatedUser = await getUser();
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("No user is logged in.");
        setIsLoggedIn(false);
      }
    };
    fetchUser();
  }, []);

  // Auth actions to share across the app
  const authActions = {
    user,
    isLoggedIn,
    signIn,
    signOut: async () => {
      await handleSignOut();
      setUser(null);
      setIsLoggedIn(false);
    },
  };

  return (
    <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
