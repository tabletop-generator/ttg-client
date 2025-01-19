// src/auth.js
import { UserManager } from "oidc-client-ts";
import logger from "./logger";

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
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
  return {
    // If we need any other profile scopes, include them here
    username: user.profile["cognito:username"],
    email: user.profile.email,
    idToken: user.id_token,
    accessToken: user.access_token,
    authorizationHeaders: (type = "application/json") => ({
      "Content-Type": type,
      Authorization: `Bearer ${user.id_token}`,
    }),
  };
}

export async function getUser() {
  logger.debug("Checking if user is authenticated...");
  // First, check if we're handling a signin redirect callback (e.g., is ?code=... in URL)
  if (window.location.search.includes("code=")) {
    logger.info("Handling redirect callback for authentication...");
    const user = await userManager.signinCallback();
    // Remove the auth code from the URL without triggering a reload
    window.history.replaceState({}, document.title, window.location.pathname);
    return formatUser(user);
  }

  // Otherwise, get the current user
  const user = await userManager.getUser();
  if (user) {
    logger.info(
      { username: user.profile["cognito:username"] },
      "User is authenticated.",
    );
    return formatUser(user);
  } else {
    logger.info("No authenticated user found.");
    return null;
  }
}
