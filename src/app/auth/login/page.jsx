"use client";
import { LoginForm } from "@/components/Forms/login-form";
import Image from "next/image";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-1">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="rounded-lg"
            priority
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
