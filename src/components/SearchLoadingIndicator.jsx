// components/SearchLoadingIndicator.js
import { Loader2 } from "lucide-react";

export default function SearchLoadingIndicator() {
  return (
    <div className="absolute top-0 left-0 w-full flex justify-center z-30 pt-4">
      <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        <span>Searching assets...</span>
      </div>
    </div>
  );
}
