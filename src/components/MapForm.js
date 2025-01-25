import GeneratedAsset from "@/components/GeneratedAsset";
import { useState } from "react";
import Select from "react-select";

export default function MapForm({ onBack }) {
  // Initialize form state with all fields, including a unique ID
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    class: "",
    style: "",
    scale: "",
    terrain: [], // Multi-select for terrain options
    orientation: "",
    poi: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null); // Placeholder for API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options for the Terrain Multi-Select
  const options = [
    { value: "PlaceHolder1", label: "PlaceHolder1" },
    { value: "PlaceHolder2", label: "PlaceHolder2" },
    { value: "PlaceHolder3", label: "PlaceHolder3" },
  ];

  // Custom styles for Terrain Multi-Select
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

  const handleTerrainChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      terrain: selectedOptions
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
        data={{ id: "maps", ...formData, generated: generatedResult }}
      />
    );
  }

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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a type</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label
              htmlFor="style"
              className="block text-sm font-medium text-white"
            >
              Style
            </label>
            <select
              id="style"
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a style</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map((style) => (
                <option key={style} value={style}>
                  {style}
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a scale</option>
              {["PlaceHolder1", "PlaceHolder2", "PlaceHolder3"].map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>

          {/* Terrain (Multi-Select) */}
          <div>
            <label
              htmlFor="terrain"
              className="block text-sm font-medium text-white"
            >
              Terrain
            </label>
            <Select
              id="terrain"
              isMulti
              options={options}
              value={options.filter((option) =>
                formData.terrain.includes(option.value),
              )}
              onChange={handleTerrainChange}
              styles={customStyles}
              placeholder="Select terrains"
            />
          </div>
          {/* POI */}
          <div>
            <label
              htmlFor="poi"
              className="block text-sm font-medium text-white"
            >
              POI
            </label>
            <textarea
              id="poi"
              name="poi"
              rows={3}
              value={formData.poi}
              onChange={handleChange}
              className="block w-full mt-1 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter POI here"
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
