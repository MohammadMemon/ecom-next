"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

const Hero = () => {
  const words = [
    "Cycling Essentials",
    "Precision Components",
    "Pro Gear",
    "Quality Accessories",
    "Rider Upgrades",
    "Premium Replacements",
    "Expert Equipment",
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  const images = [
    { src: "/1.jpg", alt: "Hero Banner" },
    { src: "/2.jpg", alt: "Premium Cycling Components" },
    { src: "/3.jpg", alt: "Professional Bike Parts" },
    { src: "/4.jpg", alt: "High-Quality Accessories" },
    { src: "/5.jpg", alt: "Precision Engineering" },
    { src: "/6.jpg", alt: "Elite Performance Gear" },
    { src: "/7.jpg", alt: "Professional Equipment" },
  ];

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 p-6 rounded-lg sm:gap-6 md:gap-12 sm:px-8 md:px-12 md:flex-row dark:bg-gray-800">
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl dark:text-gray-50">
          Your Ride Deserves Better - Explore Top-Rated{" "}
          <AnimatePresence mode="wait">
            <motion.strong
              key={currentWordIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="italic"
            >
              {words[currentWordIndex]}
            </motion.strong>
          </AnimatePresence>{" "}
          Here.
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Discover elite-quality bicycle parts designed for ultimate
          performance, unmatched durability, and a smoother ride every time.
        </p>

        <div className="mt-6">
          <a href="#Latest">
            <Button>Explore Latest Products</Button>
          </a>
        </div>
      </div>

      {/* Optimized Carousel Section */}
      <div className="flex items-center justify-center">
        <div className="relative w-[90vw] rounded-lg aspect-[4/3] overflow-hidden md:w-[50vw]">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full h-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="h-full -ml-1">
              {images.map((image, index) => (
                <CarouselItem key={image.src} className="h-full pl-1">
                  <div className="h-full p-1">
                    <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1200}
                        height={900}
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        sizes="(max-width: 768px) 90vw, 50vw"
                        className="object-cover w-full h-full rounded-lg"
                        quality={index === 0 ? 90 : 75}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute z-10 -translate-y-1/2 left-2 top-1/2" />
            <CarouselNext className="absolute z-10 -translate-y-1/2 right-2 top-1/2" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Hero;
