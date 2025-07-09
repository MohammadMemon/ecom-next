// components/Stepper.jsx
"use client";

import { MapPin, ClipboardList, CreditCard } from "lucide-react";

const steps = [
  {
    title: "Shipping Info",
    description: "Enter your delivery address",
    icon: MapPin,
  },
  {
    title: "Review",
    description: "Confirm your address & cart items",
    icon: ClipboardList,
  },
  {
    title: "Payment",
    description: "Pay securely via Razorpay",
    icon: CreditCard,
  },
];

export default function Stepper({ currentStep = 0 }) {
  return (
    <div className="relative flex items-start justify-between w-full max-w-4xl px-4 py-8 mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="relative flex-1 text-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                  isActive
                    ? "bg-white border-green-600 text-green-600"
                    : isCompleted
                    ? "bg-green-100 border-green-600 text-green-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div
                className={`mt-3 font-semibold ${
                  isActive || isCompleted ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
              <div className="text-sm text-gray-500 mt-1 max-w-[120px]">
                {step.description}
              </div>
            </div>

            {/* Line connector */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 z-0">
                <div className="absolute left-1/2 w-full h-0.5 bg-gray-300 transform -translate-x-1/2" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
