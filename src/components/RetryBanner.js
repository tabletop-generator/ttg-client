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
    // Ensure we only render in the client
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const images = {
    default: "/placeholder/prankster1.gif",
    retry: "/placeholder/prankster2.gif",
    logout: "/placeholder/prankster3.gif",
  };

  // Choose an image based on the state
  let imageSrc = images.default;
  if (retryCount === 1) {
    imageSrc = images.retry;
  } else if (showLogout) {
    imageSrc = images.logout;
  }

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    sessionStorage.clear();
    // remove cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
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
              You tried twice, and the trickster still has the upper hand!
              <br />
              Time to log out and try again later.
            </>
          ) : retryCount === 1 ? (
            <>
              The prankster dodged your last attempt!
              <br />
              Try once more to outwit it!
            </>
          ) : (
            <>
              A Fey Prankster has meddled with your request.
              <br />
              Press the button to fight them off and try again!
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
