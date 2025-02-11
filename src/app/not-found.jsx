import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[#10c0c]">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-lg">
        Oops! The page you are looking for does not exist.
      </p>
      <Button className="mt-1">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
