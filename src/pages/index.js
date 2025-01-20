import GradientOverlay from "../components/GradientTransitionLarge";
import PinterestGrid from "../components/PinterestGrid";
import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <>
      {/* Add a container for all elements */}
      <div className="flex flex-col items-center space-y-8 p-6">
        <img src="/logo_hero.png" alt="TTG logo"></img>
        <div className="w-full flex justify-center">
          <SearchBar />
        </div>
        <GradientOverlay breakpoint1={`50`} breakpoint2={`70`} />
        <PinterestGrid />
      </div>
    </>
  );
}
