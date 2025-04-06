// PinterestGrid.js - Complete revised version
import { getPublicAssets } from "@/api";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function PinterestGrid({
  searchQuery = "",
  filters = {},
  isAuthenticated = false,
}) {
  // State to store images and control loading
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const gridRef = useRef(null);
  const auth = useAuth();
  const router = useRouter();

  // Memoize stable versions of props to prevent unnecessary re-renders
  const stableSearchQuery = useMemo(() => searchQuery, [searchQuery]);
  const stableFilters = useMemo(() => filters, [filters]);

  // Calculate how many placeholder images to show if needed
  const calculateInitialBatchSize = () => {
    // Base batch size on viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Estimate roughly how many images should fill viewport plus a bit more
    let columns = 2; // Default for mobile

    if (viewportWidth >= 640) columns = 3; // sm breakpoint
    if (viewportWidth >= 768) columns = 4; // md breakpoint
    if (viewportWidth >= 1024) columns = 5; // lg breakpoint

    // Estimate rows (viewport height / estimated image height) + buffer
    const estimatedRows = Math.ceil(viewportHeight / 300) + 1;

    // Return estimated number of images needed
    return columns * estimatedRows;
  };

  // Load assets from API on initial load
  useEffect(() => {
    if (!initialLoad) return;

    const fetchAssets = async () => {
      try {
        setLoading(true);
        // Use auth user if authenticated, otherwise make unauthenticated request
        const result = await getPublicAssets(
          auth.isAuthenticated ? auth.user : null,
        );

        if (result?.assets && result.assets.length > 0) {
          console.log("Loaded public assets:", result.assets.length);
          setAssets(result.assets);
          setFilteredAssets(result.assets);
          setHasMore(false); // We're not implementing pagination for now
        } else {
          // If no assets found, use placeholder images
          const placeholderCount = calculateInitialBatchSize();
          console.log(
            `No public assets found, using ${placeholderCount} placeholders`,
          );

          const placeholders = Array(placeholderCount)
            .fill(null)
            .map((_, index) => ({
              id: `placeholder-${index + 1}-${Date.now()}`,
              uuid: `placeholder-${index + 1}`,
              name: "Sample Asset",
              type:
                index % 4 === 0
                  ? "character"
                  : index % 4 === 1
                    ? "quest"
                    : index % 4 === 2
                      ? "location"
                      : "map",
              imageUrl: `/placeholder/p0${(index % 4) + 1}.png`,
              isPlaceholder: true,
            }));

          setAssets(placeholders);
          setFilteredAssets(placeholders);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching public assets:", error);

        // Fall back to placeholders on error
        const placeholderCount = calculateInitialBatchSize();
        const placeholders = Array(placeholderCount)
          .fill(null)
          .map((_, index) => ({
            id: `placeholder-${index + 1}-${Date.now()}`,
            uuid: `placeholder-${index + 1}`,
            name: "Sample Asset",
            type:
              index % 4 === 0
                ? "character"
                : index % 4 === 1
                  ? "quest"
                  : index % 4 === 2
                    ? "location"
                    : "map",
            imageUrl: `/placeholder/p0${(index % 4) + 1}.png`,
            isPlaceholder: true,
          }));

        setAssets(placeholders);
        setFilteredAssets(placeholders);
        setError("Failed to load assets from server");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchAssets();
  }, [initialLoad, auth.isAuthenticated, auth.user]);

  // Apply search query and filters when they change
  useEffect(() => {
    // Skip processing if no assets
    if (assets.length === 0) return;

    console.log("Filtering assets with:", {
      searchQuery: stableSearchQuery,
      filters: stableFilters,
    });

    // Create a new filtered array - don't modify existing state directly
    let results = [...assets];

    // Apply search query filter
    if (stableSearchQuery?.trim()) {
      const query = stableSearchQuery.toLowerCase().trim();
      results = results.filter(
        (asset) =>
          asset.name?.toLowerCase().includes(query) ||
          asset.type?.toLowerCase().includes(query) ||
          asset.description?.toLowerCase().includes(query),
      );
    }

    // Apply asset type filters
    if (stableFilters.assetTypes) {
      const selectedTypes = Object.entries(stableFilters.assetTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type);

      if (selectedTypes.length > 0) {
        results = results.filter(
          (asset) =>
            // Handle "environment" type in our filter but "location" in the backend
            selectedTypes.includes(asset.type) ||
            (asset.type === "location" &&
              selectedTypes.includes("environment")),
        );
      }
    }

    // Apply sort filter
    if (stableFilters.sortBy) {
      switch (stableFilters.sortBy) {
        case "recent":
          results.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          );
          break;
        case "oldest":
          results.sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
          );
          break;
        case "name_asc":
          results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
          break;
        case "name_desc":
          results.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
          break;
      }
    }

    // Apply time period filter
    if (stableFilters.timePeriod && stableFilters.timePeriod !== "all") {
      const now = new Date();
      let cutoffDate;

      switch (stableFilters.timePeriod) {
        case "week":
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      if (cutoffDate) {
        results = results.filter((asset) => {
          // Skip filtering placeholder assets
          if (asset.isPlaceholder) return true;

          const assetDate = new Date(asset.createdAt || 0);
          return assetDate >= cutoffDate;
        });
      }
    }

    // Only update state if the filtered results are actually different
    if (JSON.stringify(results) !== JSON.stringify(filteredAssets)) {
      setFilteredAssets(results);
    }
  }, [assets, stableSearchQuery, stableFilters, filteredAssets]);

  // Handle click on an asset
  const handleAssetClick = (asset) => {
    // Don't navigate for placeholder assets
    if (asset.isPlaceholder) {
      alert(
        "This is a placeholder asset. Log in and create your own assets to see real content!",
      );
      return;
    }

    console.log("Clicking asset:", asset);
    console.log("Asset UUID:", asset.uuid);

    // Store current page for back button functionality
    sessionStorage.setItem("previousPage", window.location.href);

    router.push(`/discover/${asset.uuid}`);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 p-8">Loading assets...</div>
    );
  }

  return (
    <div className="p-4" ref={gridRef}>
      {/* Header showing search results */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {filteredAssets.length === 0
              ? "No results found"
              : `Found ${filteredAssets.length} results for "${searchQuery}"`}
          </h2>
        </div>
      )}

      {/* Responsive grid for images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id || asset.uuid}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleAssetClick(asset)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.imageUrl || "/placeholder/p01.png"}
              alt={asset.name || "Asset Image"}
              className="h-full w-full object-cover aspect-square"
              loading="eager"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
              <p className="text-white text-sm truncate">
                {asset.name || "Untitled"}
              </p>
              <p className="text-gray-300 text-xs capitalize">
                {asset.type || "Asset"}
              </p>
              {asset.isPlaceholder && (
                <p className="text-yellow-400 text-xs">(Placeholder)</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && !loading && (
        <div className="text-center text-gray-500 p-8">
          {searchQuery
            ? "No assets found matching your search criteria. Try adjusting your filters."
            : "No public assets found. Create and share assets to see them here!"}
        </div>
      )}

      {error && (
        <div className="text-center text-amber-500 mt-4 p-2 bg-gray-900 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
