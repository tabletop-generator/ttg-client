import { useState } from "react";
import Select from "react-select";

export default function QuestForm({ onBack }) {
  const [formData, setFormData] = useState({
    title: "",
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

  // Handle change for regular inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle change for React-Select
  const handleTypeChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Quests</h2>

        {/* First Row: Title and Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white"
            >
              Quest Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the title of the quest"
            />
          </div>

          {/* Type (React-Select Multi-Select) */}
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
        {/* Second Row: Objective and Combat Encounters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Objective */}
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

          {/* Combat Encounters */}
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
        {/* Third Row: Location and Combat QuestGiver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-white"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter the location of the quest"
            />
          </div>

          {/* Quest Giver */}
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
              placeholder="Enter the Quest Giver of the quest"
            />
          </div>
        </div>

        {/* Forth Row: Rewards and Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Rewards */}
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

          {/* Tone */}
          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-white"
            >
              Tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select the Tone</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fifth Row: Duration and Obstacles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Duration */}
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
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Obstacles */}
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

        {/* antagonistAndEnemies, motivation, consequences */}
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
