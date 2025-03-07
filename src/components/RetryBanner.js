//src/RetryBanner.js
import styles from "@/styles/RetryBanner.module.css"; // Import as a CSS module
import { useEffect, useState } from "react";

/**************************************************
 * RetryBanner Component:
 * 1) Initiates the process of fetching user data.
 * 2) If the fetch request fails,
 *    it prompts the user to retry by clicking a button.
 * 3) When retried, it sends a GET request
 *    with the hashed email to fetch user details.
 * 4) If the first attempt is unsuccessful,
 *    the user is prompted to try again.
 * 5) After two unsuccessful attempts,
 *    the user will be prompted to log out and log back in.
 * 6) Upon a successful response, it retrieves
 *    structured user information along with
 *    collection/asset details.
 **************************************************/

const RetryBanner = ({ onRetry, showLogout, retryCount }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client to prevent SSR issues
    setIsClient(true);
  }, []);

  // Prevent rendering on the server to avoid hydration mismatches
  if (!isClient) {
    return null;
  }

  // Define different images for each stage
  const images = {
    default: "/placeholder/prankster1.gif", // Initial prankster image
    retry: "/placeholder/prankster2.gif", // Second attempt image (retry)
    logout: "/placeholder/prankster3.gif", // Final fail image (logout)
  };

  // Determine the correct image based on the current state
  let imageSrc = images.default;
  if (retryCount === 1) {
    imageSrc = images.retry; // Change on first failure
  } else if (showLogout) {
    imageSrc = images.logout; // Change to logout image on final failure
  }

  // Function to handle logging out when an issue cannot be resolved
  const handleLogout = () => {
    console.log("Logging out...");

    // Clear all localStorage and sessionStorage data to reset user session
    localStorage.clear();
    sessionStorage.clear();

    // Remove all cookies by setting them to expire immediately
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Redirect to Cognito logout endpoint OR fallback to app logout page
    window.location.replace(
      process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL || "/logout",
    );
  };

  return (
    <div className={styles.retryOverlay}>
      <div className={styles.retryContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Mischievous Fey Trickster"
          className={styles.retryImage}
        />
        <p className={styles.retryText}>
          {showLogout ? (
            <>
              <br />
              The only way to outsmart this cunning trickster is a daring
              escape! <br />
              <br />
              Log out and sneak back in. <br />
              <br />
              Let us hope the trickster does not notice the maneuver!
            </>
          ) : retryCount === 1 ? (
            <>
              The master sneaker has tangled your request in a web of mischief!
              <br />
              <br />
              Give it another go and outwit their trickery!
            </>
          ) : (
            <>
              A Fey Prankster has meddled with your request, replacing your info
              with tricks and illusions. <br />
              <br />
              Press the button to fight them off and try again! <br /> <br />
            </>
          )}
        </p>

        {showLogout ? (
          <button onClick={handleLogout} className={styles.retryButton}>
            Log Out
          </button>
        ) : (
          <button onClick={onRetry} className={styles.retryButton}>
            Roll for Initiative
          </button>
        )}
      </div>
    </div>
  );
};

export default RetryBanner;
