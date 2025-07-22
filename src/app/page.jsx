import { Suspense } from "react";
import Image from "next/image";

import Loader from "@/components/ui/loader";
import Hero from "@/components/Home/Hero";
import NewArrivals from "@/components/Home/newArrivals";

import RecentlyViewedWrapper from "@/components/Home/RecentlyViewedWrapper";
import FeatureSection from "@/components/Home/FeatureSection";

export const fetchCache = "force-cache";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
      <Hero />

      <RecentlyViewedWrapper />

      <Suspense
        fallback={
          <div className="h-[400px] w-full flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <NewArrivals />
      </Suspense>

      <div className="w-full py-4 mx-4 max-w-[95vw]">
        <Image
          src="/Banner1.png"
          alt="Slide 2"
          width={1200}
          height={900}
          className="object-cover w-full rounded-lg"
          priority
        />
      </div>
      <FeatureSection />
    </div>
  );
}
