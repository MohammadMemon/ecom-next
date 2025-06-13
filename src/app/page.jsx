"use client";

import Hero from "@/components/Home/Hero";
import RecentlyViewed from "@/components/Home/recentlyViewed";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

  return null; // No UI, just handling effects
}

export default function Home() {
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(false);

  useEffect(() => {
    try {
      const exists = localStorage.getItem("recentlyViewedProducts");
      if (exists) {
        setHasRecentlyViewed(true);
      } else {
        setHasRecentlyViewed(false);
      }
    } catch (error) {
      console.error("Invalid recentlyViewedProducts data:", error);
      setHasRecentlyViewed(false);
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>

      <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
        <Hero />
        {hasRecentlyViewed ? <RecentlyViewed /> : null}
      </div>
    </>
  );
}
