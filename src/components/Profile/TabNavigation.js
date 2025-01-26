export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-700 mb-4">
      <nav className="flex justify-center space-x-4">
        <button
          onClick={() => onTabChange("assets")}
          className={`px-4 py-2 ${
            activeTab === "assets"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400"
          }`}
        >
          All Assets
        </button>
        <button
          onClick={() => onTabChange("collections")}
          className={`px-4 py-2 ${
            activeTab === "collections"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400"
          }`}
        >
          Collections
        </button>
      </nav>
    </div>
  );
}
