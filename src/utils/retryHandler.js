// src/utils/retryHandler.js

import RetryBanner from "@/components/RetryBanner";
import { createRoot } from "react-dom/client";

let retryFetchUser = null; // Function reference for retrying the fetch request
let fetchUserError = false; // Tracks whether an error occurred during fetch
let retryCount = 0; // Tracks the number of retry attempts

/**
 * Displays the RetryBanner component when a fetch attempt fails.
 * If the retry count reaches 2 unsuccessful attempts, the banner
 * will prompt the user to log out instead of retrying.
 */
export const showRetryBanner = () => {
  const existingBanner = document.getElementById("retryBannerContainer");

  // If the banner doesn't exist, create a new container element
  if (!existingBanner) {
    const div = document.createElement("div");
    div.id = "retryBannerContainer";
    document.body.appendChild(div);
  }

  // Always create a new React root to ensure the state updates correctly
  const root = createRoot(document.getElementById("retryBannerContainer"));

  root.render(
    <RetryBanner
      retryCount={retryCount}
      onRetry={async () => {
        if (retryFetchUser) {
          retryCount++; // Increment retry count on each attempt
          await retryFetchUser(); // Attempt to fetch user data again

          console.log("Retry attempt:", retryCount);

          // If the fetch is successful, remove the retry banner
          if (!fetchUserError) {
            document.body.removeChild(
              document.getElementById("retryBannerContainer"),
            );
          }
          // If retry count reaches 2, switch to log out prompt
          else if (retryCount >= 2) {
            console.log("Retry limit reached, prompting log out:", retryCount);
            root.render(
              <RetryBanner showLogout={true} retryCount={retryCount} />,
            );
          }
          // Otherwise, keep retrying
          else {
            root.render(
              <RetryBanner retryCount={retryCount} onRetry={retryFetchUser} />,
            );
          }
        }
      }}
      showLogout={retryCount >= 2} // Show log out button after two failed attempts
    />,
  );
};

/**
 * Sets the retry function that will be called when the user retries fetching data.
 * @param {Function} retryFunction - Function to call when retrying user fetch
 */
export const setRetryFunction = (retryFunction) => {
  retryFetchUser = retryFunction;
};

/**
 * Updates the error state indicating whether fetching the user data failed.
 * @param {boolean} hasError - Boolean indicating if an error occurred
 */
export const setFetchUserError = (hasError) => {
  fetchUserError = hasError;
};
