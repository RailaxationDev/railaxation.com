"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  scent?: string;
  category?: string;
  quantity: number;
  freeQuantity?: number;
  img: string;
  isFreeItem?: boolean;
}

interface PromoCode {
  code: string;
  type: "percent" | "bogo";
  percent?: number;
  category?: string;
  active: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartSubtotal } = useCart();
  const subtotal = getCartSubtotal();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [activePromos, setActivePromos] = useState<PromoCode[]>([]);

  useEffect(() => {
    const savedPromos: PromoCode[] = JSON.parse(localStorage.getItem("railaxation_promos") || "[]");
    setActivePromos(savedPromos.filter(p => p.active));

    const savedAppliedPromo = localStorage.getItem("railaxation_applied_promo");
    if (savedAppliedPromo) {
      try {
        setAppliedPromo(JSON.parse(savedAppliedPromo));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  let discountAmount = 0;
  let displayCart: CartItem[] = [];

  (cart as CartItem[]).forEach(item => {
    const isEligible = appliedPromo && appliedPromo.type === "bogo" && 
      (appliedPromo.category === "all" || !appliedPromo.category || item.category === appliedPromo.category);

    if (isEligible && item.quantity >= 1) {
      const freeCount = item.quantity;
      discountAmount += freeCount * item.price;

      // Add paid item
      displayCart.push({
        ...item,
        quantity: item.quantity,
        freeQuantity: 0,
        isFreeItem: false
      });

      // Add free BOGO item explicitly
      displayCart.push({
        ...item,
        price: 0,
        quantity: freeCount,
        freeQuantity: freeCount,
        isFreeItem: true,
        name: `${item.name} (BOGO Free Item)`
      });
    } else {
      displayCart.push({ ...item, freeQuantity: 0, isFreeItem: false });
    }
  });

  if (appliedPromo && appliedPromo.type === "percent" && appliedPromo.percent) {
    discountAmount = (subtotal * appliedPromo.percent) / 100;
  }

  const shippingFee = subtotal > 35 ? 0 : 2.99;
  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingFee : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");

    const found = activePromos.find((p) => p.code === promoCodeInput.toUpperCase());
    if (!found) {
      setPromoError("Invalid or inactive promo code.");
      return;
    }

    const userEmail = localStorage.getItem("railaxation_user_email") || "guest_user";
    const codeHistory = JSON.parse(localStorage.getItem("railaxation_code_history") || "[]");
    const alreadyUsed = codeHistory.some(
      (entry: { email: string; code: string }) => 
        entry.email.toLowerCase() === userEmail.toLowerCase() && entry.code === found.code
    );

    if (alreadyUsed) {
      setPromoError("You have already used this promotion code.");
      return;
    }

    setAppliedPromo(found);
    localStorage.setItem("railaxation_applied_promo", JSON.stringify(found));
    setPromoCodeInput("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    localStorage.removeItem("railaxation_applied_promo");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans">
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-zinc-200 bg-white">
        <nav className="flex gap-6 text-sm tracking-wide font-medium">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Railaxation Shop</Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About / Contact</Link>
        </nav>
        <span className="font-serif text-lg tracking-[0.2em] font-bold">RAILAXATION</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl tracking-wide mb-8">Your Basket</h1>

        {activePromos.length > 0 && (
          <div className="mb-8 bg-[#0B2B1B] text-white p-4 rounded-xl text-xs flex flex-col md:flex-row justify-between items-center gap-2 shadow-sm">
            <div>
              <span className="font-bold tracking-widest uppercase text-[#D4AF37]">🔥 Available Offers: </span>
              {activePromos.map((p, idx) => (
                <span key={idx} className="mr-4">
                  Code <strong className="underline">{p.code}</strong> ({p.type === "bogo" ? "Buy One Get One Free" : `${p.percent}% off`})
                </span>
              ))}
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-zinc-100 shadow-sm">
            <p className="text-zinc-400 font-light mb-6">Your shopping basket is currently empty.</p>
            <Link href="/shop" className="inline-block bg-[#0B2B1B] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-sm">
              Browse Shop Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {displayCart.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.scent}-${idx}`} 
                  className={`bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4 ${item.isFreeItem ? 'border-emerald-300 bg-emerald-50/30' : 'border-zinc-100'}`}
                >
                  <div className="relative w-20 h-20 bg-zinc-50 rounded-md overflow-hidden shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-[#0B2B1B] truncate">{item.name}</h3>
                    <p className="text-xs text-[#D4AF37] font-medium mb-1">Scent: {item.scent}</p>
                    <span className="text-sm font-medium text-zinc-600">
                      {item.isFreeItem ? (
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">🎁 FREE BOGO ITEM (£0.00)</span>
                      ) : (
                        `£${item.price.toFixed(2)} each`
                      )}
                    </span>
                  </div>

                  {!item.isFreeItem && (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.scent!, item.quantity - 1)} className="w-7 h-7 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-xs">-</button>
                        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.scent!, item.quantity + 1)} className="w-7 h-7 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-xs">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.scent!)} className="text-xs text-red-500 hover:underline font-light pt-1">Remove</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm space-y-6">
              <h2 className="font-serif text-xl border-b border-zinc-100 pb-3">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-light">Subtotal</span>
                  <span className="font-medium text-[#0B2B1B]">£{subtotal.toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center text-emerald-700 font-medium text-xs bg-emerald-50 p-2 rounded-lg">
                    <span>Discount ({appliedPromo.code})</span>
                    <div className="flex items-center gap-2">
                      <span>-£{discountAmount.toFixed(2)}</span>
                      <button onClick={handleRemovePromo} className="text-red-500 underline text-[10px]">Remove</button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-4">
                  <span className="text-zinc-500 font-light">Shipping {subtotal > 35 ? "(Free over £35)" : ""}</span>
                  <span className="text-zinc-700 font-medium text-xs">{shippingFee === 0 ? "FREE" : `£${shippingFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between items-center text-base font-bold pt-2">
                  <span>Total estimate</span>
                  <span>£{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <label className="block text-xs uppercase tracking-wider font-bold text-zinc-600">Have a Promo Code?</label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input type="text" placeholder="ENTER CODE..." value={promoCodeInput} onChange={(e) => setPromoCodeInput(e.target.value)} className="flex-1 p-2 border border-zinc-200 rounded-lg text-xs uppercase font-bold bg-zinc-50 focus:outline-none focus:border-[#0B2B1B]" />
                  <button type="submit" className="px-4 bg-[#0B2B1B] text-white rounded-lg text-xs uppercase font-bold hover:bg-opacity-90 transition-all">Apply</button>
                </form>
                {promoError && <p className="text-red-500 text-[11px] font-medium">{promoError}</p>}
              </div>

              <button 
                onClick={async () => {
                  try {
                    localStorage.setItem(
                      "pendingOrder",
                      JSON.stringify({
                        items: displayCart,
                        subtotal,
                        discount: discountAmount,
                        shippingFee,
                        totalAmount: finalTotal,
                        appliedPromo: appliedPromo ? appliedPromo : null
                      })
                    );
                    router.push("/checkout");
                  } catch (error) {
                    console.error("Checkout navigation failed:", error);
                  }
                }}
                className="w-full bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md block text-center cursor-pointer"
              >
                Proceed to Checkout (£{finalTotal.toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}