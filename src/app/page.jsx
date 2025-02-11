"use client";
import Hero from "@/components/Home/Hero";
import { Button } from "@/components/ui/button";
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

  const logout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
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
    <div className="flex flex-col items-center justify-center text-2xl font-bold bg-muted">
      <Hero />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          logout();
        }}
      >
        <Button className="m-2 " type="submit" disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </form>
    </div>
  );
}
