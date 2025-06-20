import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Confirm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Check Your Email</h1>
      <h4 className="font-bold text-gray-600">
        You have been successfully logged in.{" "}
      </h4>
      <p className="mt-2 text-gray-600">
        To complete your account setup, please check your email inbox and verify
        your email address by following the verification link we have sent you.
      </p>
      <p className="mt-4 text-gray-500">
        If you don't see the email, check your spam/junk folder.
      </p>
      <Button className="mt-1">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
