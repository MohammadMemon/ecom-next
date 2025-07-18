"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, ShoppingCart } from "lucide-react";
import Loader from "@/components/ui/loader";
import { OrderCard } from "@/components/ui/OrderCard";
import { auth } from "@/firebase/client";

export default function AllOrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (!currentUser) {
            router.replace("/auth/login");
            return;
          }

          setUser(currentUser);
          await fetchOrders(currentUser);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setError("Authentication service unavailable. Please try again.");
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const fetchOrders = async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/v1/order/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      let ordersList = [];
      if (Array.isArray(data)) {
        ordersList = data;
      } else if (data.orders && Array.isArray(data.orders)) {
        ordersList = data.orders;
      } else {
        ordersList = [];
        console.error("Unexpected orders format:", data);
      }

      // Sort orders by creation date, newest first
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader fullScreen={true} />;

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            {/* Back Button */}
            <div>
              <Button
                onClick={() => router.back()}
                size="sm"
                className="flex items-center gap-2"
              >
                Back to Account
              </Button>
            </div>

            {/* Order Details */}
            <div>
              <p className="text-slate-600">View your complete order history</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Orders ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  No orders found
                </h3>
                <p className="mb-6 text-slate-500">
                  It looks like you haven't placed any orders yet.
                </p>
                <Button onClick={() => router.push("/")} size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
