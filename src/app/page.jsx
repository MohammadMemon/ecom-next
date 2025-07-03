"use client";

import Hero from "@/components/Home/Hero";
import RecentlyViewed from "@/components/Home/recentlyViewed";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function Home() {
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const exists = localStorage.getItem("recentlyViewedProducts");
      setHasRecentlyViewed(!!exists);
    } catch (error) {
      console.error("Invalid recentlyViewedProducts data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
        <Hero />

        {loading ? (
          <div className="h-[300px] w-full" /> // Reserve space during loading
        ) : hasRecentlyViewed ? (
          <RecentlyViewed />
        ) : null}
        {!loading && (
          <div className="py-4 mx-4">
            <Image
              src="/banner1.png"
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
