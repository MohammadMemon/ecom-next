"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Search,
  Eye,
  X,
  CheckCircle,
  Truck,
  Clock,
  DollarSign,
  BarChart3,
  ArrowUp,
  Star,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    topProducts: [],
    revenueData: [],
  });

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/v1/admin/orders");
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
        calculateAnalytics(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const calculateAnalytics = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = ordersData.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      const dayRevenue = dayOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      revenueData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: dayRevenue,
      });
    }

    const calculateRevenueGrowth = () => {
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      const previous7Days = new Date(today);
      previous7Days.setDate(today.getDate() - 14);

      // Revenue for last 7 days
      const recentRevenue = ordersData
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= last7Days && orderDate <= today;
        })
        .reduce((sum, order) => sum + order.totalPrice, 0);

      // Revenue for previous 7 days
      const previousRevenue = ordersData
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= previous7Days && orderDate < last7Days;
        })
        .reduce((sum, order) => sum + order.totalPrice, 0);

      // Calculate growth percentage
      if (previousRevenue === 0) {
        return recentRevenue > 0 ? 100 : 0;
      }
      return ((recentRevenue - previousRevenue) / previousRevenue) * 100;
    };

    // Calculate top products
    const productMap = {};
    ordersData.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (productMap[item.name]) {
          productMap[item.name].sales += item.quantity;
          productMap[item.name].revenue += item.price * item.quantity;
        } else {
          productMap[item.name] = {
            name: item.name,
            sku: item.sku,
            image: item.image,
            sales: item.quantity,
            revenue: item.price * item.quantity,
          };
        }
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const revenueGrowth = calculateRevenueGrowth();

    setAnalytics({
      totalOrders,
      totalRevenue,
      revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
      topProducts,
      revenueData,
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            orderId === orderId ? { ...order, orderStatus: "Cancelled" } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <Package className="w-4 h-4" />;
      case "Cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesSearch =
      order.shippingInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.phone.toString().includes(searchTerm) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-foreground">
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Manage orders and track your business performance
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalOrders}
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
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{analytics.totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900">
                      {analytics.revenueGrowth}%
                    </p>
                    {analytics.revenueGrowth >= 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600">Revenue Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all backdrop-blur-md bg-white/30 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-100">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      orders.filter(
                        (o) =>
                          o.orderStatus !== "Cancelled" &&
                          o.orderStatus !== "Delivered"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-slate-600">Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Revenue Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#02D866"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden border rounded-lg bg-slate-50">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full rounded-full bg-slate-200">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {product.sales} sales SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          ₹{product.revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No product data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card className="transition-shadow backdrop-blur-md bg-white/30 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Management
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-col gap-4 mt-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.toReversed().map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 border rounded-lg bg-white/50"
                >
                  <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-slate-900">
                          {order.orderId}
                        </p>
                        <p className="text-sm truncate text-slate-600">
                          {order.shippingInfo.name}
                        </p>
                        <p className="text-sm truncate text-slate-600">
                          {order.shippingInfo.phone}
                        </p>
                        <p className="text-xs truncate text-slate-500">
                          {order.user.userEmail}
                        </p>
                      </div>

                      {/* Badge - Fixed Alignment */}
                      <Badge
                        className={`${getStatusColor(
                          order.orderStatus
                        )} flex items-center gap-1 whitespace-nowrap self-start sm:self-center`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </Badge>
                    </div>

                    {/* Right Side - Price and View Button */}
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ₹{order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Dialog - Kept Exactly As Is */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="shrink-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-h-[90vh] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Order Details - {order.orderId}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium text-slate-600">
                                  Customer Information
                                </p>
                                <div className="mt-2 space-y-1">
                                  <p className="font-medium">
                                    {order.shippingInfo.name}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {order.user.userEmail}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    Phone: {order.shippingInfo.phone}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-600">
                                  Order Date
                                </p>
                                <p className="mt-2 font-medium">
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-600">
                                Shipping Address
                              </p>
                              <p className="mt-2 font-medium">
                                {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pincode}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-600">
                                Order Items
                              </p>
                              <div className="mt-2 space-y-2">
                                {order.orderItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between p-3 rounded bg-slate-50"
                                  >
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-slate-600">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        SKU: {item.sku}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          router.push(
                                            `/product/${item.product}`
                                          )
                                        }
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <span className="font-medium">
                                        ₹
                                        {(item.price * item.quantity).toFixed(
                                          2
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between pt-4 border-t">
                              <span className="text-lg font-bold">
                                Total Amount:
                              </span>
                              <span className="text-lg font-bold">
                                ₹{order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {order.orderStatus === "Processing" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(order.orderId, "Shipped")
                        }
                        className="text-xs sm:text-sm"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        <span className="whitespace-nowrap">
                          Mark as Shipped
                        </span>
                      </Button>
                    )}
                    {order.orderStatus === "Shipped" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(order.orderId, "Delivered")
                        }
                        className="text-xs bg-green-500 hover:bg-green-600 sm:text-sm"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        <span className="whitespace-nowrap">
                          Mark as Delivered
                        </span>
                      </Button>
                    )}
                    {order.orderStatus !== "Cancelled" &&
                      order.orderStatus !== "Delivered" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelOrder(order.orderId)}
                          className="text-xs sm:text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          <span className="whitespace-nowrap">
                            Cancel Order
                          </span>
                        </Button>
                      )}
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    No orders found
                  </h3>
                  <p className="text-slate-600">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No orders have been placed yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
