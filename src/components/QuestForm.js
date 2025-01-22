import GeneratedAsset from "@/components/GeneratedAsset";
import { useState } from "react";
import Select from "react-select";

export default function QuestForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: "", // Quest name
    type: [],
    objective: "",
    combatEncounters: "",
    questGiver: "",
    rewards: "",
    tone: "",
    duration: "",
    obstacles: "",
    antagonistAndEnemies: "",
    motivation: "",
    consequences: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null); // Placeholder for API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options for the Type Multi-Select
  const options = [
    { value: "PlaceHolder1", label: "PlaceHolder1" },
    { value: "PlaceHolder2", label: "PlaceHolder2" },
    { value: "PlaceHolder3", label: "PlaceHolder3" },
  ];

  // Custom styles for React-Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1F2937",
      border: "1px solid #4B5563",
      color: "white",
      height: "48px",
      borderRadius: "0.375rem",
      padding: "0 0.75rem",
      marginTop: "4px",
      boxShadow: state.isFocused ? "0 0 0 2px #6366F1" : "none",
      "&:hover": {
        borderColor: "#6366F1",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937",
      borderRadius: "0.375rem",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#374151" : "transparent",
      color: "white",
      "&:hover": {
        backgroundColor: "#4B5563",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#E5E7EB",
      "&:hover": {
        backgroundColor: "#4B5563",
        color: "white",
      },
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Form data submitted:", formData);

      const response = {
        // Simulated API response (replace with actual API call)
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
        data={{ id: "quests", ...formData, generated: generatedResult }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Quests</h2>

        {/* name and Type fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Quest name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the name of the quest"
            />
          </div>

          {/* Type Multi-Select */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-white"
            >
              Quest Type
            </label>
            <Select
              id="type"
              isMulti
              options={options}
              value={options.filter((option) =>
                formData.type.includes(option.value),
              )}
              onChange={handleTypeChange}
              styles={customStyles}
              placeholder="Select quest type(s)"
            />
          </div>
        </div>

        {/* Objective and Combat Encounters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-white"
            >
              Objective
            </label>
            <input
              type="text"
              id="objective"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the objective of the quest"
            />
          </div>

          <div>
            <label
              htmlFor="combatEncounters"
              className="block text-sm font-medium text-white"
            >
              Combat Encounters
            </label>
            <select
              id="combatEncounters"
              name="combatEncounters"
              value={formData.combatEncounters}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select combat encounters</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map(
                (combatEncounters) => (
                  <option key={combatEncounters} value={combatEncounters}>
                    {combatEncounters}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* Quest Giver, Rewards, Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div>
            <label
              htmlFor="questGiver"
              className="block text-sm font-medium text-white"
            >
              Quest Giver
            </label>
            <input
              type="text"
              id="questGiver"
              name="questGiver"
              value={formData.questGiver}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the quest giver"
            />
          </div>

          <div>
            <label
              htmlFor="rewards"
              className="block text-sm font-medium text-white"
            >
              Rewards
            </label>
            <input
              type="text"
              id="rewards"
              name="rewards"
              value={formData.rewards}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the rewards for the quest"
            />
          </div>
        </div>

        {/* Duration and Obstacles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-white"
            >
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select the duration</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map(
                (duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="obstacles"
              className="block text-sm font-medium text-white"
            >
              Obstacles
            </label>
            <input
              type="text"
              id="obstacles"
              name="obstacles"
              value={formData.obstacles}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the obstacles for the quest"
            />
          </div>
        </div>

        {/* Antagonist and Enemies */}
        <div>
          <label
            htmlFor="antagonistAndEnemies"
            className="block text-sm font-medium text-white"
          >
            Antagonist and Enemies
          </label>
          <textarea
            id="antagonistAndEnemies"
            name="antagonistAndEnemies"
            rows={3}
            value={formData.antagonistAndEnemies}
            onChange={handleChange}
            className="block w-full mt-1 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 pt-2 pl-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter Antagonist and Enemies details"
          />
        </div>

        {/* Motivation and Consequences */}
        {["motivation", "consequences"].map((field) => (
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
        >
          Submit
        </button>
      </div>
    </form>
  );
}
