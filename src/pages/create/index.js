// pages/create/index.js

import CharacterForm from "@/components/CharacterForm";
import LocationsForm from "@/components/LocationForm";
import MapForm from "@/components/MapForm";
import QuestForm from "@/components/QuestForm";
import { useState } from "react";

const createOptions = [
  {
    id: "characters",
    title: "Character",
    image: "/placeholder/card_character.png", // Use the first image
  },
  {
    id: "locations",
    title: "Environment",
    image: "/placeholder/card_environment.png", // Use the second image
  },
  {
    id: "quests",
    title: "Quest",
    image: "/placeholder/card_quest.png", // Use the third image
  },
  {
    id: "maps",
    title: "TTG Map",
    image: "/placeholder/card_map.png", // Use the fourth image
  },
];

function CreatePage() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleGoBack = () => {
    setSelectedOption(null);
  };

  return (
    <div className="pt-4 pb-10 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center">
      {/* Conditional rendering based on selection */}
      {selectedOption === "characters" ? (
        <div className="w-full max-w-5xl mx-auto px-6">
          <CharacterForm onBack={handleGoBack} />
        </div>
      ) : selectedOption === "locations" ? (
        <div className="w-full max-w-5xl mx-auto px-6">
          <LocationsForm onBack={handleGoBack} />
        </div>
      ) : selectedOption === "maps" ? (
        <div className="w-full max-w-5xl mx-auto px-6">
          <MapForm onBack={handleGoBack} />
        </div>
      ) : selectedOption === "quests" ? (
        <div className="w-full max-w-5xl mx-auto px-6">
          <QuestForm onBack={handleGoBack} />
        </div>
      ) : (
        <div className="w-full max-w-[95%] lg:max-w-[85%] xl:max-w-[80%] mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Choose What to Create
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {createOptions.map((option) => (
              <div
                key={option.id}
                className="relative rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 shadow-lg"
                onClick={() => handleSelect(option.id)}
              >
                {/* Image Card */}
                <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Text overlay */}
                  <div className="absolute bottom-4 right-6 text-white text-4xl font-bold">
                    {option.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePage;
