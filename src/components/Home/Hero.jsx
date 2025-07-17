"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

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
    const currentWord = words[currentWordIndex];
    const timer = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000); // Change word every 3 seconds

    return () => clearTimeout(timer);
  }, []);
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
          <Button className=" md:w-auto">Explore Latest Products</Button>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="flex items-center justify-center">
        <div className="relative w-[90vw] rounded-lg aspect-[4/3] overflow-hidden md:w-[50vw]">
          <Swiper
            spaceBetween={20}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full h-full"
          >
            <SwiperSlide>
              <Image
                src="/1.png"
                alt="Slide 1"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
                priority
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/2.png"
                alt="Slide 2"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
                priority
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/3.png"
                alt="Slide 3"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/4.png"
                alt="Slide 3"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/5.png"
                alt="Slide 3"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/6.png"
                alt="Slide 3"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/7.png"
                alt="Slide 3"
                width={1200}
                height={900}
                className="object-cover w-full h-full rounded-lg"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Hero;
