"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useCartStore from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/useMounted";
import { initiatePayment } from "@/utils/payment";
import { googleProvider } from "@/firebase/client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import Stepper from "@/components/ui/stepper";

export default function CheckoutPage() {
  const isMounted = useMounted();
  const { toast } = useToast();

  const {
    items,
    getCartSummary,
    shippingDetails,
    setShippingDetails,
    getOrderData,
    clearCart,
  } = useCartStore();

  const cartStore = useCartStore();

  const router = useRouter();

  // Check User loggedin

  const provider = googleProvider();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updatedName = shippingDetails?.name?.trim()
      ? shippingDetails.name
      : user?.displayName || "";

    const updatedEmail = shippingDetails?.email?.trim()
      ? shippingDetails.email
      : user?.email || "";

    setFormData((prev) => ({
      ...prev,
      name: updatedName,
      email: updatedEmail,
    }));
  }, [user, shippingDetails?.name, shippingDetails?.email]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Details
    name: shippingDetails?.name || "",
    email: shippingDetails?.email || "",
    phone: shippingDetails?.phone || "",
    address: shippingDetails?.address || "",
    city: shippingDetails?.city || "",
    state: shippingDetails?.state || "",
    pincode: shippingDetails?.pincode || "",
    country: shippingDetails?.country || "India",
  });

  const summary = getCartSummary();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    const required = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    return required.every((field) => formData[field].trim() !== "");
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      // Save shipping details to store
      setShippingDetails({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      });
      setCurrentStep(2);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
    handlePayment();
  };

  const handlePayment = async () => {
    toast({
      title: "Processing Payment",
      description: "Redirecting to payment gateway...",
    });

    try {
      await initiatePayment(cartStore, router, { user });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Payment cancelled by user"
      ) {
        toast({
          title: "Payment Cancelled",
          description: "Your payment was not completed.",
          variant: "destructive",
          action: (
            <Button
              className="text-black bg-white shadow-lg hover:text-white"
              size="sm"
              onClick={() => {
                handlePayment();
              }}
            >
              Try Again
            </Button>
          ),
        });
      } else {
        toast({
          title: "Payment Failed",
          description:
            error.message || "Unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
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

  if (summary.isEmpty) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-600">
            Add some items to your cart before checking out.
          </p>
          <Link href="/category">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Stepper currentStep={currentStep} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg shadow-lg backdrop-blur-md bg-white/30">
            <div className="p-6">
              {/* Step 1: Shipping Details */}
              {currentStep === 1 && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    {!user ? (
                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        State *
                      </label>
                      <select
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">State</option>
                        <option value="Andaman and Nicobar Islands">
                          Andaman and Nicobar Islands
                        </option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">
                          Arunachal Pradesh
                        </option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">
                          Dadra and Nagar Haveli and Daman and Diu
                        </option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">
                          Himachal Pradesh
                        </option>
                        <option value="Jammu and Kashmir">
                          Jammu and Kashmir
                        </option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Link href="/cart">
                      <Button variant="outline">Back to Cart</Button>
                    </Link>
                    <Button onClick={handleStep1Next}>
                      Continue to Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Order Review */}
              {currentStep === 2 && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">
                    Review Your Order
                  </h2>

                  {/* Shipping Address */}
                  <div className="p-4 mb-6 border rounded-lg border-primary">
                    <h3 className="mb-2 text-lg font-semibold">
                      Shipping Address
                    </h3>
                    <p className="text-gray-600">
                      {formData.name}
                      <br />
                      {formData.address}
                      <br />
                      {formData.city}, {formData.state} {formData.pincode}
                      <br />
                      {formData.country}
                      <br />
                      Phone: {formData.phone}
                      <br />
                      Email: {formData.email}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Items</h3>
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 border border-black rounded-lg"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md">
                          {item.images ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full rounded-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-gray-600">
                            Price: ₹{item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back to Shipping
                    </Button>
                    <Button onClick={handleStep2Next}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">
                    Payment Information
                  </h2>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back to Review
                    </Button>
                    <Button
                      onClick={handlePayment}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Pay ₹{getOrderData().total.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border rounded-lg shadow-lg backdrop-blur-md bg-white/30 top-4">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items ({summary.totalItems})</span>
                <span>₹{summary.totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{getOrderData().shipping}</span>
              </div>

              <div className="pt-3 border-t border-primary">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{getOrderData().total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Mini Cart Items */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-600">
                Items in your order
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded">
                      {item.images ? (
                        <Image
                          src={item.images[0].url}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="truncate">{item.name}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
