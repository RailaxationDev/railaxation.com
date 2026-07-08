"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Clear out the cart basket automatically once a purchase is successfully finalized
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-zinc-100 shadow-xl text-center space-y-6">
        
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-2xl border border-zinc-100">
          ✨
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold block">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl tracking-wide">Thank You!</h1>
          <p className="text-zinc-500 text-sm font-light leading-relaxed">
            Your Railaxation order has been successfully placed. We are meticulously handcrafting your items right here in Birmingham.
          </p>
        </div>

        <div className="bg-zinc-50 rounded-xl p-4 text-left border border-zinc-100">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">What Happens Next?</h3>
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            A confirmation breakdown summary along with your courier tracking link will hit your inbox as soon as your candle tins or soap sets pass curing quality checks and leave our workspace.
          </p>
        </div>

        <div className="pt-2">
          <Link 
            href="/shop" 
            className="block w-full bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md text-center"
          >
            Return to Shop
          </Link>
        </div>

      </div>
    </div>
  );
}