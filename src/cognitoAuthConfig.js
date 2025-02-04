import { postUser } from "@/api";
import { WebStorageStateStore } from "oidc-client-ts";
// See https://authts.github.io/oidc-client-ts/index.html
/**
 * @type {import("oidc-client-ts").UserManagerSettings}
 */

const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL; // Retrieve the log level for controlling console logs securely
const isDebug = logLevel === "debug"; // Boolean flag to enable debug-level console logging

const cognitoAuthConfig = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL,
  response_type: "code",
  scope: "email openid",
  userStore:
    typeof window !== "undefined" // window is undefined during build
      ? new WebStorageStateStore({ store: window.localStorage })
      : null,
  onSigninCallback: async (_user) => {
    //changed to be async to make sure we wait until data was fetched
    window.history.replaceState({}, document.title, window.location.pathname);

    /**************************************************
     * Initiates the process of sending an empty POST
     * request to check if the user exists in the Prisma
     * database. If the user does not exist, the backend
     * will automatically create a new user entry.
     **************************************************/
    if (!_user) {
      console.error("Error getting user info");
      return;
    }

    // Construct user data object
    const userData = {
      id_token: _user.id_token,
      email: _user.profile?.email, // Ensure email exists
    };
    if (isDebug) {
      console.log("Fetched user info from Cognito:", userData);
    }

    // Send user data to API and handle response
    try {
      console.log("Sending user data to API...");
      const response = await postUser(userData);

      if (response.status === 200) {
        if (isDebug) {
          console.log("User already exists:", response.data);
        } else {
          console.log("User already exists!");
        }
      } else if (response.status === 201) {
        if (isDebug) {
          console.log("New user created:", response.data);
        } else {
          console.log("New user created!");
        }
      } else {
        if (isDebug) {
          console.warn(
            "Unexpected response status:",
            response.status,
            response.data,
          );
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      }
    } catch (error) {
      console.error("Error posting user:", error.message);

      if (error.response) {
        if (isDebug) {
          console.error(
            "API responded with:",
            error.response.status,
            error.response.data,
          );
        } else {
          console.error("API responded with:", error.response.status);
        }
      }
    }
  },
  // See https://authts.github.io/oidc-client-ts/index.html#md:provider-specific-settings
  // no revoke of "access token" (https://github.com/authts/oidc-client-ts/issues/262)
  revokeTokenTypes: ["refresh_token"],
  // no silent renew via "prompt=none" (https://github.com/authts/oidc-client-ts/issues/366)
  automaticSilentRenew: false,
};

export default cognitoAuthConfig;
