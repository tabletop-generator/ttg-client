import React from "react";
import OptionCard from "@/components/OptionCard";

const options = [
  {
    id: "characters",
    title: "Characters",
    description: "Generate unique characters for your tabletop campaigns.",
    image: "/images/characters-preview.jpg",
  },
  {
    id: "environments",
    title: "Environments",
    description: "Create breathtaking environments for your story.",
    image: "/images/environments-preview.jpg",
  },
  {
    id: "quests",
    title: "Quests",
    description: "Design epic quests to immerse your players.",
    image: "/images/quests-preview.jpg",
  },
  {
    id: "maps",
    title: "Maps",
    description: "Generate detailed maps for exploration.",
    image: "/images/maps-preview.jpg",
  },
];

export default function CreatePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Choose What to Create
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <OptionCard
            key={option.id}
            title={option.title}
            description={option.description}
            image={option.image}
          />
        ))}
      </div>
    </div>
  );
}
