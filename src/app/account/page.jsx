"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { googleProvider } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  ShoppingBag,
  Truck,
  CheckCircle,
  Package,
  Clock,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  ShoppingCart,
  Edit,
  Eye,
} from "lucide-react";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import { OrderCard } from "@/components/ui/OrderCard";

export default function ProfilePage() {
  const auth = getAuth();
  const provider = googleProvider();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        // Get custom claims
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || "user";
        setUser({
          ...user,
          role,
          phone: user.phoneNumber || "Not provided",
        });
        // Fetch user orders
        fetchOrders(user);
      }
    });

    return () => unsubscribe();
  }, []);

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

      setOrders(ordersList);

      // Calculate stats
      const totalSpent = ordersList.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      const pendingOrders = ordersList.filter(
        (order) =>
          order.orderStatus === "Processing" || order.orderStatus === "Shipped"
      ).length;

      setStats({
        totalOrders: ordersList.length,
        totalSpent,
        pendingOrders,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleSignout() {
    try {
      await signOut(auth);
      await fetch("/api/logout");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return <Loader fullScreen={true} />;

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user.displayName?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your account and track your orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalOrders}
                  </p>
                  <p className="text-sm text-slate-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{stats.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-100">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.pendingOrders}
                  </p>
                  <p className="text-sm text-slate-600">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info & Security */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Display Name</p>
                      <p className="font-medium">
                        {user.displayName || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-1 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Email Address</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium break-all">{user.email}</p>
                        {user.emailVerified && (
                          <Badge className="text-green-800 bg-green-100 border-green-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Account Role</p>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Login Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      {user.providerData[0]?.providerId === "google.com" ? (
                        <>
                          <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                            <span className="text-xs font-bold text-white">
                              G
                            </span>
                          </div>
                          <span className="font-medium">Google Account</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">Email/Password</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Member since{" "}
                      {new Date(user.metadata.creationTime).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {user.providerData[0]?.providerId !== "google.com" && (
                    <Button
                      onClick={() => router.push("/auth/reset-password")}
                      className="w-full"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push("/")}
                  className="justify-start w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => router.push("/account/orders")}
                  className="justify-start w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
                <Button
                  onClick={handleSignout}
                  className="justify-start w-full text-white bg-red-500 hover:bg-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order History */}
          <div className="lg:col-span-2">
            <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Recent Orders
                  </div>
                  {orders.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => router.push("/account/orders")}
                    >
                      View All
                    </Button>
                  )}
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
                      No orders yet
                    </h3>
                    <p className="mb-6 text-slate-500">
                      Start shopping to see your order history here
                    </p>
                    <Button onClick={() => router.push("/")} size="lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...orders]
                      .reverse()
                      .slice(0, 5)
                      .map((order) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          router={router}
                        />
                      ))}

                    {orders.length > 5 && (
                      <div className="pt-4 text-center border-t">
                        <Button onClick={() => router.push("/account/orders")}>
                          View {orders.length - 5} More Orders
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
