// hooks/useProtectedApi.js
import { useState } from "react";
import { useAuth } from "react-oidc-context";

// This hook provides a wrapper for API calls that need authentication
// It handles common patterns like loading states, error handling, and authentication checks
export default function useProtectedApi() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Call an API function that requires authentication
  // Will handle loading state and errors
  const callApi = async (apiFunction, ...args) => {
    // Reset state
    setLoading(true);
    setError(null);

    // Check authentication
    if (!auth.isAuthenticated) {
      setLoading(false);
      setError("Authentication required");
      return { success: false, error: "Authentication required" };
    }

    try {
      // Call the API function with auth.user as first parameter and any other arguments
      const result = await apiFunction(auth.user, ...args);
      setLoading(false);
      return { success: true, data: result };
    } catch (error) {
      console.error("API call failed:", error);
      setLoading(false);
      setError(error.message || "An unknown error occurred");
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  };

  // Handle the case where a user wants to perform an action but isn't authenticated
  const handleUnauthenticatedAction = (actionType = "perform this action") => {
    // Return a Promise so we can await this function
    return new Promise((resolve) => {
      const confirmLogin = window.confirm(
        `You need to be logged in to ${actionType}. Would you like to log in now?`,
      );

      if (confirmLogin) {
        // Store intended action for after login
        if (typeof window !== "undefined") {
          sessionStorage.setItem("intendedAction", actionType);
          sessionStorage.setItem("returnUrl", window.location.href);
        }

        // Redirect to login
        auth.signinRedirect();
        resolve({ success: false, redirected: true });
      } else {
        resolve({ success: false, redirected: false });
      }
    });
  };

  return {
    callApi,
    handleUnauthenticatedAction,
    loading,
    error,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
  };
}
