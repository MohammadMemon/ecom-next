"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { resetPassword } from "./actions";

export default function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await resetPassword(password);
    console.log(response.error);
    console.log(error);
  };
  useEffect(() => {
    setLoading(false);
    const error = searchParams.get("error");
    if (error) {
      console.log();
      if (decodeURIComponent(error) == "Invalid Password") {
        setTimeout(() => {
          toast({
            variant: "destructive",
            title: "Invalid Password",
            description:
              "Password must be 8-16 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., @$!%*?&).",
          });
        }, 300);
        window.history.replaceState({}, "", pathname);
      } else {
        setTimeout(() => {
          toast({
            variant: "destructive",
            title: "Unexpected Error Occurred",
            description: "Something went wrong. Please try again later.",
          });
        }, 300);
        window.history.replaceState({}, "", pathname);
      }
    }
  }, [searchParams]);
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <a href="/" className="flex items-center self-center gap-2 font-medium">
          <div className="flex items-center justify-center w-6 h-6 rounded-md text-primary-foreground">
            {/* logo daal */}
          </div>
          Cycledaddy
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password@123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Update Password"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
