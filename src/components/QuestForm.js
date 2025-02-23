import { getAssetImage } from "@/api";
import GeneratedAsset from "@/components/GeneratedAsset";
import logger from "@/utils/logger";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function QuestForm({ onBack }) {
  const auth = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    tone: "",
    location: "",
    complexity: "",
    objective: "",
    antagonist: "",
    notableNpcs: "",
    hasCombat: false,
    hasPuzzles: false,
    hasSkillChallenges: false,
    hasDilemmas: false,
    customDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [error, setError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  // Quest Type Options
  const questTypes = [
    "heist",
    "rescue",
    "investigation",
    "survival",
    "hunt/slay",
    "escort",
    "siege",
    "siege defense",
    "diplomacy/negotiation",
    "artifact retrieval",
  ];

  // Tone Options
  const questTones = [
    "adventure/wonder",
    "dark and gritty",
    "eerie and unsettling",
    "whimsical and surreal",
    "epic and heroic",
    "mysterious",
    "chaotic and unpredictable",
    "tragic and melancholy",
  ];

  // Complexity Levels
  const complexityLevels = [
    "Breezy Jaunt",
    "Troubling Tidings",
    "Perilous",
    "High Stakes",
    "Doomsday Gambit",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
    const requiredFields = ["type", "complexity"];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(
        `Missing required fields: ${emptyFields.map((f) => f.replace("_", " ")).join(", ")}. Please fill them out.`,
      );
      setMissingFields(emptyFields);
      setLoading(false);
      return;
    }

    try {
      logger.info("Submitting quest form data:", formData);

      // Sanitize the data (remove empty fields)
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, val]) => val && val.toString().trim() !== "",
        ),
      );

      logger.debug("Sanitized quest data:", sanitizedData);
      console.log("Sanitized quest data:", sanitizedData);

      // Let getAssetImage handle nesting:
      const response = await getAssetImage(auth.user, sanitizedData, "quest");
      logger.info("API Response:", response);

      // Set the result
      setGeneratedResult({
        id: response?.asset?.id,
        name: response?.asset?.name,
        imageUrl: response?.asset?.imageUrl,
        visibility: response?.asset?.visibility,
        description: response?.asset?.description,
      });
    } catch (err) {
      setError("Failed to generate the quest. Please try again.");
      logger.error("Quest submission error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (generatedResult) {
    return (
      <GeneratedAsset
        data={{
          id: generatedResult.id,
          name: generatedResult.name,
          imageUrl: generatedResult.imageUrl,
          visibility: generatedResult.visibility,
          description: generatedResult.description,
        }}
        onBack={() => setGeneratedResult(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Quest</h2>
        {error && <p className="text-red-500 font-bold">{error}</p>}

        {/* Quest Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Quest Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 text-white placeholder-gray-400 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter quest name"
          />
        </div>

        {/* Dropdown Fields */}
        {[
          { id: "type", label: "Quest Type", options: questTypes },
          { id: "tone", label: "Tone", options: questTones },
          { id: "complexity", label: "Complexity", options: complexityLevels },
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
              className={`block w-full mt-1 h-12 rounded-md bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500 px-3 ${
                missingFields.includes(id)
                  ? "border-[#FF6347] border-2"
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

        {/* Binary Selections (Checkboxes) */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "hasCombat", label: "Combat Encounters" },
            { id: "hasPuzzles", label: "Puzzles/Riddles" },
            { id: "hasSkillChallenges", label: "Skill Challenges" },
            { id: "hasDilemmas", label: "Moral Dilemmas" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center">
              <input
                type="checkbox"
                id={id}
                name={id}
                checked={formData[id]}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor={id} className="ml-2 text-white">
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Freeform Text Inputs */}
        {[
          { id: "location", label: "Location" },
          { id: "objective", label: "Objective" },
          { id: "antagonist", label: "Antagonist" },
          { id: "notableNpcs", label: "Notable NPCs" },
          { id: "customDescription", label: "Custom Description" },
        ].map(({ id, label }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-sm font-medium text-white"
            >
              {label}
            </label>
            <textarea
              id={id}
              name={id}
              rows={3}
              value={formData[id]}
              onChange={handleChange}
              className="block w-full mt-1 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 px-3"
              placeholder={`Describe ${label.toLowerCase()}`}
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
