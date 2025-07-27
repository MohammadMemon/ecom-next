"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CarouselApi } from "@/components/ui/carousel";

const catImages = [
  { index: 1, src: "/1.png", href: "/category/bike" },
  { index: 2, src: "/2.png", href: "/category/gears-and-chains" },
  { index: 3, src: "/3.png", href: "/category/wheels-and-suspension" },
  { index: 4, src: "/4.png", href: "/category/brakes-and-safety" },
  { index: 5, src: "/5.png", href: "/category/frames-and-components" },
  { index: 6, src: "/6.png", href: "/category/accessories-and-essentials" },
  { index: 7, src: "/7.png", href: "/category/add-ons" },
];

export default function CategoryCarousel() {
  const [api, setApi] = useState();
  const carouselContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      setIsInView(entry.isIntersecting);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    if (carouselContainerRef.current) {
      observer.observe(carouselContainerRef.current);
    }

    return () => {
      if (carouselContainerRef.current) {
        observer.unobserve(carouselContainerRef.current);
      }
    };
  }, [handleIntersection]);

  useEffect(() => {
    if (!api) return;

    const autoplay = api.plugins().autoplay;

    if (autoplay) {
      if (isInView) {
        autoplay.play();
      } else {
        autoplay.stop();
      }
    }
  }, [api, isInView]);

  return (
    <div className="relative w-full h-64 overflow-hidden bg-primary-foreground sm:h-full">
      <div
        ref={carouselContainerRef}
        className="w-full mx-auto max-w-[95vw] py-4 sm:py-8 h-full"
      >
        <h2 className="mb-2 text-lg font-bold text-center text-gray-900 sm:mb-6 sm:text-2xl">
          Featured Categories
        </h2>
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {catImages.map((image) => (
              <CarouselItem
                key={image.index}
                className="pl-2 md:pl-4 basis-1/3 xs:basis-1/4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="h-full">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4" />
          <CarouselNext className="right-2 md:right-4" />
        </Carousel>
      </div>
    </div>
  );
}
