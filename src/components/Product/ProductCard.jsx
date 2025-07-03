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

  let imgUrl = "/fallback-image.jpg";
  try {
    if (product.images && product.images.length > 0) {
      imgUrl = `https://res.cloudinary.com/dbm7kxnub/image/upload/c_crop,x_0,y_170,w_990,h_1132/c_crop,g_auto,w_990,h_990/v1737841333/${product.images[0].public_id}`;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Image loading error for product ID: ${product._id}`,
        error
      );
    }
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

        <p className="mt-1 text-sm font-semibold text-primary md:text-lg">
          ₹
          {product.price > 0
            ? product.price
            : product.variants?.[0]?.options?.[0]?.price ?? "N/A"}
        </p>

        {/* Add to Cart Button */}
        {product.stock <= 0 ? (
          <Button
            className="w-full mt-2 border cursor-not-allowed opacity-60"
            disabled
            onClick={(e) => e.stopPropagation()}
          >
            Out of Stock
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
