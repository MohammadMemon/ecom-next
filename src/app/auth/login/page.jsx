"use client";
import { LoginForm } from "@/components/Forms/login-form";
import Image from "next/image";
import { Suspense } from "react";
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <a href="/" className="flex items-center self-center gap-2 font-medium">
          <div className="flex items-center justify-center w-6 h-6 rounded-md text-primary-foreground">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              className="rounded-lg "
              priority
            ></Image>
          </div>
        </a>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
