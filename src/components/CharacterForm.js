// src/components/CharacterForm.js

import { getCharacterImage } from "@/api";
import logger from "@/utils/logger";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import GeneratedAsset from "./GeneratedAsset";

export default function CharacterForm({ onBack }) {
  const auth = useAuth();

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

  const [loading, setLoading] = useState(false); // Prevent further submissions while waiting for api return
  const [generatedResult, setGeneratedResult] = useState(null); // Store what we get back from the api
  const [error, setError] = useState(null); // Updated when things go wrong, used to prevent submission and tell user about errors
  //TODO: Add visual cues for common errors, like required fields being empty

  // Remove default HTML functionality and use state to control forms instead
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

      // Make sure required fields arne't empty
      const requiredFields = ["name", "race", "class", "gender"];
      const missingFields = requiredFields.filter(
        (field) => !sanitizedData[field],
      );

      if (missingFields.length > 0) {
        const missingError = `Missing required fields: ${missingFields.join(
          ", ",
        )}`;
        setError(missingError);
        logger.error(missingError);
        setLoading(false);
        return;
      }

      // DEBUG: see everything we're sending in the api call
      logger.debug("Complete form data to send:", formData);

      // Make the API call (through the function in src/api.js)
      const response = await getCharacterImage(auth.user, sanitizedData);
      logger.info("API Response:", response);

      setGeneratedResult(response);
    } catch (err) {
      const submissionError =
        "Failed to generate the character. Please try again.";
      setError(submissionError);
      logger.error(submissionError, err.message);
    } finally {
      setLoading(false);
      logger.info("Form submission process complete.");
    }
  };

  // Generated Asset Display

  // Didn't want to display the generated asset as its own page, using nested component instead
  // This code will show the asset in place of the character form when a successful API return is stored
  if (generatedResult && generatedResult.id && generatedResult.imageUrl) {
    return (
      <GeneratedAsset
        data={generatedResult}
        onBack={() => setGeneratedResult(null)} // Pressing back will break the condition (setting state to null) and show the form again
      />
    );
  }

  // Character Form
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Character</h2>

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
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:pt-2 placeholder:pl-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
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
          disabled={loading} // Prevent another send attempt while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
