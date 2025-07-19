"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export default function CategoryClient({
  products,
  currentCategoryLabel,
  slugParts,
}) {
  const { categorySlug, subCategorySlug, subSubCategorySlug } = slugParts;
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 100000,
    inStock: false,
    sort: "relevance",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const getEffectiveStock = (product) => {
    // If product has root stock, use it
    if (product.stock > 0) return product.stock;

    // Otherwise, calculate from variants
    const allOptions = product.variants?.flatMap((v) => v.options || []) || [];
    return allOptions.reduce((sum, opt) => sum + (opt.stock || 0), 0);
  };

  // Calculate available filters
  const { brands, categories, minPriceRange, maxPriceRange } = useMemo(() => {
    const brandSet = new Set();
    const categorySet = new Set();
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    products.forEach((product) => {
      if (product.brand) brandSet.add(product.brand);

      // Determine which category level to show based on URL
      if (!subCategorySlug) {
        // Show subcategories if we're at category level
        if (product.subCategory) categorySet.add(product.subCategory);
      } else if (!subSubCategorySlug) {
        // Show subsubcategories if we're at subcategory level
        if (product.subSubCategory) categorySet.add(product.subSubCategory);
      }

      // Get all prices from product (root price + all variant prices)
      const prices = [];

      // Add root price if it exists
      if (typeof product.price === "number" && product.price > 0) {
        prices.push(product.price);
      }

      // Add all variant prices
      if (product.variants?.length > 0) {
        product.variants.forEach((variant) => {
          if (variant.options?.length > 0) {
            variant.options.forEach((option) => {
              if (typeof option.price === "number" && option.price > 0) {
                prices.push(option.price);
              }
            });
          }
        });
      }

      // Update min/max from all prices found
      prices.forEach((price) => {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      });
    });

    return {
      brands: Array.from(brandSet).sort(),
      categories: Array.from(categorySet).sort(),
      minPriceRange:
        minPrice === Number.POSITIVE_INFINITY ? 0 : Math.floor(minPrice),
      maxPriceRange: Math.ceil(maxPrice),
    };
  }, [products, subCategorySlug, subSubCategorySlug]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(
        (product) => product.brand && filters.brands.includes(product.brand)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) => {
        const category = !subCategorySlug
          ? product.subCategory
          : !subSubCategorySlug
          ? product.subSubCategory
          : null;
        return category && filters.categories.includes(category);
      });
    }

    // Apply price filter
    result = result.filter((product) => {
      // Get price from variants if no root price
      const effectivePrice =
        typeof product.price === "number" && product.price > 0
          ? product.price
          : product.variants?.flatMap((v) => v.options || [])?.[0]?.price ?? 0;

      return (
        effectivePrice >= filters.minPrice && effectivePrice <= filters.maxPrice
      );
    });

    // Apply in-stock filter - FIXED to check variants too
    if (filters.inStock) {
      result = result.filter((product) => getEffectiveStock(product) > 0);
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        return [...result].sort((a, b) => {
          const priceA =
            a.price ||
            a.variants?.flatMap((v) => v.options || [])?.[0]?.price ||
            0;
          const priceB =
            b.price ||
            b.variants?.flatMap((v) => v.options || [])?.[0]?.price ||
            0;
          return priceA - priceB;
        });
      case "price_desc":
        return [...result].sort((a, b) => {
          const priceA =
            a.price ||
            a.variants?.flatMap((v) => v.options || [])?.[0]?.price ||
            0;
          const priceB =
            b.price ||
            b.variants?.flatMap((v) => v.options || [])?.[0]?.price ||
            0;
          return priceB - priceA;
        });
      case "newest":
        return [...result].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "in_stock_first":
        return [...result].sort(
          (a, b) => getEffectiveStock(b) - getEffectiveStock(a)
        );
      default:
        return result;
    }
  }, [products, filters, subCategorySlug, subSubCategorySlug]);

  // Count products per brand/category
  const brandCounts = useMemo(() => {
    const counts = {};
    brands.forEach((brand) => {
      counts[brand] = products.filter((p) => p.brand === brand).length;
    });
    return counts;
  }, [products, brands]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((category) => {
      counts[category] = products.filter((p) => {
        const cat = !subCategorySlug
          ? p.subCategory
          : !subSubCategorySlug
          ? p.subSubCategory
          : null;
        return cat === category;
      }).length;
    });
    return counts;
  }, [products, categories, subCategorySlug, subSubCategorySlug]);

  // Handle filter changes
  const handleBrandChange = (brand) => {
    setFilters((prev) => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => {
      let newValue = type === "checkbox" ? checked : value;

      // Handle price validation
      if (name === "minPrice") {
        const numValue = Number(value);
        newValue = Math.max(minPriceRange, Math.min(numValue, prev.maxPrice));
      } else if (name === "maxPrice") {
        const numValue = Number(value);
        newValue = Math.min(maxPriceRange, Math.max(numValue, prev.minPrice));
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      categories: [],
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

        {/* Number Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min={minPriceRange}
              max={filters.maxPrice}
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
              min={filters.minPrice}
              max={maxPriceRange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#02D866] focus:border-[#02D866]"
            />
          </div>
        </div>

        {/* Single Range Slider for Max Price */}
        <div className="mt-3">
          <label className="block mb-1 text-xs text-gray-500">
            Adjust Max Price
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">₹{minPriceRange}</span>
            <input
              type="range"
              min={minPriceRange}
              max={maxPriceRange}
              value={filters.maxPrice}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value);
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: value,
                  // Ensure minPrice doesn't exceed maxPrice
                  minPrice: Math.min(prev.minPrice, value),
                }));
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#02D866]"
            />
            <span className="text-xs text-gray-500">₹{maxPriceRange}</span>
          </div>
        </div>
      </div>

      {/* Category filter - only show if there are categories to filter */}
      {categories.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            {!subCategorySlug
              ? "Subcategories"
              : !subSubCategorySlug
              ? "Sub-subcategories"
              : ""}
          </h3>
          <div className="overflow-y-auto max-h-60">
            {categories.map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 h-4 w-4 text-[#02D866] rounded focus:ring-[#02D866]"
                />
                <span className="flex-1 truncate">{category}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({categoryCounts[category] || 0})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="w-full px-2 max-w-none sm:px-4 lg:px-6 xl:px-8">
        {/* Header Section */}
        <div className="py-4 sm:py-6">
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {currentCategoryLabel}
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                {filteredProducts.length} of {products.length} products
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
                  className="flex items-center justify-center px-4 py-2 text-white rounded-md hover:bg-[#02b859] transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
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
            {filteredProducts.length > 0 ? (
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
                <p className="mb-6 text-gray-600">Try adjusting your filters</p>
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
