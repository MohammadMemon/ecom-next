"use client";

import Hero from "@/components/Home/Hero";
import RecentlyViewed from "@/components/Home/recentlyViewed";
import { useToast } from "@/hooks/use-toast";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const products = useRecentlyViewedStore((state) => state.products);
  const getProductsWithStock = useRecentlyViewedStore(
    (state) => state.getProductsWithStock
  );

  const hasRecentlyViewed = products.length > 0;

  useEffect(() => {
    // Simple timeout to allow store hydration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
        <Hero />

        {loading ? (
          <div className="h-[300px] w-full" />
        ) : hasRecentlyViewed ? (
          <RecentlyViewed />
        ) : null}

        {!loading && (
          <div className="py-4 mx-4">
            <Image
              src="/Banner1.png"
              alt="Slide 2"
              width={1200}
              height={900}
              className="object-cover w-full h-full rounded-lg"
              priority
            />
          </div>
        )}
      </div>
    </>
  );
}
