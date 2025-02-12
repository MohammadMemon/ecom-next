// Shop.js
"use client";

import ProductCard from "@/components/Product/ProductCard";
import { useState } from "react";

export default function Shop({ initialProducts }) {
  const [products] = useState(initialProducts);

  return (
    <div className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Products</h1>
      <div className="grid w-full grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          [...products]
            .sort((a, b) => {
              if (a.stock > 0 && b.stock <= 0) return -1;
              if (a.stock <= 0 && b.stock > 0) return 1;
              return 0;
            })
            .map((product, index) => (
              <ProductCard key={product._id} index={index} product={product} />
            ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
