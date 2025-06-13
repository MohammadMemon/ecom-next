"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/auth/signup/actions";
import React, { Suspense, useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, usePathname, redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Validation functions
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const validatePassword = (password) =>
    String(password).match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (!validatePassword(password)) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description:
          "Password must be at least 8 characters long and include a number, uppercase letter, and special character.",
      });
      return;
    }

    try {
      const response = await signup(email, password, name);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error?.message !== "NEXT_REDIRECT") {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: error.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (error) {
      console.error("OAuth error:", error);
    } else {
      console.log("OAuth success data:", data);
    }
  };

  useEffect(() => {
    setLoading(false);
    const error = searchParams.get("error");
    if (error) {
      if (decodeURIComponent(error) == "Invalid login credentials") {
        setTimeout(() => {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect.",
            action: (
              <Button
                variant="outline"
                className="bg-red-500 outline-white"
                onClick={() => redirect("/forgot-password")}
              >
                Forgot Password?
              </Button>
            ),
          });
        }, 300);

        window.history.replaceState({}, "", pathname);
      } else {
        setTimeout(() => {
          toast({
            variant: "destructive",
            title: "Server Error",
            description:
              "Something went wrong on our end. Please try again later.",
            action: <ToastAction altText="Retry">Retry</ToastAction>,
          });
        }, 300);

        window.history.replaceState({}, "", pathname);
      }
    }
  }, [searchParams]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                  </div>
                  <div className="relative grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password@123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10" // Add padding to prevent text overlap with icon
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-2/3 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Signup"}
                  </Button>
                </div>
                <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 px-2 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {loading ? "Loading..." : "Signup with Google"}
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Have an account?{" "}
                  <a
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Suspense>
  );
}
