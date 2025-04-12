// /src/components/PinterestGrid.js
import { searchAssets } from "@/api";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false); // Start with false to avoid unnecessary loading indicators
  const [error, setError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isPendingSearch, setIsPendingSearch] = useState(false); // Track if a search is pending but not started
  const gridRef = useRef(null);
  const searchTimerRef = useRef(null);
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

  // Function to perform the search via API with improved loading state management
  const performSearch = useCallback(async () => {
    // Check for active search criteria
    const hasTextSearch = stableSearchQuery && stableSearchQuery.length >= 2;
    const hasTypeFilters = Object.values(stableFilters.assetTypes).some(
      Boolean,
    );

    // Cancel search if no valid search criteria
    if (!hasTextSearch && !hasTypeFilters) {
      console.log("Search criteria insufficient - skipping API search");
      setIsSearchMode(false);
      setIsPendingSearch(false);
      setAssets([]);
      setFilteredAssets([]);
      return;
    }

    console.log("Performing API search:", {
      query: stableSearchQuery,
      filters: stableFilters,
    });

    // Set search mode
    setIsSearchMode(true);
    setIsPendingSearch(false);
    setLoading(true);
    setError(null);

    try {
      // Build search parameters object
      const searchParams = {
        query: stableSearchQuery,
      };

      // Add type filters (map from our UI types to API types)
      if (stableFilters.assetTypes) {
        const selectedTypes = Object.entries(stableFilters.assetTypes)
          .filter(([_, selected]) => selected)
          .map(([type]) => {
            // Map "environment" in UI to "location" for API
            return type === "environment" ? "location" : type;
          });

        if (selectedTypes.length > 0) {
          searchParams.type = selectedTypes;
        }
      }

      // Delay showing the loading indicator for very fast responses
      const loadingTimer = setTimeout(() => {
        if (isPendingSearch) {
          setLoading(true);
        }
      }, 400);

      // Perform the search using the API
      console.log("Calling searchAssets with params:", searchParams);
      const result = await searchAssets(
        auth.isAuthenticated ? auth.user : null,
        searchParams,
      );

      // Clear the loading timer
      clearTimeout(loadingTimer);

      console.log("Search API returned:", result);

      if (result?.assets) {
        console.log(`Search returned ${result.assets.length} assets`);

        // IMPORTANT: Always use the search results directly, don't filter the original assets
        let searchResults = [...result.assets];

        // Apply client-side filters that the API doesn't support

        // Apply sort filter
        if (stableFilters.sortBy) {
          switch (stableFilters.sortBy) {
            case "recent":
              searchResults.sort(
                (a, b) =>
                  new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
              );
              break;
            case "oldest":
              searchResults.sort(
                (a, b) =>
                  new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
              );
              break;
            case "name_asc":
              searchResults.sort((a, b) =>
                (a.name || "").localeCompare(b.name || ""),
              );
              break;
            case "name_desc":
              searchResults.sort((a, b) =>
                (b.name || "").localeCompare(a.name || ""),
              );
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
            searchResults = searchResults.filter((asset) => {
              const assetDate = new Date(asset.createdAt || 0);
              return assetDate >= cutoffDate;
            });
          }
        }

        console.log("Final filtered search results:", searchResults.length);

        // CRITICAL FIX: Set both assets and filteredAssets to the search results
        setAssets(searchResults);
        setFilteredAssets(searchResults);
      } else {
        console.log("No search results found");
        setAssets([]);
        setFilteredAssets([]);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setError("Failed to load search results. Please try again.");
      // Clear results on error
      setAssets([]);
      setFilteredAssets([]);
    } finally {
      setLoading(false);
    }
  }, [
    stableSearchQuery,
    stableFilters,
    auth.isAuthenticated,
    auth.user,
    isPendingSearch,
  ]);

  useEffect(() => {
    // Debug logging
    if (stableSearchQuery) {
      console.log("Search active:", {
        query: stableSearchQuery,
        filters: stableFilters,
        resultCount: filteredAssets.length,
        isSearchMode,
        assets: filteredAssets,
      });
    }
  }, [stableSearchQuery, stableFilters, filteredAssets, isSearchMode]);

  // Enhanced debounced search handling
  useEffect(() => {
    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set a flag indicating search is pending
    setIsPendingSearch(true);

    // Check if any search criteria are active
    const anySearchCriteria =
      stableSearchQuery ||
      Object.values(stableFilters.assetTypes).some(Boolean);

    // Only proceed with search if we have criteria
    if (anySearchCriteria) {
      // If search query or filters are active, use search mode with debounce
      console.log("Search mode active - scheduling performSearch()");

      // Only show loading state if the query is substantive
      if (stableSearchQuery && stableSearchQuery.length >= 2) {
        searchTimerRef.current = setTimeout(() => {
          performSearch();
        }, 500); // Increased debounce time for better UX
      } else if (Object.values(stableFilters.assetTypes).some(Boolean)) {
        // If only filters are active, search immediately
        performSearch();
      } else {
        setIsPendingSearch(false);
        // Clear results if no valid search criteria
        setAssets([]);
        setFilteredAssets([]);
      }
    } else {
      // If no search criteria are active, show empty state
      console.log("No search criteria active - showing empty state");
      setIsPendingSearch(false);
      setIsSearchMode(false);
      setLoading(false);
      setAssets([]);
      setFilteredAssets([]);
    }

    // Cleanup function
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [
    auth.isAuthenticated,
    auth.user,
    performSearch,
    stableSearchQuery,
    stableFilters,
  ]);

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

  // Different loading indicators for search mode vs initial load
  if (loading && filteredAssets.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-center text-gray-400">
          {isSearchMode ? "Searching for assets..." : "Loading assets..."}
        </p>
      </div>
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

      {/* Loading indicator - now we won't show any indicator when updating existing results */}
      {/* This keeps the original loading behavior but with our improved frequency logic */}

      {/* Responsive grid for images - only display if we have assets */}
      {filteredAssets.length > 0 && (
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
      )}

      {!loading && (
        <div className="text-center p-8">
          {filteredAssets.length === 0 && isSearchMode ? (
            <p className="text-gray-500">
              No assets found matching your search criteria. Try adjusting your
              filters.
            </p>
          ) : filteredAssets.length === 0 && !isSearchMode ? (
            <div className="py-8">
              <div className="mb-6 font-mono text-3xl text-purple-400">
                {/* ASCII art with proper escaping */}
                <pre className="inline-block text-center whitespace-pre">
                  {`(◕‿◕)`}
                </pre>
              </div>
              <p className="text-xl text-gray-400 mb-4">
                Ready to explore magical creations?
              </p>
              <p className="text-lg text-gray-500">
                Enter a search term or select asset types above to begin!
              </p>
            </div>
          ) : null}
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
