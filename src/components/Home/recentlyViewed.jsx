"use client";

import ProductCard from "@/components/Product/ProductCard";
import { useEffect, useState } from "react";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewedProducts");
      const parsed = stored ? JSON.parse(stored) : [];
      const reversed = parsed.reverse();
      setProducts(reversed);
    } catch (error) {
      console.error("error in Recently Viewed", error);
    }
  }, []);
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
