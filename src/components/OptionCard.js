import React from "react";

export default function OptionCard({ title, description, image }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Select
        </button>
      </div>
    </div>
  );
}
