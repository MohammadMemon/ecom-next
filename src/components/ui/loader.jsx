"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Pedalling your way there...",
  "Shifting gears...",
  "Cruising along...",
  "Almost at the finish line...",
  "Taking the scenic route...",
];

export default function Loader({ fullScreen = true }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0" : "w-full h-full"
      } flex items-center justify-center z-50`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Bicycle Wheel Animation */}
        <div className="relative">
          <motion.div
            className="w-24 h-24 border-4 border-[#02D866] rounded-full relative"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#02D866] absolute"></div>
              <div className="w-full h-0.5 bg-[#02D866] absolute rotate-45"></div>
              <div className="w-full h-0.5 bg-[#02D866] absolute rotate-90"></div>
              <div className="w-full h-0.5 bg-[#02D866] absolute rotate-[135deg]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[hsl(186,38%,10%)] rounded-full"></div>
            </div>
          </motion.div>

          <motion.div
            className="absolute transform -translate-y-1/2 -right-8 top-1/2"
            animate={{
              scaleX: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="flex space-x-1">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-[hsl(186,38%,10%)] rounded-full"
                  animate={{
                    y: [0, -2, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-center min-h-[2rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              className="text-[hsl(186,38%,10%)] text-lg font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#02D866] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
