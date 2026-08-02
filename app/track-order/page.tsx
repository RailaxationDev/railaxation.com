"use client";

import { useState } from "react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderDetails(null);

    let localOrders: any[] = [];

    try {
      if (typeof window !== "undefined") {
        const savedOrders = JSON.parse(localStorage.getItem("railaxation_orders") || "[]");
        localOrders = Array.isArray(savedOrders) ? savedOrders : [];
      }

      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email, localOrders }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order details could not be found.");
      }

      setOrderDetails(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-zinc-100 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
            Railaxation Delivery Portal
          </span>
          <h1 className="font-serif text-3xl">Track Your Order</h1>
          <p className="text-xs text-zinc-500 font-light">
            Enter your Order Reference ID or tracking number and the email address used for the purchase.
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-600">
              Order Reference ID
            </label>
            <input
              type="text"
              required
              placeholder="ORD-... or RAIL-..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2B1B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-600">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2B1B]"
            />
          </div>

          {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Locating Parcel..." : "Track Status"}
          </button>
        </form>

        {orderDetails && (
          <div className="mt-6 pt-6 border-t border-zinc-100 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400 uppercase">Live Status</span>
              <span className="text-xs font-bold uppercase bg-[#0B2B1B] text-[#D4AF37] px-3 py-1 rounded-full">
                {orderDetails.status}
              </span>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl text-xs space-y-2 text-zinc-600 border border-zinc-100">
              <p><strong>Customer:</strong> {orderDetails.customerName}</p>
              <p><strong>Courier:</strong> {orderDetails.courier}</p>
              <p><strong>Tracking #:</strong> {orderDetails.trackingNumber}</p>
              <p><strong>Shipping Address:</strong> {orderDetails.address}</p>
              <p><strong>Items:</strong> {orderDetails.items.join(", ")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}