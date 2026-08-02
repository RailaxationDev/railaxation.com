"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  name: string;
  price: number;
  scent?: string;
  quantity?: number;
  img?: string;
  isFreeItem?: boolean;
}

interface OrderDetails {
  orderId: string;
  trackingNumber?: string;
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCode?: string | null;
  promoType?: string | null;
  date: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("railaxation_orders") || "[]");
    if (orders.length > 0) {
      const found = orders.find((o: OrderDetails) => o.orderId === orderIdParam) || orders[0];
      setOrder(found);
    }
  }, [orderIdParam]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 text-black font-sans">
      <div className="bg-white p-8 rounded-2xl border border-black shadow-xl max-w-lg w-full space-y-6">
        
        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
          ✓
        </div>

        <div className="space-y-2 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">Order Confirmed</span>
          <h1 className="font-serif text-3xl">Thank You for Your Order!</h1>
          <p className="text-xs text-zinc-600">
            A confirmation receipt and tracking notification have been dispatched to <strong className="text-black">{order?.email || "your email"}</strong> and our management team.
          </p>
        </div>

        {order && (
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-3 text-left">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span><strong>Order ID:</strong> {order.orderId}</span>
              <span><strong>Status:</strong> Paid & Processing</span>
            </div>

            <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Tracking Number</p>
              <p className="font-mono text-sm font-bold text-emerald-800">{order.trackingNumber || "TRK-ACTIVE"}</p>
            </div>

            <div>
              <p className="font-bold mb-1 uppercase tracking-wide text-[10px] text-zinc-500">Items Ordered & Free Gifts Received:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-3 items-center py-2 px-2 border-b border-zinc-100 rounded ${
                      item.isFreeItem ? 'text-emerald-900 font-semibold bg-emerald-50 border border-emerald-200' : ''
                    }`}
                  >
                    {item.img && (
                      <div className="relative w-14 h-14 rounded-md overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
                        <Image src={item.img} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">
                        {item.name} {item.scent ? `(${item.scent})` : ""}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {item.isFreeItem
                          ? "1 Promo BOGO item shipped free"
                          : order?.appliedCode && order?.promoType === "bogo"
                            ? `Quantity: 1 Paid item + 1 Promo BOGO item = x2 ${item.name} shipped`
                            : `Quantity: x${item.quantity || 1}`}
                      </p>
                    </div>
                    <span className={item.isFreeItem ? "text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded text-xs shrink-0" : "font-semibold shrink-0"}>
                      {item.isFreeItem ? "🎁 FREE (£0.00)" : `£${(item.price * (item.quantity || 1)).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.appliedCode && (
              <div className="p-2 bg-emerald-100/60 rounded border border-emerald-300 text-emerald-900">
                <p><strong>Promo Code Used:</strong> {order.appliedCode}</p>
                <p><strong>Reward Received:</strong> {order.promoType === "bogo" ? "Buy One Get One Free items applied successfully!" : "Percentage discount successfully deducted!"}</p>
              </div>
            )}

            <div className="border-t border-zinc-200 pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Shipping Address:</span>
                <span className="text-right text-zinc-600">{order.address}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-zinc-200">
                <span>Total Charged:</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Link
            href="/"
            className="block w-full bg-black text-white py-3 rounded-full text-xs uppercase tracking-widest font-bold text-center hover:bg-zinc-800 transition-all shadow-sm"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-20 font-serif">Loading Confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}