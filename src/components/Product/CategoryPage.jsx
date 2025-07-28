"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const catImages = [
  { index: 1, src: "/1.png", href: "/category/bike" },
  { index: 2, src: "/2.png", href: "/category/gears-and-chains" },
  { index: 3, src: "/3.png", href: "/category/wheels-and-suspension" },
  { index: 4, src: "/4.png", href: "/category/brakes-and-safety" },
  { index: 5, src: "/5.png", href: "/category/frames-and-components" },
  { index: 6, src: "/6.png", href: "/category/accessories-and-essentials" },
  { index: 7, src: "/7.png", href: "/category/add-ons" },
];

export default function CategoryPage() {
  return (
    <div className="relative w-full min-h-screen bg-primary-foreground">
      <div className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto py-4 sm:py-8">
        <h2 className="mb-6 text-lg font-bold text-center text-gray-900 sm:mb-8 sm:text-2xl">
          Featured Categories
        </h2>

        <div className="grid w-full grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catImages.map((image) => (
            <div className="h-full" key={image.index}>
              <Link href={image.href} className="block h-full">
                <Card className="h-full overflow-hidden transition-shadow duration-300 border shadow-sm backdrop-blur-md bg-white/30 hover:shadow-md">
                  <CardContent className="p-1 sm:p-2">
                    <div className="relative w-full aspect-[2/3] max-h-40 sm:max-h-none">
                      <Image
                        src={image.src}
                        alt="Category"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
