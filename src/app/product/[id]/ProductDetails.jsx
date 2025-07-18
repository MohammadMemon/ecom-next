"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Headset,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import Loader from "@/components/ui/loader";

export default function ProductDetails({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [api, setApi] = useState();

  const { addProduct } = useRecentlyViewedStore();

  const { addItem, isItemInCart } = useCartStore();

  const inCart = isItemInCart(product._id);

  const { toast } = useToast();

  const handleAddToCart = () => {
    // Add multiple items at once
    for (let i = 0; i < selectedQuantity; i++) {
      addItem(product);
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Button>
          <Link href="/cart">Go to Cart</Link>
        </Button>
      ),
    });
  };

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product]);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Sync carousel with selected image index
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedImageIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle thumbnail click
  const handleThumbnailClick = useCallback(
    (index) => {
      if (!api) return;
      setSelectedImageIndex(index);
      api.scrollTo(index);
      plugin.current.stop(); // Stop autoplay when user interacts
    },
    [api]
  );

  //Temp Loader
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full border-primary animate-spin"></div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;
  const displayImages = hasImages
    ? product.images
    : [{ url: "/api/placeholder/600/600", alt: product.name }];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDescription = (description) => {
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < description.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.brand} ${product.name}`,
          text: `Check out this ${product.name}
          }`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback: copy URL to clipboard
          fallbackShare();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare();
    }
  };

  // Fallback share function
  const fallbackShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Product link copied to clipboard!");
        })
        .catch(() => {
          // Final fallback
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Product link copied to clipboard!");
        });
    }
  };

  return (
    <div className="bg-primary-foreground">
      <div className="p-4 mx-6 my-1 border rounded-lg shadow-lg backdrop-blur-md bg-white/60 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <Carousel
                plugins={[plugin.current]}
                className="w-full"
                setApi={setApi}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {displayImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-0">
                          <div className="overflow-hidden rounded-lg bg aspect-square">
                            {(() => {
                              const [loaded, setLoaded] = useState(false);

                              return (
                                <div className="relative w-full h-full">
                                  {!loaded && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center ">
                                      <div className="flex items-center justify-center min-h-[8rem] w-full">
                                        <Loader fullScreen={false} />
                                      </div>
                                    </div>
                                  )}
                                  <Image
                                    width={1000}
                                    height={1000}
                                    src={image.url || "/fallback-image.jpg"}
                                    alt={image.alt || product.name}
                                    onLoad={() => setLoaded(true)}
                                    onError={() => setLoaded(true)}
                                    className={`object-cover w-full h-full transition-transform duration-300 hover:scale-105 ${
                                      loaded ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </div>
                              );
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Thumbnail Images */}
            {hasImages && displayImages.length > 1 && (
              <div className="flex pb-2 space-x-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:border-green-400 ${
                      selectedImageIndex === index
                        ? "border-primary-500 ring-2 ring-green-200"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.url || "/fallback-image.jpg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Brand and Category */}
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="border-green-900 text-primary"
              >
                {product.brand}
              </Badge>
              <Badge
                className="text-white hover:text-primary"
                variant="secondary"
              >
                {product.subSubCategory ? (
                  <span>{product.subSubCategory}</span>
                ) : (
                  product.subCategory
                )}
              </Badge>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.ratings)}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.numOfReviews} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ₹{Math.round(product.price * 1.2)}
              </span>
              <Badge className="text-green-800 bg-green-100 hover:bg-green-100">
                Save ₹{Math.round(product.price * 0.2)}
              </Badge>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  product.stock > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <div className="leading-relaxed text-gray-700">
                {formatDescription(product.description)}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() =>
                      setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                    }
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-gray-300 border-x">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedQuantity(
                        Math.min(product.stock, selectedQuantity + 1)
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                {product.stock <= 0 ? (
                  <Button
                    className="w-full mt-2 border cursor-not-allowed opacity-60"
                    disabled
                  >
                    Out of Stock
                  </Button>
                ) : inCart ? (
                  <Link href="/cart" className="w-full mt-2">
                    <Button className="w-full border hover:scale-105">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Go to Cart
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full mt-2 border "
                    onClick={handleAddToCart}
                    type="button"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                )}

                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/+917977509402?text=${encodeURIComponent(
                        "Hi, I'm interested in this product: http://cycledaddy.in/product/" +
                          product._id
                      )}`,
                      "_blank"
                    );
                  }}
                  size="icon"
                  className="p-3 border border-gray-300 rounded-lg "
                >
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/whatsapp.svg"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                </button>
                <button
                  onClick={handleShare}
                  size="icon"
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <Share2 className="w-5 h-5 " />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t sm:grid-cols-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-primary" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Headset className="w-5 h-5 text-primary" />
                <span>Hassle-Free Support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Safe Payment </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="pt-6 space-y-3 border-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Details
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="flex gap-2">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Sub Category:</span>
                  <span className="font-medium">{product.subCategory}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{product.subSubCategory}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
