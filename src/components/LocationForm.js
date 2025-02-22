import GeneratedAsset from "@/components/GeneratedAsset"; // NEW
import { useState } from "react";

export default function LocationForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    terrain: "",
    atmosphere: "",
    inhabitants: "",
    notableFeatures: "",
    climate: "",
    dangerLevel: "",
    lore: "",
    pointsOfInterest: "", // Added for points of interest
    narrativeRole: "", // Added for narrative role
    customDescription: "", // Added for custom description
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the form is submitted
  const [generatedResult, setGeneratedResult] = useState(null); // Placeholder for API response
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      // Placeholder for API call
      console.log("Form data submitted:", formData);

      const response = {
        // API call to generate will go here
      };

      // Store the response and navigate to GeneratedAsset
      setGeneratedResult(response);
      setIsSubmitted(true); // Navigate to GeneratedAsset
    } catch (err) {
      setError("An error occurred. Please try again."); // Handle errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (isSubmitted) {
    // Navigate to GeneratedAsset with the form data and generated result
    return (
      <GeneratedAsset
        onBack={() => setIsSubmitted(false)} // Allow going back to the form
        data={{ id: "locations", ...formData, generated: generatedResult }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Location</h2>

        {/* Display Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Location Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Location Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            placeholder="Enter the name of the location"
          />
        </div>

        {/* Second Section: Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-white"
            >
              Location Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a type</option>
              {[
                "outdoors",
                "city",
                "village",
                "fortress",
                "ruins",
                "dungeon",
                "temple",
                "cave system",
                "tower",
                "floating island",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Terrain */}
          <div>
            <label
              htmlFor="terrain"
              className="block text-sm font-medium text-white"
            >
              Terrain Type
            </label>
            <select
              id="terrain"
              name="terrain"
              value={formData.terrain}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a terrain</option>
              {[
                "forest",
                "desert",
                "swamp",
                "mountains",
                "underground",
                "oceanic",
                "frozen wasteland",
                "grasslands",
                "volcanic",
                "astral/planar",
              ].map((terrain) => (
                <option key={terrain} value={terrain}>
                  {terrain}
                </option>
              ))}
            </select>
          </div>

          {/* Atmosphere */}
          <div>
            <label
              htmlFor="atmosphere"
              className="block text-sm font-medium text-white"
            >
              Atmosphere
            </label>
            <select
              id="atmosphere"
              name="atmosphere"
              value={formData.atmosphere}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select an atmosphere</option>
              {[
                "mysterious",
                "forboding",
                "peaceful",
                "haunted",
                "festive and lively",
                "ancient and forgotten",
                "otherworldly",
                "war-torn",
                "chaotic and unstable",
                "industrial",
              ].map((atmosphere) => (
                <option key={atmosphere} value={atmosphere}>
                  {atmosphere}
                </option>
              ))}
            </select>
          </div>

          {/* Inhabitants */}
          <div>
            <label
              htmlFor="inhabitants"
              className="block text-sm font-medium text-white"
            >
              Inhabitants
            </label>
            <select
              id="inhabitants"
              name="inhabitants"
              value={formData.inhabitants}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select inhabitants</option>
              {[
                "no inhabitants",
                "abandoned",
                "humans",
                "elves",
                "dwarves",
                "undead",
                "demons",
                "beasts",
                "monsters",
                "fey",
                "intelligent constructs",
              ].map((inhabitants) => (
                <option key={inhabitants} value={inhabitants}>
                  {inhabitants}
                </option>
              ))}
            </select>
          </div>

          {/* Climate */}
          <div>
            <label
              htmlFor="climate"
              className="block text-sm font-medium text-white"
            >
              Climate
            </label>
            <select
              id="climate"
              name="climate"
              value={formData.climate}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select climate</option>
              {[
                "temperate",
                "tropical",
                "arid",
                "frigid",
                "stormy",
                "misty/foggy",
                "eternal night",
                "high altitude",
                "subterranean",
              ].map((climate) => (
                <option key={climate} value={climate}>
                  {climate}
                </option>
              ))}
            </select>
          </div>

          {/* Danger Level */}
          <div>
            <label
              htmlFor="dangerLevel"
              className="block text-sm font-medium text-white"
            >
              Danger Level
            </label>
            <select
              id="dangerLevel"
              name="dangerLevel"
              value={formData.dangerLevel}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a danger level</option>
              {[
                "completely safe",
                "low",
                "moderate",
                "high",
                "extreme",
                "war zone",
                "cursed/corrupted",
                "eldritch horrors",
                "divine retribution",
              ].map((dangerLevel) => (
                <option key={dangerLevel} value={dangerLevel}>
                  {dangerLevel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Freeform Fields */}
      <div className="space-y-4">
        {/* Points of Interest */}
        <div>
          <label
            htmlFor="pointsOfInterest"
            className="block text-sm font-medium text-white"
          >
            Points of Interest
          </label>
          <input
            type="text"
            id="pointsOfInterest"
            name="pointsOfInterest"
            value={formData.pointsOfInterest}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            placeholder="Enter points of interest"
          />
        </div>

        {/* Custom Description */}
        <div>
          <label
            htmlFor="customDescription"
            className="block text-sm font-medium text-white"
          >
            Custom Description
          </label>
          <input
            type="text"
            id="customDescription"
            name="customDescription"
            value={formData.customDescription}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            placeholder="Enter custom description"
          />
        </div>

        {/* Narrative Role */}
        <div>
          <label
            htmlFor="narrativeRole"
            className="block text-sm font-medium text-white"
          >
            Narrative Role
          </label>
          <input
            type="text"
            id="narrativeRole"
            name="narrativeRole"
            value={formData.narrativeRole}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            placeholder="Enter narrative role"
          />
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
          disabled={loading} // Disable button while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
