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
    <section className="flex items-center justify-center w-full py-8 md:py-12 lg:py-16 bg-primary-foreground">
      <div className="container grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={index}
              className="flex flex-col items-center justify-center h-full p-6 transition-transform rounded-lg shadow-md hover:scale-105 backdrop-blur-md bg-white/60 text-[#02D866]"
            >
              <CardContent className="flex flex-col items-center gap-3 p-0">
                <IconComponent className={`w-10 h-10 ${feature.iconColor}`} />
                <h3 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
