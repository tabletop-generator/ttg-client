// src/components/CharacterForm.js

import GeneratedAsset from "@/components/GeneratedAsset";
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
  const [missingFields, setMissingFields] = useState([]); // Tracks which required fields are missing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMissingFields([]);

    // Required dropdown fields check
    const requiredFields = [
      "type",
      "terrain",
      "atmosphere",
      "inhabitants",
      "climate",
      "dangerLevel",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`You must select: ${emptyFields.join(", ")}.`);
      setMissingFields(emptyFields);
      setLoading(false);
      return;
    }

    try {
      console.log("Form data submitted:", formData);

      const response = {
        // API call to generate will go here
      };

      setGeneratedResult(response);
      setIsSubmitted(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <GeneratedAsset
        onBack={() => setIsSubmitted(false)}
        data={{ id: "locations", ...formData, generated: generatedResult }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Location</h2>

        {/* Display Error Message */}
        {error && <p className="text-red-500 font-bold">{error}</p>}

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
          {[
            {
              id: "type",
              label: "Location Type",
              options: [
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
              ],
            },
            {
              id: "terrain",
              label: "Terrain Type",
              options: [
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
              ],
            },
            {
              id: "atmosphere",
              label: "Atmosphere",
              options: [
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
              ],
            },
            {
              id: "inhabitants",
              label: "Inhabitants",
              options: [
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
              ],
            },
            {
              id: "climate",
              label: "Climate",
              options: [
                "temperate",
                "tropical",
                "arid",
                "frigid",
                "stormy",
                "misty/foggy",
                "eternal night",
                "high altitude",
                "subterranean",
              ],
            },
            {
              id: "dangerLevel",
              label: "Danger Level",
              options: [
                "completely safe",
                "low",
                "moderate",
                "high",
                "extreme",
                "war zone",
                "cursed/corrupted",
                "eldritch horrors",
                "divine retribution",
              ],
            },
          ].map(({ id, label, options }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block text-sm font-medium text-white"
              >
                {label}
              </label>
              <select
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                  missingFields.includes(id)
                    ? "border-2 border-red-500"
                    : "border-gray-600"
                }`}
              >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
