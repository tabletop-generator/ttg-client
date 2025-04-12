// src/components/LoadingAnimation.js
// Animation that shows while generating assets from the API

export default function LoadingAnimation({
  message = "Generating your asset...",
  error = null,
}) {
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Generation Failed
          </h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md">
        {/* D20 dice animation */}
        <div className="mb-6 relative mx-auto w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin w-24 h-24" viewBox="0 0 24 24">
              <polygon
                fill="none"
                stroke="#6366F1"
                strokeWidth="0.4"
                points="12,2 4,7 4,17 12,22 20,17 20,7"
                className="animate-pulse"
              />
              <path
                fill="none"
                stroke="#6366F1"
                strokeWidth="0.4"
                d="M12,2 L12,22 M4,7 L20,17 M20,7 L4,17"
                className="animate-pulse"
              />
              <circle
                fill="#6366F1"
                cx="12"
                cy="12"
                r="4"
                className="animate-ping opacity-75"
              />
            </svg>
          </div>
          <div className="animate-bounce absolute inset-0 flex items-center justify-center">
            <div className="text-indigo-400 font-bold text-2xl">20</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Conjuring Magic...
        </h3>
        <p className="text-gray-300">{message}</p>

        {/* Progress bar animation */}
        <div className="mt-6 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-loadingProgress"></div>
        </div>

        {/* Flavor text */}
        <p className="mt-4 text-gray-400 text-sm italic">
          Rolling initiative... casting spells... forging legends...
        </p>
      </div>
    </div>
  );
}
