import { getAssetImage } from "@/api";
import { useUser } from "@/context/UserContext";
import logger from "@/utils/logger";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function MapForm({ onBack }) {
  const auth = useAuth();
  const { user, hashedEmail } = useUser();
  const router = useRouter();

  // Initialize form state with all fields
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    class: "",
    scale: "",
    terrain: "",
    orientation: "",
    pointsOfInterest: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMissingFields([]);

    if (!auth.isAuthenticated || !auth.user?.id_token) {
      const authError = "You must be logged in to perform this action.";
      setError(authError);
      logger.error(authError);
      setLoading(false);
      return;
    }

    // Ensure required fields are filled
    const requiredFields = ["type", "scale", "terrain"];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`You must select: ${emptyFields.join(", ")}.`);
      setMissingFields(emptyFields);
      setLoading(false);
      return;
    }

    try {
      // Remove empty fields from request
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value.trim() !== ""),
      );
      logger.info("Sanitized form data:", sanitizedData);

      // API call
      const response = await getAssetImage(auth.user, sanitizedData, "map");
      logger.info("API Response:", response);

      console.log("Map creation response:", response);

      // Extract the UUID from the response
      const assetUuid = response?.asset?.uuid;

      if (!assetUuid) {
        setError("Failed to get asset UUID from the response");
        setLoading(false);
        return;
      }

      // Store the current page in session storage for back button functionality
      sessionStorage.setItem("previousPage", "/create");

      // Redirect directly to the asset's profile page using the UUID
      console.log(`Redirecting to /profile/${assetUuid}`);
      router.push(`/profile/${assetUuid}`);
    } catch (err) {
      const submissionError = "Failed to generate the map. Please try again.";
      setError(submissionError);
      logger.error(submissionError, err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Map</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4">
          {/* Map Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Map Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter a name for the map"
            />
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-white"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("type")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a type</option>
              {[
                "forest",
                "plains",
                "wilderness",
                "swamp",
                "island/coastal",
                "desert",
                "arctic",
                "mountains",
                "city/town",
                "tavern/inn",
                "festival",
                "temple",
                "ship",
                "dungeon",
                "castle",
                "cave system",
                "battlefield",
                "astral/planar",
                "feywilds",
                "dreamscape",
                "graveyard",
                "hell",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Scale */}
          <div>
            <label
              htmlFor="scale"
              className="block text-sm font-medium text-white"
            >
              Scale
            </label>
            <select
              id="scale"
              name="scale"
              value={formData.scale}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("scale")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a scale</option>
              {["small", "medium", "large"].map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>
          {/* Terrain Dropdown */}
          <div>
            <label
              htmlFor="terrain"
              className="block text-sm font-medium text-white"
            >
              Terrain
            </label>
            <select
              id="terrain"
              name="terrain"
              value={formData.terrain}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("terrain")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a terrain</option>
              {[
                "rivers/lakes",
                "cliffs and elevation changes",
                "bridges",
                "roads",
                "lava pools",
                "hidden paths",
                "tunnels",
                "fortifications",
                "ruins",
              ].map((terrain) => (
                <option key={terrain} value={terrain}>
                  {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* pointsOfInterest */}
          <div>
            <label
              htmlFor="pointsOfInterest"
              className="block text-sm font-medium text-white"
            >
              Points of Interest
            </label>
            <textarea
              id="pointsOfInterest"
              name="pointsOfInterest"
              rows={3}
              value={formData.pointsOfInterest}
              onChange={handleChange}
              className="block w-full mt-1 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter pointsOfInterest here"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
