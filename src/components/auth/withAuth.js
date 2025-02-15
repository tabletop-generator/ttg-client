// src/components/withAuth.js

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

/**
 * A higher-order component (HOC) that checks user auth status.
 * If not authenticated, it triggers Cognito sign-in. Otherwise,
 * it renders the protected component.
 */
export default function withAuth(WrappedComponent) {
  return function AuthCheck(props) {
    const { isAuthenticated, isLoading, signinRedirect } = useAuth();

    useEffect(() => {
      // Once loading completes, if user is not authenticated, redirect to sign-in
      if (!isLoading && !isAuthenticated) {
        signinRedirect();
      }
    }, [isLoading, isAuthenticated, signinRedirect]);

    // While loading or redirecting, show a loading message (or spinner, etc.)
    if (isLoading || !isAuthenticated) {
      return <p>Loading... Redirecting to sign in...</p>;
    }

    // If authenticated, render the requested page
    return <WrappedComponent {...props} />;
  };
}
