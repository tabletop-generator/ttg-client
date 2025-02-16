// pages/profile/[id].js

import AssetDetailsCard from "@/components/Profile/AssetDetailsCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AssetDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the asset ID from the route

  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Placeholder assets (to simulate fetching from an API)
  const placeholderAssets = [
    {
      id: "asset1",
      name: "Lyricelle Emberwhisper",
      created: "2021-11-02T15:09:50.403Z",
      type: "character",
      image: "/placeholder/card_character.png",
      backstory: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur semper ex arcu, porttitor pretium felis tincidunt eu. Quisque vel tortor dignissim, posuere arcu non, iaculis est. 
      Donec ipsum nisi, ultrices sed magna et, porttitor pretium velit. 
      Donec ut eros eu nisi convallis blandit. Maecenas tempus urna vitae turpis semper lobortis. Morbi placerat viverra mattis. Maecenas condimentum, tortor id aliquet laoreet, magna sem interdum magna, vel consequat neque sem eget nisl.
      Curabitur eget quam ullamcorper, malesuada ipsum a, iaculis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nunc dui, in dignissim lectus malesuada quis. Aliquam velit dolor, 
      luctus id feugiat quis, convallis non massa. Etiam imperdiet dignissim lectus, ut porta risus elementum eu. Nam in tristique nibh, eget congue nulla. Etiam eget feugiat est.
      `,
    },
    {
      id: "asset2",
      name: "Whispering Woods",
      created: "2021-11-03T10:45:30.120Z",
      type: "location",
      image: "/placeholder/card_environment.png",
      backstory: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur semper ex arcu, porttitor pretium felis tincidunt eu. Quisque vel tortor dignissim, posuere arcu non, iaculis est. 
      Donec ipsum nisi, ultrices sed magna et, porttitor pretium velit. 
      Donec ut eros eu nisi convallis blandit. Maecenas tempus urna vitae turpis semper lobortis. Morbi placerat viverra mattis. Maecenas condimentum, tortor id aliquet laoreet, magna sem interdum magna, vel consequat neque sem eget nisl.
      Curabitur eget quam ullamcorper, malesuada ipsum a, iaculis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nunc dui, in dignissim lectus malesuada quis. Aliquam velit dolor, 
      luctus id feugiat quis, convallis non massa. Etiam imperdiet dignissim lectus, ut porta risus elementum eu. Nam in tristique nibh, eget congue nulla. Etiam eget feugiat est.
      `,
    },
    {
      id: "asset3",
      name: "Map of Eldoria",
      created: "2021-11-04T08:15:45.879Z",
      type: "map",
      image: "/placeholder/card_map.png",
      backstory: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur semper ex arcu, porttitor pretium felis tincidunt eu. Quisque vel tortor dignissim, posuere arcu non, iaculis est. 
      Donec ipsum nisi, ultrices sed magna et, porttitor pretium velit. 
      Donec ut eros eu nisi convallis blandit. Maecenas tempus urna vitae turpis semper lobortis. Morbi placerat viverra mattis. Maecenas condimentum, tortor id aliquet laoreet, magna sem interdum magna, vel consequat neque sem eget nisl.
      Curabitur eget quam ullamcorper, malesuada ipsum a, iaculis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nunc dui, in dignissim lectus malesuada quis. Aliquam velit dolor, 
      luctus id feugiat quis, convallis non massa. Etiam imperdiet dignissim lectus, ut porta risus elementum eu. Nam in tristique nibh, eget congue nulla. Etiam eget feugiat est.
      `,
    },
    {
      id: "asset4",
      name: "Quest for the Eternal Flame",
      created: "2021-11-05T13:50:00.000Z",
      type: "quest",
      image: "/placeholder/card_quest.png",
      backstory: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur semper ex arcu, porttitor pretium felis tincidunt eu. Quisque vel tortor dignissim, posuere arcu non, iaculis est. 
      Donec ipsum nisi, ultrices sed magna et, porttitor pretium velit. 
      Donec ut eros eu nisi convallis blandit. Maecenas tempus urna vitae turpis semper lobortis. Morbi placerat viverra mattis. Maecenas condimentum, tortor id aliquet laoreet, magna sem interdum magna, vel consequat neque sem eget nisl.
      Curabitur eget quam ullamcorper, malesuada ipsum a, iaculis felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nunc dui, in dignissim lectus malesuada quis. Aliquam velit dolor, 
      luctus id feugiat quis, convallis non massa. Etiam imperdiet dignissim lectus, ut porta risus elementum eu. Nam in tristique nibh, eget congue nulla. Etiam eget feugiat est.
      `,
    },
  ];

  useEffect(() => {
    if (id) {
      // Simulate fetching the asset by ID
      const foundAsset = placeholderAssets.find((asset) => asset.id === id);

      if (foundAsset) {
        setAsset(foundAsset);
      } else {
        setAsset(null); // Handle "asset not found" case
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Loading...</h1>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Asset not found</h1>
      </div>
    );
  }

  return <AssetDetailsCard asset={asset} onBack={() => router.back()} />;
}

export default AssetDetails;
