"use client";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log;
    const success = searchParams.get("loggedIn");

    if (success === "true") {
      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
      }, 300); // Delay by 300ms or more if needed

      if (!pathname.includes("loggedIn")) {
        window.history.replaceState({}, "", pathname);
      }
    }
  }, [searchParams, pathname, toast]);

  const logout = async () => {
    setLoading(true);
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
      } else {
        window.location.href = "/"; // Redirect to home after logout
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <h1 className="font-bold text-2xl flex flex-col justify-center items-center min-h-screen">
      Hello, from cycledaddy
    </h1>
  );
}
