import GeneratedAsset from "@/components/GeneratedAsset";
import { useState } from "react";

export default function CharacterForm({ onBack }) {
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
    pose: "",
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
        data={{ id: "characters", ...formData, generated: generatedResult }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Character</h2>

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
          "pose",
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
          disabled={loading} // Disable button while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
