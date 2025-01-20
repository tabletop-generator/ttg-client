// src/auth.js
import { UserManager } from "oidc-client-ts";
import logger from "./logger";

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-2.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
  response_type: "code",
  scope: "openid email",
  // no revoke of "access token" (https://github.com/authts/oidc-client-ts/issues/262)
  revokeTokenTypes: ["refresh_token"],
  // no silent renew via "prompt=none" (https://github.com/authts/oidc-client-ts/issues/366)
  automaticSilentRenew: false,
};

// Create a UserManager instance
const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signIn() {
  // Trigger a redirect to the Cognito auth page, so user can authenticate
  logger.info("Redirecting user to Cognito for sign-in...");
  await userManager.signinRedirect();
}

function formatUser(user) {
  logger.debug({ user }, "Formatting user object after authentication.");
  const formattedUser = {
    username: user.profile["cognito:username"],
    email: user.profile.email,
    idToken: user.id_token,
    accessToken: user.access_token,
    authorizationHeaders: (type = "application/json") => ({
      "Content-Type": type,
      Authorization: `Bearer ${user.id_token}`,
    }),
  };

  // We're using local storage like we did in CCP / web. Not using context.
  logger.info("Storing tokens in localStorage...");
  localStorage.setItem("access_token", formattedUser.accessToken);
  localStorage.setItem("id_token", formattedUser.idToken);

  logger.info(
    {
      idToken: formattedUser.idToken,
      accessToken: formattedUser.accessToken,
    },
    "User tokens obtained and stored.",
  );

  return formattedUser;
}

export async function getUser() {
  logger.debug("Checking if user is authenticated...");

  if (window.location.search.includes("code=")) {
    logger.info("Handling redirect callback for authentication...");
    try {
      const user = await userManager.signinCallback();
      logger.info({ user }, "User obtained from signinCallback.");
      window.history.replaceState({}, document.title, window.location.pathname);
      return formatUser(user);
    } catch (error) {
      logger.error("Error during signinCallback:", error);
      return null;
    }
  }

  try {
    const user = await userManager.getUser();
    if (user) {
      logger.info(
        { username: user.profile["cognito:username"] },
        "User is authenticated via oidc-client-ts storage.",
      );
      logger.info({ user }, "Raw user object from getUser.");
      return formatUser(user);
    } else {
      logger.info("No authenticated user found.");
      return null;
    }
  } catch (error) {
    logger.error("Error during getUser:", error);
    return null;
  }
}

export async function signOut() {
  try {
    logger.info("Attempting to sign out...");

    // Log current localStorage contents
    logger.debug("localStorage before sign-out:", {
      accessToken: localStorage.getItem("access_token"),
      idToken: localStorage.getItem("id_token"),
    });

    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");

    // Clear oidc-client-ts storage
    await userManager.clearStaleState();
    await userManager.signoutRedirect(); // Redirect to Cognito logout if required

    logger.info("User signed out and tokens cleared.");
    logger.debug("localStorage after sign-out:", {
      accessToken: localStorage.getItem("access_token"),
      idToken: localStorage.getItem("id_token"),
    });

    // Redirect to a public route
    window.location.href = "/";
  } catch (error) {
    logger.error("Error during sign-out:", error);
    throw error;
  }
}
