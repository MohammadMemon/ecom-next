"use client";

import ProductCard from "@/components/Product/ProductCard";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import { useEffect, useState } from "react";

export default function RecentlyViewed() {
  const [loading, setLoading] = useState(true);

  // Subscribe to the store directly
  const products = useRecentlyViewedStore((state) => state.products);
  const getProductsWithStock = useRecentlyViewedStore(
    (state) => state.getProductsWithStock
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await getProductsWithStock();
      } catch (error) {
        console.error("Error in Recently Viewed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array since we're subscribing to store changes

  console.log("products:", products);

  if (loading) {
    return (
      <div className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Recently Viewed Product
        </h1>
        <div className="flex items-center justify-center h-32">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">
        Recently Viewed Product
      </h1>
      <div className="grid w-full grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          [...products].map((product, index) => (
            <ProductCard key={product._id} index={index} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
