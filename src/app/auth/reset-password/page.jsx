"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { googleProvider } from "@/firebase/client";

function SearchParamsHandler({ toast }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title:
            error === "Invalid Password"
              ? "Invalid Password"
              : "Unexpected Error",
          description:
            error === "Invalid Password"
              ? "Password must be 8-16 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., @$!%*?&)."
              : "Something went wrong. Please try again later.",
        });
      }, 300);
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, toast, pathname]);

  return null;
}

export default function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = googleProvider();

      const auth = getAuth();

      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      const reAuthenticate = await reauthenticateWithCredential(
        user,
        credential
      );

      if (reAuthenticate?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      } else {
        const response = updatePassword(user, password);

        if (response?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        } else {
          toast({
            variant: "success",
            title: "Success",
            description: "Your password has been updated successfully.",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <Suspense fallback={null}>
        <SearchParamsHandler toast={toast} />
      </Suspense>

      <div className="flex flex-col w-full max-w-sm gap-6">
        <a href="/" className="flex items-center self-center gap-2 font-medium">
          <div className="flex items-center justify-center w-6 h-6 rounded-md text-primary-foreground">
            {/* logo placeholder */}
          </div>
          Cycledaddy
        </a>

        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="relative grid gap-2">
                  <Label htmlFor="password">Old Password</Label>
                  <Input
                    id="oldPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password@123"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-500 transform -translate-y-full right-3 top-1/2 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <Label htmlFor="password">Update Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password@123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-500 transform -translate-y-full right-3 top-1/2 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
