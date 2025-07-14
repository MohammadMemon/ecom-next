"use client";

import Loader from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader fullScreen={false} />
    </div>
  );
}
