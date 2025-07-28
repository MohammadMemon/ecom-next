import { Suspense } from "react";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import Hero from "@/components/Home/Hero";
import NewArrivals from "@/components/Home/newArrivals";
import RecentlyViewedWrapper from "@/components/Home/RecentlyViewedWrapper";
import FeatureSection from "@/components/Home/FeatureSection";

import CategoryCarousel from "@/components/Home/CategoryCaroousel";
import FaqPage from "./faq/page";

export const fetchCache = "force-cache";

export const metadata = {
  title: "CycleDaddy | Buy Premium Bicycles & Accessories Online India",
  description:
    "India’s trusted online bicycle store for premium cycles, helmets, and accessories. Enjoy free shipping on orders above ₹5000. Manufacturer warranty and replacements for defective items included.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CycleDaddy - Premium Bicycles with Free Shipping (Orders ₹5000+)",
    description:
      "Shop certified bicycles with warranty. Free shipping across India on orders above ₹5000. Best prices guaranteed.",
    url: "https://cycledaddy.in",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
      <Hero />

      <RecentlyViewedWrapper />

      <CategoryCarousel />
      <FeatureSection />
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
          alt="Promotional Banner"
          width={1000}
          height={200}
          className="object-cover w-full rounded-lg"
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-[75vw] w-full">
            <FaqPage />
          </div>
        </div>
      </div>
    </div>
  );
}
