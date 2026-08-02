"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id?: string | number;
  name: string;
  price: number;
  scent?: string;
  category?: string;
  quantity?: number;
  freeQuantity?: number;
  img?: string;
  isFreeItem?: boolean;
}

interface PromoCode {
  code: string;
  type: "percent" | "bogo";
  percent?: number;
  category?: string;
  active: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(2.99);
  const [totalDue, setTotalDue] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  
  const [cardNumber, setCardNumber] = useState<string>("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("123");

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const pendingOrderStr = localStorage.getItem("pendingOrder");
    if (pendingOrderStr) {
      try {
        const pending = JSON.parse(pendingOrderStr);
        if (pending.items) setCartItems(pending.items);
        if (typeof pending.subtotal === "number") setSubtotal(pending.subtotal);
        if (typeof pending.discount === "number") setDiscountAmount(pending.discount);
        if (typeof pending.shippingFee === "number") setShippingFee(pending.shippingFee);
        if (typeof pending.totalAmount === "number") setTotalDue(pending.totalAmount);
        if (pending.appliedPromo) setAppliedPromo(pending.appliedPromo);
      } catch (e) {
        console.error(e);
      }
    }

    const userEmail = localStorage.getItem("railaxation_user_email");
    const userName = localStorage.getItem("railaxation_user_name");
    if (userEmail) setEmail(userEmail);
    if (userName) setName(userName);
  }, []);

  const handleCompleteOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !name || !address || !cardNumber || !cardExpiry || !cardCvc) {
      alert("Please fill in all customer, delivery, and payment details.");
      return;
    }

    if (appliedPromo && email) {
      const history = JSON.parse(localStorage.getItem("railaxation_code_history") || "[]");
      const alreadyUsed = history.some(
        (entry: { email: string; code: string }) => 
          entry.email.toLowerCase() === email.toLowerCase() && entry.code === appliedPromo.code
      );

      if (alreadyUsed) {
        alert("You have already used this promotion code on a previous order.");
        return;
      }
    }

    setIsProcessing(true);

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `RAIL-${new Date().getUTCFullYear()}-${Math.random().toString(36).toUpperCase().slice(2, 8)}-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
    const courier = "Royal Mail / Railaxation Delivery";

    const orderDetails = {
      orderId,
      trackingNumber,
      courier,
      name,
      email,
      address,
      items: cartItems,
      subtotal,
      discount: discountAmount,
      shippingFee,
      total: totalDue,
      appliedCode: appliedPromo ? appliedPromo.code : null,
      promoType: appliedPromo ? appliedPromo.type : null,
      status: "Paid & Processing",
      date: new Date().toLocaleString(),
    };

    // Trigger Resend email API integration with full address and order details
    try {
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          address,
          orderId,
          trackingNumber,
          total: totalDue,
          items: cartItems,
          appliedCode: appliedPromo ? appliedPromo.code : null,
        }),
      });
    } catch (emailError) {
      console.error("Failed to trigger confirmation email:", emailError);
    }

    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem("railaxation_orders") || "[]");
      existingOrders.unshift(orderDetails);
      localStorage.setItem("railaxation_orders", JSON.stringify(existingOrders));

      if (appliedPromo && email) {
        const history = JSON.parse(localStorage.getItem("railaxation_code_history") || "[]");
        history.unshift({
          email,
          code: appliedPromo.code,
          type: appliedPromo.type,
          date: new Date().toLocaleString(),
        });
        localStorage.setItem("railaxation_code_history", JSON.stringify(history));
      }

      localStorage.removeItem("railaxation_cart");
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("railaxation_applied_promo");

      router.push(`/checkout/success?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-8 text-[#0B2B1B] font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-200 pb-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">Railaxation Secure Gateway</span>
          <h1 className="font-serif text-3xl">Checkout & Payment</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <form onSubmit={handleCompleteOrder} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-serif text-xl border-b border-zinc-100 pb-2">Customer & Delivery Details</h2>
            
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1 font-bold text-zinc-600">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider mb-1 font-bold text-zinc-600">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider mb-1 font-bold text-zinc-600">Shipping Address</label>
              <textarea
                rows={3}
                placeholder="123 Railaxation St, Birmingham, UK"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                required
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-md text-[#0B2B1B] border-b border-zinc-100 pb-1">Payment Details (Stripe Test Mode)</h3>
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-1 font-bold text-zinc-600">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-bold text-zinc-600">Expiration Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-bold text-zinc-600">CVC Code</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2B1B]"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cartItems.length === 0}
              className="w-full bg-[#0B2B1B] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isProcessing ? "Processing Secure Payment..." : `Complete Order (£${totalDue.toFixed(2)})`}
            </button>
          </form>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl border-b border-zinc-100 pb-2">Order Summary</h2>

            <div className="space-y-3 max-h-56 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-xs text-zinc-500">Your order summary is empty.</p>
              ) : (
                cartItems.map((item, idx) => {
                  const isFree = item.isFreeItem;
                  const displayQuantity = item.quantity || 1;

                  return (
                    <div 
                      key={idx} 
                      className={`text-xs border-b border-zinc-100 pb-3 space-y-1 ${
                        isFree ? 'bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200' : ''
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        {item.img && (
                          <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden border border-zinc-200 bg-zinc-50">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex justify-between items-start gap-3">
                          <div>
                            <p className="font-bold text-[#0B2B1B]">
                              {item.name} {isFree && <span className="text-emerald-700">(BOGO Free Item)</span>}
                            </p>
                            {item.scent && <p className="text-[#D4AF37] font-medium">Scent: {item.scent}</p>}
                            
                            <p className="text-zinc-600 mt-1 font-medium">
                              {isFree 
                                ? `1 Promo BOGO item shipped free` 
                                : appliedPromo && appliedPromo.type === "bogo"
                                ? `Quantity: 1 Paid item + 1 Promo BOGO item = x2 ${item.name} shipped`
                                : `Quantity: x${displayQuantity}`
                              }
                            </p>
                          </div>
                          <p className="font-semibold text-[#0B2B1B]">
                            {isFree ? (
                              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">FREE (£0.00)</span>
                            ) : (
                              `£${(item.price * displayQuantity).toFixed(2)}`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {appliedPromo && (
              <div className="p-3 bg-emerald-50 border border-emerald-600 rounded-xl text-xs flex justify-between items-center text-emerald-900 font-bold">
                <span>Active Promo: {appliedPromo.code} ({appliedPromo.type === "bogo" ? "BOGO Applied" : `${appliedPromo.percent}% Off`})</span>
                <span className="text-emerald-700 uppercase">Applied</span>
              </div>
            )}

            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-medium text-[#0B2B1B]">£{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="font-medium text-[#0B2B1B]">
                  {shippingFee === 0 ? "FREE" : `£${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between font-bold text-base border-t border-zinc-200 pt-3 text-[#0B2B1B]">
                <span>Total due</span>
                <span>£{totalDue.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}