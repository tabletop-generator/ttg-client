// cognitoAuthConfig.js
import { hashEmail } from "@/utils/hashedEmail";
import { postUser } from "@/utils/postNewUser";
import { WebStorageStateStore } from "oidc-client-ts";

/**
 * @type {import("oidc-client-ts").UserManagerSettings}
 */
const cognitoAuthConfig = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL,
  response_type: "code",
  scope: "email openid",
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.localStorage })
      : null,
  onSigninCallback: async (_user) => {
    console.log("Before clearing hash:", window.location.hash);
    window.history.replaceState({}, document.title, window.location.pathname);

    // Extract the user's ID token and email
    const idToken = _user.id_token;
    const email = _user?.profile?.email;

    try {
      // Hash the email
      const hashedEmail = await hashEmail(email);
      console.log("Hashed Email:", hashedEmail);

      // Create a user object to send
      const user = {
        id_token: idToken,
        hashedEmail,
      };

      // Call postUser to send the user data to the backend
      const response = await postUser(user);

      if (response.status === 200) {
        console.log("User already exists:", response.data);
      } else if (response.status === 201) {
        console.log("New user created:", response.data);
      }
    } catch (error) {
      console.error("Error during sign-in callback:", error);
    }
  },
  revokeTokenTypes: ["refresh_token"],
  automaticSilentRenew: false,
};

export default cognitoAuthConfig;
