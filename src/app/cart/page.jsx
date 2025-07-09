"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/useMounted";

export default function CartPage() {
  const isMounted = useMounted();
  const { toast } = useToast();

  const {
    items,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartSummary,
    getOrderData,
    validateCartStock,
  } = useCartStore();

  const [isClearing, setIsClearing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const summary = getCartSummary();

  // Stock validation on page load
  useEffect(() => {
    if (isMounted && items.length > 0 && !hasValidated) {
      const checkStock = async () => {
        setIsValidating(true);
        try {
          const result = await validateCartStock();

          if (result.hasChanges && result.issues.length > 0) {
            // Show toast notifications for each issue
            result.issues.forEach((issue, index) => {
              setTimeout(() => {
                toast({
                  title: "Cart Updated",
                  description: issue.message,
                  variant: issue.type === "error" ? "destructive" : "default",
                });
              }, index * 500); // Stagger toast notifications
            });
          }

          setHasValidated(true);
        } catch (error) {
          toast({
            title: "Stock Check Failed",
            description:
              "Unable to verify product availability. Please refresh the page.",
            variant: "destructive",
          });
        } finally {
          setIsValidating(false);
        }
      };

      checkStock();
    }
  }, [isMounted, items.length, hasValidated, validateCartStock, toast]);

  const handleClearCart = async () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    }, 500);
  };

  const handleRemoveItem = (item) => {
    removeItem(item._id);
    toast({
      title: "Removed from Cart",
      description: `${item.name} was removed from your cart.`,
    });
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.stock) {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${item.stock} units of ${item.name} are available.`,
        variant: "destructive",
      });
      return;
    }
    updateQuantity(item._id, newQuantity);
  };

  if (!isMounted) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="py-16 text-center">
          <div className="animate-pulse">
            <div className="w-48 h-8 mx-auto mb-4 bg-gray-200 rounded"></div>
            <div className="w-64 h-4 mx-auto bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="py-16 text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking product availability...</p>
        </div>
      </div>
    );
  }

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isClearing}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Clear Cart"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-primary-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear entire cart?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove all items from your cart? Some
                of them might go out of stock and become unavailable later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-primary hover:bg-gray-100 bg-primary-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearCart}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                Clear Cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                    className="flex flex-col p-4 border rounded-lg border-primary sm:flex-row sm:items-center sm:gap-4"
                  >
                    {/* First Row (Image + Name) - Expands */}
                    <Link href={`/product/${item._id}`}>
                      <div className="flex items-center flex-1 gap-4">
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
                    </Link>

                    {/* Second Row (Quantity + Total + Remove) - Fixed Width */}
                    <div className="flex items-center justify-between w-full gap-6 mt-4 sm:mt-0 sm:justify-end sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decrementQuantity(item._id)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-gray-300 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item._id)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          disabled={item.stock && item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      {/* Total + Remove */}
                      <div className="text-center sm:text-left">
                        <div className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="mt-1 text-sm text-red-600 hover:text-red-800">
                              Remove
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-primary-foreground">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove this product?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this item from
                                your cart? It might go out of stock and become
                                unavailable later.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border border-primary hover:bg-gray-100 bg-primary-foreground">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveItem(item)}
                                className="text-white bg-red-600 hover:bg-red-700"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                <span>₹{getOrderData().shipping.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-primary">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{getOrderData().total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full py-3 mt-6">Proceed to Checkout</Button>
            </Link>

            <Link href="/products" className="block mt-4 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
