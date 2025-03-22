// src/components/CharacterForm.js

import { getAssetImage } from "@/api";
import { useUser } from "@/context/UserContext";
import logger from "@/utils/logger";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function CharacterForm({ onBack }) {
  const auth = useAuth();
  const { user, hashedEmail } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    race: "",
    class: "",
    gender: "",
    alignment: "",
    appearance: "",
    personality: "",
    background: "",
    abilities: "",
    equipment: "",
    motivation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    logger.info("Submitting form...");
    setLoading(true);
    setError(null);

    if (!auth.isAuthenticated || !auth.user?.id_token) {
      const authError = "You must be logged in to perform this action.";
      setError(authError);
      logger.error(authError);
      setLoading(false);
      return;
    }

    try {
      // Remove any empty fields from our api request
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value.trim() !== ""),
      );
      logger.info("Sanitized form data:", sanitizedData);

      // Make sure required fields aren't empty
      const requiredFields = ["name", "race", "class", "gender"];
      const emptyFields = requiredFields.filter(
        (field) => !sanitizedData[field],
      );

      if (emptyFields.length > 0) {
        setMissingFields(emptyFields);
        const missingError = `Missing required fields: ${emptyFields.join(", ")}`;
        setError(missingError);
        logger.error(missingError);
        setLoading(false);
        return;
      } else {
        setMissingFields([]);
      }

      logger.debug("Complete form data to send:", formData);

      // Make the API call
      const response = await getAssetImage(
        auth.user,
        sanitizedData,
        "character",
      );

      console.log("Asset creation response:", response);

      // Extract the UUID from the response (not the numeric ID)
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
      const submissionError =
        "Failed to generate the character. Please try again.";
      setError(submissionError);
      logger.error(submissionError, err.message);
      console.error("API call error details:", err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Character</h2>
        {error && <p className="text-red-500 font-bold">{error}</p>}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white placeholder:text-gray-400 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              missingFields.includes("name")
                ? "border-2 border-red-500"
                : "border-gray-600"
            }`}
            placeholder="Enter character name"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4">
          {/* Race */}
          <div>
            <label
              htmlFor="race"
              className="block text-sm font-medium text-white"
            >
              Race
            </label>
            <select
              id="race"
              name="race"
              value={formData.race}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("race")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a race</option>
              {[
                "human",
                "elf",
                "drow",
                "half_elf",
                "half_orc",
                "halfling",
                "dwarf",
                "gnome",
                "tiefling",
                "githyanki",
                "dragonborn",
              ].map((race) => (
                <option key={race} value={race}>
                  {race
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label
              htmlFor="class"
              className="block text-sm font-medium text-white"
            >
              Class
            </label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("class")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a class</option>
              {[
                "barbarian",
                "bard",
                "cleric",
                "druid",
                "fighter",
                "monk",
                "paladin",
                "ranger",
                "rogue",
                "sorcerer",
                "warlock",
                "wizard",
              ].map((className) => (
                <option key={className} value={className}>
                  {className
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-white"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 ${
                missingFields.includes("gender")
                  ? "border-2 border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select a gender</option>
              {["male", "female", "non_binary", "genderfluid", "agender"].map(
                (gender) => (
                  <option key={gender} value={gender}>
                    {gender
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Alignment */}
          <div>
            <label
              htmlFor="alignment"
              className="block text-sm font-medium text-white"
            >
              Alignment
            </label>
            <select
              id="alignment"
              name="alignment"
              value={formData.alignment}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select an alignment</option>
              {[
                "lawful_good",
                "neutral_good",
                "chaotic_good",
                "lawful_neutral",
                "true_neutral",
                "chaotic_neutral",
                "lawful_evil",
                "neutral_evil",
                "chaotic_evil",
              ].map((alignment) => (
                <option key={alignment} value={alignment}>
                  {alignment
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Areas */}
        {[
          "appearance",
          "personality",
          "background",
          "abilities",
          "equipment",
          "motivation",
        ].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-white capitalize"
            >
              {field}
            </label>
            <textarea
              id={field}
              name={field}
              rows={3}
              value={formData[field]}
              onChange={handleChange}
              className="block w-full mt-1 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 pt-2 pl-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Describe ${field}`}
            />
          </div>
        ))}
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
