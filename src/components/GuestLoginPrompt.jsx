// components/GuestLoginPrompt.js
import { useAuth } from "react-oidc-context";

export default function GuestLoginPrompt({ onDismiss }) {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div className="bg-indigo-600 text-white p-4 rounded-lg mb-4">
      <p className="font-bold text-lg">Want more interaction options?</p>
      <p className="mb-3">
        Log in to like assets, create collections, and more!
      </p>
      <div className="flex justify-between items-center">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 font-medium"
        >
          Log In
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white underline hover:text-indigo-200"
          >
            Continue as guest
          </button>
        )}
      </div>
    </div>
  );
}
