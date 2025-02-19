import { getUser } from "@/api";
import { createContext, useContext, useEffect, useState } from "react";

const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL; // Retrieve the log level for controlling console logs securely
const isDebug = logLevel === "debug"; // Boolean flag to enable debug-level console logging

/****************************************************************
 * Context: UserContext
 * Description: Creates a React context for managing user state globally.
 ****************************************************************/
const UserContext = createContext(null);

// Wraps the application and provides user authentication and profile details to all child components.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hashedEmail, setHashedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  /****************************************************************
   * Function: updateUserInfo
   * Description: Fetches the latest user info from Prisma backend,
   *              updates local state, and syncs with `localStorage`.
   ****************************************************************/
  const updateUserInfo = async () => {
    if (!hashedEmail) {
      console.log("Error accessing hashedEmail withing UserContext");
      return; // Ensure we have a valid email before fetching data
    }

    try {
      const response = await getUser(hashedEmail); // Fetch from Prisma via API
      if (response?.data) {
        setUser(response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));

        if (isDebug) {
          console.log("Latest user was fetched: ", response.data);
        }

        // Dispatch storage event to update other tabs
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  };

  /****************************************************************
   * Function: updateUserFromStorage
   * Description: Reads user info from `localStorage` and updates state.
   *              Runs on initial load and when `localStorage` changes.
   ****************************************************************/
  const updateUserFromStorage = () => {
    // Check to ensure that localStorage is only accessed in the browser.
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userInfo");
      const storedHashedEmail = localStorage.getItem("hashedEmail");

      // Parse the stored user data to prevent string errors
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setHashedEmail(storedHashedEmail || null);
      setLoading(false); // Set loading to false after setting user state
    }
  };

  /****************************************************************
   * Effect: Sync user state with localStorage on mount
   *         Listens for storage changes (e.g., in another tab).
   ****************************************************************/

  useEffect(() => {
    updateUserFromStorage();
    setLoading(false);
    window.addEventListener("storage", updateUserFromStorage);
    return () => window.removeEventListener("storage", updateUserFromStorage);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, hashedEmail, setHashedEmail, updateUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
