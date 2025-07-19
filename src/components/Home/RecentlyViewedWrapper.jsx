"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import Loader from "@/components/ui/loader";

const RecentlyViewed = dynamic(() => import("./recentlyViewed"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center">
      <Loader />
    </div>
  ),
});

export default function RecentlyViewedWrapper() {
  const products = useRecentlyViewedStore((s) => s.products);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!hydrated) {
    return <div className="h-[300px] w-full" />;
  }

  return products.length > 0 ? <RecentlyViewed /> : null;
}
