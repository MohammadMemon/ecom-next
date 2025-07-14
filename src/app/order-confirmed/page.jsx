"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

export default function OrderConfirmed() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const paymentInfo = sessionStorage.getItem("lastPayment");

    if (paymentInfo) {
      try {
        const data = JSON.parse(paymentInfo);
        setOrderData(data);
      } catch (err) {
        console.error("Error parsing payment data:", err);
        setError("Unable to load order information");
      }
    } else {
      setError("No order information found");
    }

    setLoading(false);
  }, []);

  const handleContinueShopping = () => {
    // Clear the payment info and redirect to home
    sessionStorage.removeItem("lastPayment");
    window.location.href = "/";
  };

  const handleShareOrder = () => {
    if (navigator.share && orderData) {
      navigator.share({
        title: "Order Confirmed!",
        text: `My order #${orderData.orderId} has been confirmed for ₹${orderData.amount}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Oops!</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center gap-2 px-6 py-3 mx-auto text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground">
      {/* Main Content */}
      <div className="max-w-4xl px-4 py-8 mx-auto">
        {/* Success Card */}
        <div className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">
          {/* Header with checkmark */}
          <div className="p-8 text-center bg-gradient-to-r from-green-500 to-emerald-600">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white rounded-full">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Order Confirmed!
            </h2>
            <p className="text-lg text-green-100">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Order Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold text-gray-800">
                        #{orderData?.orderId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-semibold text-gray-800">
                        #{orderData?.paymentId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="text-lg font-semibold text-green-600">
                        ₹{orderData?.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold text-gray-800">
                        {orderData?.timestamp
                          ? new Date(orderData.timestamp).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleShareOrder}
                    className="flex items-center gap-2 px-4 py-2 duration-200 rounded-lg "
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  What's Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-full">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Order Confirmation
                      </h4>
                      <p className="text-sm text-gray-600">
                        You'll receive an email confirmation with your order
                        details shortly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-full">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Order Processing
                      </h4>
                      <p className="text-sm text-gray-600">
                        We're preparing your order for shipment. This usually
                        takes 1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-full">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Shipping & Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Once shipped, you'll receive tracking information to
                        monitor your delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-2xl font-bold text-gray-800">
              Need Help?
            </h3>
            <p className="text-gray-600">
              Our customer support team is here to assist you with any
              questions.
            </p>
          </div>

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
        </div>

        {/* Continue Shopping Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleContinueShopping}
            className="px-8 py-4 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
