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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [api, setApi] = useState();

  // Determine product type
  const hasVariants = product.variants?.length > 0;
  const isBike = product.category === "Bike";

  // Initialize selected variant/option for bikes
  useEffect(() => {
    if (hasVariants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedOption(product.variants[0]?.options?.[0]);
    }
  }, [product]);

  // Calculate dynamic price and stock
  const price = hasVariants ? selectedOption?.price : product.price;
  const stock = hasVariants ? selectedOption?.stock : product.stock;

  const { addProduct } = useRecentlyViewedStore();
  const { addItem, isItemInCart } = useCartStore();
  const inCart = isItemInCart(product._id);
  const { toast } = useToast();

  const handleAddToCart = () => {
    const itemToAdd = hasVariants
      ? {
          ...product,
          selectedVariant,
          selectedOption,
          price: selectedOption.price,
          name: `${product.name} (${selectedOption.size}, ${selectedOption.color})`,
        }
      : product;

    for (let i = 0; i < selectedQuantity; i++) {
      addItem(itemToAdd);
    }

    toast({
      title: "Added to Cart",
      description: `${itemToAdd.name} has been added to your cart.`,
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

  // Carousel controls
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

  const handleThumbnailClick = useCallback(
    (index) => {
      if (!api) return;
      setSelectedImageIndex(index);
      api.scrollTo(index);
      plugin.current.stop();
    },
    [api]
  );

  // Loading state
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full border-primary animate-spin"></div>
      </div>
    );
  }

  // Image handling
  const hasImages = product.images && product.images.length > 0;
  const displayImages = hasImages
    ? product.images
    : [{ url: "/placeholder-product.jpg", alt: product.name }];

  // Rating stars
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

  // Format description with line breaks
  const formatDescription = (description) => {
    if (!description) return "No description available";
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < description.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const allOptions = product.variants?.flatMap((v) => v.options || []) || [];

  const totalVariantStock = allOptions.reduce(
    (sum, opt) => sum + (opt.stock || 0),
    0
  );

  const effectiveStock = product.stock > 0 ? product.stock : totalVariantStock;

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.brand} ${product.name}`,
          text: `Check out this ${product.name} on CycleDaddy`,
          url: window.location.href,
        });
      } catch (error) {
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    });
  };

  return (
    <div className="bg-primary-foreground">
      <div className="p-4 mx-6 my-1 border rounded-lg shadow-lg backdrop-blur-md bg-white/60 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
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
                          <div className="overflow-hidden rounded-lg aspect-square">
                            <div className="relative w-full h-full">
                              <Image
                                width={1000}
                                height={1000}
                                src={image.url}
                                alt={image.alt || product.name}
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                priority={index === 0}
                              />
                            </div>
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

            {hasImages && displayImages.length > 1 && (
              <div className="flex pb-2 space-x-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary-500 ring-2 ring-green-200"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
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
                {product.subSubCategory ||
                  product.subCategory ||
                  product.category}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {product.name}
              {hasVariants && selectedOption && (
                <span className="block mt-1 text-lg font-normal text-gray-600">
                  {selectedOption.size}, {selectedOption.color}
                </span>
              )}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.ratings || 0)}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.numOfReviews || 0} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>

            {/* Variant Selectors for Bikes */}
            {hasVariants && (
              <div className="space-y-4">
                {/* Size Selector - Now shows unique sizes only */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Set(
                        product.variants.flatMap((v) =>
                          v.options.map((o) => o.size)
                        )
                      ),
                    ].map((size) => {
                      const variantWithThisSize = product.variants.find((v) =>
                        v.options.some((o) => o.size === size)
                      );
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            const firstVariantWithThisSize =
                              product.variants.find((v) =>
                                v.options.some((o) => o.size === size)
                              );
                            setSelectedVariant(firstVariantWithThisSize);
                            setSelectedOption(
                              firstVariantWithThisSize.options[0]
                            );
                          }}
                          className={`px-3 py-1 border rounded-md ${
                            selectedOption?.size === size
                              ? "border-primary bg-primary/10"
                              : "border-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selector - Shows colors for selected size */}
                {selectedVariant && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants
                        .filter((v) =>
                          v.options.some((o) => o.size === selectedOption?.size)
                        )
                        .flatMap((v) => v.options)
                        .filter(
                          (option, index, self) =>
                            index ===
                            self.findIndex((o) => o.color === option.color)
                        )
                        .map((option) => (
                          <button
                            key={`${option.size}-${option.color}`}
                            onClick={() => {
                              const matchingVariant = product.variants.find(
                                (v) =>
                                  v.options.some(
                                    (o) =>
                                      o.size === option.size &&
                                      o.color === option.color
                                  )
                              );
                              setSelectedVariant(matchingVariant);
                              setSelectedOption(option);
                            }}
                            className={`px-3 py-1 border rounded-md ${
                              selectedOption?.color === option.color
                                ? "border-primary bg-primary/10"
                                : "border-gray-300"
                            }`}
                          >
                            {option.color}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">
                ₹{price || 0}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  stock > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <div className="leading-relaxed text-gray-700">
                {formatDescription(product.description)}
              </div>
            </div>

            {/* Specifications for Bikes */}
            {isBike && product.specification?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.specification.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="font-medium text-gray-600">
                        {spec.title}:
                      </span>
                      <span>{spec.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                        Math.min(stock || 1, selectedQuantity + 1)
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 h-[44px]">
                <div className="flex-1">
                  {effectiveStock <= 0 ? (
                    <Button
                      className="w-full h-full border cursor-not-allowed opacity-60"
                      disabled
                      onClick={(e) => e.stopPropagation()}
                    >
                      Out of Stock
                    </Button>
                  ) : product.status === "inactive" ? (
                    <Button
                      className="w-full h-full border hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/917977509402?text=Hi, I'm interested in ${product.name}.%0AProduct Link: www.cycledaddy.in/product/${product._id}`,
                          "_blank"
                        );
                      }}
                      type="button"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16 0C7.163 0 0 6.967 0 15.556c0 2.747.77 5.303 2.114 7.504L0 32l9.2-2.404a16.956 16.956 0 006.8 1.404c8.837 0 16-6.967 16-15.556C32 6.967 24.837 0 16 0zm0 28.444c-2.188 0-4.257-.563-6.082-1.536l-.428-.236-5.466 1.428 1.456-5.201-.278-.445a12.926 12.926 0 01-1.982-6.396C3.22 8.022 8.989 2.667 16 2.667S28.78 8.022 28.78 15.556 23.011 28.444 16 28.444zm7.208-9.996c-.396-.198-2.33-1.152-2.692-1.28-.362-.128-.626-.198-.89.198-.264.396-1.02 1.28-1.25 1.548-.23.264-.462.297-.858.099-.396-.198-1.673-.614-3.185-1.957-1.176-1.05-1.97-2.352-2.202-2.748-.231-.396-.026-.611.172-.81.177-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.89-2.145-1.218-2.94-.32-.769-.648-.66-.89-.673l-.755-.013c-.264 0-.693.099-1.056.495-.363.396-1.386 1.352-1.386 3.297 0 1.945 1.419 3.827 1.617 4.093.198.264 2.796 4.272 6.777 5.988 3.981 1.716 3.981 1.144 4.698 1.077.717-.066 2.33-.951 2.658-1.869.33-.92.33-1.706.231-1.869-.099-.165-.363-.264-.759-.462z" />
                      </svg>
                      Enquiry Now
                    </Button>
                  ) : inCart ? (
                    <Button
                      className="w-full h-full border hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/cart");
                      }}
                      type="button"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Go to Cart
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-full border hover:scale-105"
                      onClick={handleAddToCart}
                      type="button"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
                {/* WhatsApp Button - Square */}
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/917977509402?text=Hi, I'm interested in ${product.name}.%0AProduct Link: www.cycledaddy.in/product/${product._id}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center justify-center w-[44px] h-[44px] p-0 border border-gray-300 rounded-lg"
                >
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/whatsapp.svg"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                </button>
                {/* Share Button - Square */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center w-[44px] h-[44px] p-0 border border-gray-300 rounded-lg"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6 border-t sm:grid-cols-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free Shipping ₹5000+</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Headset className="w-5 h-5 text-primary" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Secure Payments</span>
              </div>
            </div>

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
                {product.subCategory && (
                  <div className="flex gap-2">
                    <span className="text-gray-600">Sub Category:</span>
                    <span className="font-medium">{product.subCategory}</span>
                  </div>
                )}
                {product.subSubCategory && (
                  <div className="flex gap-2">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {product.subSubCategory}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
