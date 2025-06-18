"use client";

import Hero from "@/components/Home/Hero";
import RecentlyViewed from "@/components/Home/recentlyViewed";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchParamsHandler() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const loginSuccess = searchParams.get("loggedIn");
    const passwordResetSuccess = searchParams.get("passwordReset");

    if (loginSuccess === "true") {
      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
      }, 300);

      if (!pathname.includes("loggedIn")) {
        window.history.replaceState({}, "", pathname);
      }
    }

    if (passwordResetSuccess === "true") {
      setTimeout(() => {
        toast({
          title: "Password Reset Successful",
          description:
            "Your password has been successfully reset. You are now logged in.",
        });
      }, 300);

      if (!pathname.includes("loggedIn")) {
        window.history.replaceState({}, "", pathname);
      }
    }
  }, [searchParams, pathname, toast]);

  return null;
}

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
      setLoading(false); // Mark check as complete
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>

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
