"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import useCartStore from "@/store/cartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartSummary,
  } = useCartStore();

  const [isClearing, setIsClearing] = useState(false);
  const summary = getCartSummary();

  const shipping = 149;

  const total = summary.totalPrice + shipping;

  const handleClearCart = async () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };

  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(productId, quantity);
    }
  };

  if (summary.isEmpty) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-600">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/category">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto ">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          disabled={isClearing}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 ">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg shadow-lg backdrop-blur-md bg-white/30">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Cart Items ({summary.totalItems})
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col p-4 border rounded-lg border- sm:flex-row sm:items-center sm:gap-4"
                  >
                    {/* First Row (Image + Name) - Expands */}
                    <div className="flex items-center flex-1 gap-4 ">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md">
                        {item.images ? (
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full rounded-md"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Product Name and Price */}
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">
                          ₹{item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Second Row (Quantity + Total + Remove) - Fixed Width */}
                    <div className="flex items-center justify-between w-full gap-6 mt-4 sm:mt-0 sm:justify-end sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decrementQuantity(item._id)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-gray-300 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item._id)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        >
                          +
                        </button>
                      </div>

                      {/* Total + Remove */}
                      <div className="text-center sm:text-left">
                        <div className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-1 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 ">
          <div className="sticky p-6 bg-white border rounded-lg shadow-lg backdrop-blur-md bg-white/30 top-4">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items ({summary.totalItems})</span>
                <span>₹{summary.totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="pt-3 border-t border-primary">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full py-3 mt-6">Proceed to Checkout</Button>

            <Link href="/products" className="block mt-4 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
