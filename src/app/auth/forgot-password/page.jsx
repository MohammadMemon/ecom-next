"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { forgotPassword } from "./actions";
import { Label } from "@/components/ui/label";

function ErrorHandler() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      console.log("Encoded error:", encodeURIComponent(error));

      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Unexpected Error Occurred",
          description: "Something went wrong. Please try again later.",
        });
      }, 300);

      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, pathname, toast]);

  return null;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.error) {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>

      <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
        <div className="flex flex-col w-full max-w-sm gap-6">
          <a
            href="/"
            className="flex items-center self-center gap-2 font-medium"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-md text-primary-foreground">
              {/* logo */}
            </div>
            Cycledaddy
          </a>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Send Password Reset Link"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
