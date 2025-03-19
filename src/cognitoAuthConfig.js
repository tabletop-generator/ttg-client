import { getUser, postUser } from "@/api";
import {
  setFetchUserError,
  setRetryFunction,
  showRetryBanner,
} from "@/utils/retryHandler";

import { WebStorageStateStore } from "oidc-client-ts";
// See https://authts.github.io/oidc-client-ts/index.html
/**
 * @type {import("oidc-client-ts").UserManagerSettings}
 */

const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL; // Retrieve the log level for controlling console logs securely
const isDebug = logLevel === "debug"; // Boolean flag to enable debug-level console logging

const randomPlaceholder = () => {
  const placeholders = [
    "/placeholder/p01.png",
    "/placeholder/p02.png",
    "/placeholder/p03.png",
    "/placeholder/p04.png",
  ];
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

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
    try {
      //changed to be async to make sure we wait until data was fetched
      window.history.replaceState({}, document.title, window.location.pathname);

      /**************************************************
       * 1) Initiates the process of sending an empty POST
       *    request to check if the user exists in the Prisma
       *    database. If the user does not exist, the backend
       *    will automatically create a new user entry.
       * 2) Fetch user information from Prisma by using the
       *    hashed email from the response of the step above
       *    the returned object will have the structured user
       *    information and basic collection/asset information
       **************************************************/

      if (!_user) {
        console.error("Error getting user info");
        return;
      }

      //setting the random photo for a user
      let storedProfilePicture = localStorage.getItem("profilePictureUrl");
      if (!storedProfilePicture) {
        storedProfilePicture = randomPlaceholder();
        localStorage.setItem("profilePictureUrl", storedProfilePicture);
      }

      // Construct user data object from COGNITO
      const userData = {
        id_token: _user.id_token,
        email: _user.profile?.email, // Ensure email exists
      };

      if (isDebug) {
        console.log("Fetched user info from Cognito:", userData);
      }

      // Send empty POST request to check if user exists or not in Prisma
      console.log("Sending user data to API...");
      const response = await postUser(userData);

      // Codes: 200 user exists, 201 new user was created
      // in both cases a hashed email will be returned
      if (response.status === 200 || response.status === 201) {
        if (response.status === 200) {
          console.log("User already exists:", response.data);
        } else if (response.status === 201) {
          console.log("New user created!", response.data);
        }

        // Extract hashed email from response
        const hashedEmail = response.data?.user?.hashedEmail;

        // Store hashed email and if its debug mode display
        if (hashedEmail) {
          localStorage.setItem("hashedEmail", hashedEmail);
          if (isDebug) {
            console.log("Stored hashed email:", hashedEmail);
          }

          /****************************************************
           * Begin the process of fetching user information
           **************************************************/

          const fetchUserData = async () => {
            try {
              setFetchUserError(false); // Reset error flag before retry

              // Fetch full user data, pass _user for token and hashedEmail
              const fetchedUser = await getUser(_user, hashedEmail);

              if (fetchedUser) {
                // If debug display the fetched user
                if (isDebug) {
                  console.log("Fetched user:", fetchedUser);
                }

                // Start constructing a display object using placeholder if fields are null
                const userData = {
                  ...fetchedUser.data.user, // Assign fetch data
                  displayName:
                    fetchedUser.data.user.displayName ||
                    _user?.profile?.["cognito:username"], // If no display name use COGNITO user name
                  profileBio:
                    fetchedUser.data.user.profileBio ||
                    "Undefined. Still loading... Stay tuned.", //If no bio use placeholder txt

                  profilePictureUrl: storedProfilePicture,
                };

                // For debug purposes log the new userData obj
                if (isDebug) {
                  console.log("Stored user:", userData);
                }

                // Store the userData obj in local storage to be used in src/context/UserContext.js so user
                // will stay consistent through all app areas
                localStorage.setItem("userInfo", JSON.stringify(userData));

                // Trigger the custom event
                window.dispatchEvent(new Event("storage"));
              }
            } catch (error) {
              console.error("ERROR fetching user data:", error);
              setFetchUserError(true);
              //showRetryButton();
              showRetryBanner(); // Display the retry banner
            }
          };

          setRetryFunction(fetchUserData); // Assign function for retry
          fetchUserData(); // Initial attempt
        } else {
          console.warn(
            "No hashed email returned from API response, skipping fetching user",
          );
        }
      } else {
        console.warn(
          "Unexpected response from POST request status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error in onSigninCallback:", error.message);
      setFetchUserError(true);
      // Show the banner so user can try again
      showRetryBanner();
      return Promise.resolve();
    }

    return Promise.resolve(); //Ensures function always resolves
  },
  // See https://authts.github.io/oidc-client-ts/index.html#md:provider-specific-settings
  // no revoke of "access token" (https://github.com/authts/oidc-client-ts/issues/262)
  revokeTokenTypes: ["refresh_token"],
  // no silent renew via "prompt=none" (https://github.com/authts/oidc-client-ts/issues/366)
  automaticSilentRenew: false,
};

export default cognitoAuthConfig;
