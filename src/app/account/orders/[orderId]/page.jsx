"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Receipt,
} from "lucide-react";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import { format } from "date-fns";
import { auth } from "@/firebase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found in URL");
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (!currentUser) {
            router.replace("/auth/login");
            return;
          }

          setUser(currentUser);
          await fetchOrderDetails(currentUser);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setError("Authentication service unavailable. Please try again.");
        setLoading(false);
      }
    };

    initializeAuth();
  }, [orderId, router]);

  const fetchOrderDetails = async (currentUser) => {
    try {
      setLoading(true);

      const token = await currentUser.getIdToken();

      const response = await fetch(`/api/v1/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        if (response.status === 403) {
          throw new Error("You don't have permissions to access this order");
        }
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();

      const orderData = data.order;

      if (!orderData) {
        throw new Error("Order not found");
      }

      setOrder(orderData);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err.message || "An error occurred while loading the order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex items-center justify-center min-h-[8rem] w-full">
          <Loader fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-primary-foreground">
        <div className="w-full max-w-md p-8 text-center shadow-xl rounded-2xl backdrop-blur-md bg-white/30">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Access Denied
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button
            onClick={() => router.push("/account")}
            className="flex items-center justify-center gap-2 px-6 py-3 mx-auto text-white transition-colors duration-200 rounded-lg bg-primary "
          >
            Back to Account
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex items-center justify-center min-h-[8rem] w-full">
          <Loader fullScreen={false} />
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusMessage = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "Your order is being prepared";
      case "shipped":
        return "Your order is on the way";
      case "delivered":
        return "Your order has been delivered";
      default:
        return "Order status update";
    }
  };

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            {/* Back Button */}
            <div>
              <Button
                onClick={() => router.back()}
                size="sm"
                className="flex items-center gap-2"
              >
                Back to Orders
              </Button>
            </div>

            {/* Order Details */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Order Details
              </h1>
              <p className="text-slate-600">Order ID: {order.orderId}</p>
            </div>
          </div>
        </div>

        {/* Order Status and Summary */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Order Status Card */}
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                  {getStatusIcon(order.orderStatus)}
                </div>
                <div className="flex-1">
                  <Badge
                    className={`${getStatusColor(order.orderStatus)} mb-2 `}
                  >
                    {order.orderStatus}
                  </Badge>
                  <p className="text-sm text-slate-600">
                    {getStatusMessage(order.orderStatus)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Order Date:</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Package className="w-4 h-4" />
                    <span>Items:</span>
                  </div>
                  <span className="font-medium">
                    {order.orderItems.length} item(s)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>Total Amount:</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    ₹{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Total Card */}
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5" />
                Order Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">
                    ₹{order.itemsPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping:</span>
                  <span className="font-medium">
                    ₹{order.shippingPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping and Payment Info */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          {/* Shipping Info Card */}
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Delivery Address
                    </p>
                    <div className="mt-1 text-slate-600">
                      <p>{order.shippingInfo.address}</p>
                      <p>
                        {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                        {order.shippingInfo.pincode}
                      </p>
                      <p>{order.shippingInfo.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Contact</p>
                    <p className="mt-1 text-slate-600">
                      {order.shippingInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info Card */}
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {order.paymentInfo.method}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Payment ID:</span>
                  <span className="font-mono text-sm break-all">
                    {order.paymentInfo.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge className="text-green-800 bg-green-100 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {order.paymentInfo.status}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Paid At:</span>
                  <span className="font-medium">
                    {format(
                      new Date(order.paymentInfo.paidAt),
                      "MMM d, yyyy h:mm a"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mb-8 transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Order Items ({order.orderItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left border-b border-slate-200">
                  <tr>
                    <th className="pb-3 font-medium text-slate-700">Product</th>
                    <th className="pb-3 font-medium text-slate-700">Price</th>
                    <th className="pb-3 font-medium text-slate-700">
                      Quantity
                    </th>
                    <th className="pb-3 font-medium text-right text-slate-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={
                        index !== order.orderItems.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 overflow-hidden border rounded-lg bg-slate-50">
                            {item.image ? (
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-slate-200">
                                <Package className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.categorySlug} • {item.subCategorySlug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-700">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-slate-700">{item.quantity}</td>
                      <td className="py-4 font-medium text-right text-slate-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-900">
              Need Help with Your Order?
            </CardTitle>
            <p className="text-slate-600">
              Our customer support team is here to assist you with any
              questions.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 text-center rounded-l bg-gradient-to-br from-green-50 to-cyan-50">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="mb-2 font-semibold text-gray-800">Call Us</h4>
                <p className="mb-3 text-gray-600">
                  Speak directly with our support team
                </p>
                <a
                  href="tel:+917977509402"
                  className="font-semibold text-green-600 transition-colors duration-200 hover:text-green-700"
                >
                  +91 79775 09402
                </a>
              </div>

              <div className="p-6 text-center rounded-l bg-gradient-to-br from-cyan-50 to-green-50">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="mb-2 font-semibold text-grey-600">Email Us</h4>
                <p className="mb-3 text-gray-800">
                  Send us your questions anytime
                </p>
                <a
                  href="mailto:info@cycledaddy.com"
                  className="font-semibold text-green-600 transition-colors duration-200 hover:text-primary-700"
                >
                  info@cycledaddy.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
