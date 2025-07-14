"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import ProductCard from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    subCategories: [],
    minPrice: 0,
    maxPrice: 100000,
    inStock: false,
    sort: "relevance",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const query = searchParams.get("q") || "";

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/products/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.success) {
          setAllProducts(data.products);

          // Calculate initial price range
          let minPrice = Number.POSITIVE_INFINITY;
          let maxPrice = 0;
          data.products.forEach((product) => {
            if (product.price < minPrice) minPrice = product.price;
            if (product.price > maxPrice) maxPrice = product.price;
          });

          // Reset filters when new search is performed
          setFilters({
            brands: [],
            subCategories: [],
            minPrice: Math.floor(minPrice) || 0,
            maxPrice: Math.ceil(maxPrice) || 100000,
            inStock: false,
            sort: "relevance",
          });
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  // Calculate available filters
  const { brands, subCategories, minPriceRange, maxPriceRange } =
    useMemo(() => {
      const brandSet = new Set();
      const subCategorySet = new Set();
      let minPrice = Number.POSITIVE_INFINITY;
      let maxPrice = 0;

      allProducts.forEach((product) => {
        if (product.brand) brandSet.add(product.brand);

        const category = product.subSubCategory || product.subCategory;
        if (category) subCategorySet.add(category);

        if (product.price < minPrice) minPrice = product.price;
        if (product.price > maxPrice) maxPrice = product.price;
      });

      return {
        brands: Array.from(brandSet).sort(),
        subCategories: Array.from(subCategorySet).sort(),
        minPriceRange: Math.floor(minPrice),
        maxPriceRange: Math.ceil(maxPrice),
      };
    }, [allProducts]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(
        (product) => product.brand && filters.brands.includes(product.brand)
      );
    }

    // Apply subCategory filter
    if (filters.subCategories.length > 0) {
      result = result.filter((product) => {
        const category = product.subSubCategory || product.subCategory;
        return category && filters.subCategories.includes(category);
      });
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply in-stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0);
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
        return [...result].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "in_stock_first":
        return [...result].sort((a, b) => b.stock - a.stock);
      default: // relevance
        return result;
    }
  }, [allProducts, filters]);

  // Count products per brand/subCategory
  const brandCounts = useMemo(() => {
    const counts = {};
    brands.forEach((brand) => {
      counts[brand] = allProducts.filter((p) => p.brand === brand).length;
    });
    return counts;
  }, [allProducts, brands]);

  const subCategoryCounts = useMemo(() => {
    const counts = {};
    subCategories.forEach((category) => {
      counts[category] = allProducts.filter((p) => {
        const cat = p.subSubCategory || p.subCategory;
        return cat === category;
      }).length;
    });
    return counts;
  }, [allProducts, subCategories]);

  // Handle filter changes
  const handleBrandChange = (brand) => {
    setFilters((prev) => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleSubCategoryChange = (category) => {
    setFilters((prev) => {
      const newCategories = prev.subCategories.includes(category)
        ? prev.subCategories.filter((c) => c !== category)
        : [...prev.subCategories, category];
      return { ...prev, subCategories: newCategories };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      subCategories: [],
      minPrice: minPriceRange,
      maxPrice: maxPriceRange,
      inStock: false,
      sort: "relevance",
    });
  };

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="p-4 mb-4 border rounded-lg shadow-sm backdrop-blur-md bg-white/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Filters</h2>
        <Button onClick={clearFilters} className="text-sm hover:underline">
          Clear all
        </Button>
      </div>

      {/* In Stock filter */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleFilterChange}
            className="mr-2 h-4 w-4 text-[#02D866] rounded focus:ring-[#02D866]"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Price filter */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min={0}
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#02D866] focus:border-[#02D866]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              max={maxPriceRange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#02D866] focus:border-[#02D866]"
            />
          </div>
        </div>
        <div className="flex items-center mt-2 space-x-2">
          <span className="text-xs text-gray-500">₹{minPriceRange}</span>
          <input
            type="range"
            min={minPriceRange}
            max={maxPriceRange}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number.parseInt(e.target.value),
              }))
            }
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#02D866]"
          />
          <span className="text-xs text-gray-500">₹{maxPriceRange}</span>
        </div>
      </div>

      {/* Brand filter */}
      {brands.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Brands</h3>
          <div className="overflow-y-auto max-h-60">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2 h-4 w-4 text-[#02D866] rounded focus:ring-[#02D866]"
                />
                <span className="flex-1 truncate">{brand}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({brandCounts[brand] || 0})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SubCategory filter */}
      {subCategories.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Categories</h3>
          <div className="overflow-y-auto max-h-60">
            {subCategories.map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.subCategories.includes(category)}
                  onChange={() => handleSubCategoryChange(category)}
                  className="mr-2 h-4 w-4 text-[#02D866] rounded focus:ring-[#02D866]"
                />
                <span className="flex-1 truncate">{category}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({subCategoryCounts[category] || 0})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-foreground">
      {/* Full width container with proper padding */}
      <div className="w-full px-2 max-w-none sm:px-4 lg:px-6 xl:px-8">
        {/* Header Section */}
        <div className="py-4 sm:py-6">
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Search Results for "{query}"
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                {filteredProducts.length} of {allProducts.length} results
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex justify-center w-full gap-2 lg:hidden">
                <div className="flex items-center ">
                  <label className="hidden mr-2 text-sm font-medium text-gray-700 ">
                    Sort by:
                  </label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02D866]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="in_stock_first">In Stock</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center justify-center px-4 py-2 text-white rounded-md hover:bg-[#02b859] transition-colors lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>{" "}
              </div>

              <div className="items-center hidden space-x-4 lg:flex">
                <div className="flex items-center">
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02D866]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="in_stock_first">In Stock First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4 lg:gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="flex-shrink-0 hidden w-64 lg:block xl:w-72">
            <div className="sticky top-4">
              <FilterSidebar />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center justify-center min-h-[8rem] w-full">
                  <Loader fullScreen={false} />
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  No products found
                </h2>
                <p className="mb-6 text-gray-600">
                  Try different search terms or filters
                </p>
                <Button
                  onClick={clearFilters}
                  className="px-6 py-2 text-white rounded-lg hover:bg-[#02b859] transition-colors"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-[#02D866]">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <FilterSidebar />
            </div>

            <div className="p-4 border-t">
              <Button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 text-white rounded-lg hover:bg-[#02b859] transition-colors"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
