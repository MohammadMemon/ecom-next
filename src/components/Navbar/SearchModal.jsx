"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router for navigation
import Portal from "../ui/portal";
import { Button } from "../ui/button";

export default function SearchModal() {
  const router = useRouter(); // Initialize router
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const popularSearches = [
    "Bike",
    "Helmet",
    "Pedals",
    "Brake Set",
    "Handle Bar",
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const searches = localStorage.getItem("recentSearches");
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }
  }, []);

  // Generate suggestions
  useEffect(() => {
    if (query.length > 1) {
      const allSuggestions = [...recentSearches, ...popularSearches];
      const uniqueSuggestions = Array.from(new Set(allSuggestions));
      const matches = uniqueSuggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;

    // Update recent searches
    const updatedSearches = [
      query,
      ...recentSearches.filter((item) => item !== query).slice(0, 4),
    ];
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    setIsOpen(false);

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-[#02D866] transition-colors"
      >
        <Search className="w-6 h-6" />
      </button>

      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            <div
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">
                  Search Products
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02D866]"
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  className="px-4 py-2 text-white rounded-lg hover:bg-[#02b859] transition-colors flex items-center"
                >
                  <Search className="w-4 h-4 mr-1" />
                </Button>
              </div>

              {suggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">
                    Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(suggestion);
                          handleSearch();
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#02D866] hover:text-white rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearch();
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#02D866] hover:text-white rounded-full transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSearch();
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#02D866] hover:text-white rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
