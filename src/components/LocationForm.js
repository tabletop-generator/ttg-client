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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call or form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Create Location</h2>

        {/* First Row: Location Name and Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a type</option>
              {["placeHolder", "placeHolder", "placeHolder"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Section: Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          {/* Terrain */}
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
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            >
              <option value="">Select a terrain</option>
              {["placeHolder", "placeHolder", "placeHolder"].map((terrain) => (
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
              {["placeHolder", "placeHolder", "placeHolder"].map(
                (atmosphere) => (
                  <option key={atmosphere} value={atmosphere}>
                    {atmosphere}
                  </option>
                ),
              )}
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
              <option value="">Select an inhabitants</option>
              {["placeHolder", "placeHolder", "placeHolder"].map(
                (inhabitants) => (
                  <option key={inhabitants} value={inhabitants}>
                    {inhabitants}
                  </option>
                ),
              )}
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
              <option value="">Select an climate</option>
              {["placeHolder", "placeHolder", "placeHolder"].map((climate) => (
                <option key={climate} value={climate}>
                  {climate}
                </option>
              ))}
            </select>
          </div>

          {/* danger level */}
          <div>
            <label
              htmlFor="danger level"
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
              <option value="">Select an danger level</option>
              {["placeHolder", "placeHolder", "placeHolder"].map(
                (dangerLevel) => (
                  <option key={dangerLevel} value={dangerLevel}>
                    {dangerLevel}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* notable features */}
          <div>
            <label
              htmlFor="notableFeatures"
              className="block text-sm font-medium text-white"
            >
              Notable Features
            </label>
            <textarea
              id="notableFeatures"
              name="notableFeatures"
              rows={3}
              value={formData.notableFeatures}
              onChange={handleChange}
              className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              placeholder="Enter notable features here"
            />
          </div>
        </div>

        {/* lore */}
        <div>
          <label
            htmlFor="lore"
            className="block text-sm font-medium text-white"
          >
            Lore
          </label>
          <textarea
            id="lore"
            name="lore"
            rows={3}
            value={formData.lore}
            onChange={handleChange}
            className="block w-full mt-1 h-12 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
            placeholder="Enter lore here"
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
        >
          Submit
        </button>
      </div>
    </form>
  );
}
