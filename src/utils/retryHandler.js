// src/utils/retryHandler.js
import RetryBanner from "@/components/RetryBanner";
import { createRoot } from "react-dom/client";

let retryFetchUser = null; // Function reference for retrying the user fetch
let fetchUserError = false; // Tracks whether an error occurred
let retryCount = 0; // Tracks how many times we've retried

/**
 * Renders the RetryBanner component using the current retryCount.
 * If retryCount >= 2, it shows a logout prompt. Otherwise, it shows a retry button.
 */
const renderBanner = (root) => {
  if (retryCount >= 2) {
    // After two failed attempts, show "Log Out"
    root.render(<RetryBanner showLogout={true} retryCount={retryCount} />);
  } else {
    // Otherwise show the "Retry" banner
    root.render(
      <RetryBanner
        retryCount={retryCount}
        onRetry={async () => {
          retryCount++; // Increase retry count
          if (retryFetchUser) {
            await retryFetchUser(); // Attempt the user fetch again
          }
          console.log("Retry attempt:", retryCount);
          // Re-render the banner with updated retryCount
          renderBanner(root);
        }}
        showLogout={false}
      />,
    );
  }
};

/**
 * Displays the RetryBanner component. If it doesn't exist in the DOM yet,
 * we create a container. Then we call renderBanner to show the correct state.
 */
export const showRetryBanner = () => {
  let bannerContainer = document.getElementById("retryBannerContainer");

  // If the container doesn't exist, create it
  if (!bannerContainer) {
    bannerContainer = document.createElement("div");
    bannerContainer.id = "retryBannerContainer";
    document.body.appendChild(bannerContainer);
  }

  const root = createRoot(bannerContainer);
  renderBanner(root);
};

/**
 * Sets the function that should be called whenever the user hits "Retry."
 * Typically, this is your "fetchUserData" function.
 */
export const setRetryFunction = (retryFunction) => {
  retryFetchUser = retryFunction;
};

/**
 * Updates the error state indicating if fetching user data failed.
 * @param {boolean} hasError
 */
export const setFetchUserError = (hasError) => {
  fetchUserError = hasError;
};
