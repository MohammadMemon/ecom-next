"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, index }) => {
  const { toast } = useToast();
  const { addItem, isItemInCart } = useCartStore();
  const inCart = isItemInCart(product._id);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      action: <Button onClick={() => router.push("/cart")}>Go to Cart</Button>,
    });
  };

  const allOptions = product.variants?.flatMap((v) => v.options || []) || [];
  const availableOptions = allOptions.filter((opt) => opt.stock > 0);
  const firstAvailableOption = availableOptions[0] || allOptions[0];

  const totalVariantStock = allOptions.reduce(
    (sum, opt) => sum + (opt.stock || 0),
    0
  );

  const effectiveStock = product.stock > 0 ? product.stock : totalVariantStock;

  const displayPrice =
    typeof product.price === "number" && product.price > 0
      ? product.price
      : firstAvailableOption?.price ?? 0;

  const lowestPrice =
    allOptions.length > 0
      ? Math.min(
          ...allOptions.map((opt) => opt.price || 0).filter((p) => p > 0)
        )
      : displayPrice;

  let imgUrl = "/fallback-image.jpg";
  try {
    if (product.images?.[0]?.public_id) {
      imgUrl = `https://res.cloudinary.com/dbm7kxnub/image/upload/c_crop,x_0,y_170,w_990,h_1132/c_crop,g_auto,w_990,h_990/v1737841333/${product.images[0].public_id}`;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Image error for ${product._id}:`, error);
    }
  }

  if (process.env.NODE_ENV === "development" && !displayPrice && !lowestPrice) {
    console.warn("Missing price for product:", product.name, product);
  }

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer p-1 sm:p-3 backdrop-blur-md bg-white/60 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 max-w-[220px] sm:max-w-[250px] md:max-w-[280px] flex flex-col h-[330px] xxs:[345px] xs:h-[360px] sm:h-[380px] md:h-[430px]"
    >
      {/* Product Image */}
      <div className="relative flex items-center w-full pt-[100%] justify-center">
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          className="absolute inset-0 object-cover rounded-lg"
          sizes="(max-width: 280px) 100vw, 280px"
          priority={index < 8}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between flex-grow p-2 text-center">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 truncate">
            {product.brand}
          </h2>
          <h2 className="text-xs font-bold text-gray-800 sm:text-sm md:text-base line-clamp-2">
            {product.name}
          </h2>
        </div>

        {/* Price Display - show range if multiple prices exist */}
        <div className="mt-1">
          {allOptions.length > 1 &&
          lowestPrice !==
            Math.max(...allOptions.map((opt) => opt.price || 0)) ? (
            <p className="text-sm font-semibold text-primary md:text-lg">
              ₹{lowestPrice} - ₹
              {Math.max(...allOptions.map((opt) => opt.price || 0))}
            </p>
          ) : (
            <p className="text-sm font-semibold text-primary md:text-lg">
              ₹{displayPrice || lowestPrice}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        {effectiveStock <= 0 ? (
          <Button
            className="w-full mt-2 border cursor-not-allowed opacity-60"
            disabled
            onClick={(e) => e.stopPropagation()}
          >
            Out of Stock
          </Button>
        ) : product.status === "inactive" ? (
          <Button
            className="w-full mt-2 border hover:scale-105"
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
            className="w-full mt-2 border hover:scale-105"
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
            className="w-full mt-2 border hover:scale-105"
            onClick={handleAddToCart}
            type="button"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
