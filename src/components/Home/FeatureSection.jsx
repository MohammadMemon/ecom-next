import { CreditCard, Truck, Headphones, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureSection() {
  const features = [
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "100% safe and secure transactions.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick shipping to your doorstep.",
    },
    {
      icon: Package,
      title: "Carefully Packed",
      description: "Secure and protective packaging for every order.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer support always available.",
    },
  ];

  return (
    <section
      className="flex items-center justify-center w-full py-8 md:py-12 lg:py-16 bg-primary-foreground"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="container grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="flex flex-col items-center justify-center h-full p-6 transition-transform rounded-lg shadow-md hover:scale-105 backdrop-blur-md bg-white/60 text-[#02D866]"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardContent className="flex flex-col items-center gap-3 p-0">
              <feature.icon className="w-10 h-10" />
              <h3 className="text-xl font-bold text-gray-800" itemProp="name">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600" itemProp="description">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
