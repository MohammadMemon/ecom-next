"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/Product/ProductCard";
import Loader from "../ui/loader";

export default function ClientNewArrivals({ products }) {
  const [loading, setLoading] = useState(!products);
  const [localProducts, setLocalProducts] = useState(products || []);

  useEffect(() => {
    if (!products) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/v1/products/new-arrivals");
          const data = await res.json();
          setLocalProducts(data.products || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[8rem]">
        <Loader />
      </div>
    );
  }

  if (!localProducts.length) {
    return <p>No new products found.</p>;
  }

  return (
    <div
      id="Latest"
      className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto"
    >
      <h1 className="mb-6 text-2xl font-bold text-center">New Arrivals</h1>
      <div className="grid w-full grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {localProducts.map((product, index) => (
          <ProductCard key={product._id} index={index} product={product} />
        ))}
      </div>
    </div>
  );
}
