"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";

export function OrderCard({ order }) {
  const router = useRouter();
  const statusConfig = {
    Processing: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    Shipped: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Truck className="w-3 h-3" />,
    },
    Delivered: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    Cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <Package className="w-3 h-3" />,
    },
  };

  const config = statusConfig[order.orderStatus] || statusConfig.Processing;

  return (
    <div className="p-5 transition-all border rounded-lg hover:shadow-md hover:border-slate-300 backdrop-blur-md bg-white/35">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            Order #{order.orderId}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={config.color}>
            {config.icon}
            <span className="ml-1">{order.orderStatus}</span>
          </Badge>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              ₹{order.totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">
              {order.orderItems.length} items
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <h4 className="mb-3 text-sm font-medium text-slate-700">Items:</h4>
        <div className="space-y-3">
          {order.orderItems.slice(0, 2).map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden border rounded-lg bg-slate-50">
                {item.image ? (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-slate-200">
                    <Package className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-slate-900">
                  {item.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {order.orderItems.length > 2 && (
          <p className="mt-3 text-sm font-medium text-slate-500">
            +{order.orderItems.length - 2} more items
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>
            {order.shippingInfo.city}, {order.shippingInfo.state}
          </span>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2 "
          onClick={() => router.push(`/account/orders/${order.orderId}`)}
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}
