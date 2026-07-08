"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartSubtotal } = useCart();
  const subtotal = getCartSubtotal();

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans">
      
      {/* BRAND NAVIGATION HEADER */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-zinc-200 bg-white">
        <nav className="flex gap-6 text-sm tracking-wide font-medium">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Railaxation Shop</Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About / Contact</Link>
        </nav>
        <span className="font-serif text-lg tracking-[0.2em] font-bold">RAILAXATION</span>
      </header>

      {/* CART PAGE CONTAINER */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl tracking-wide mb-8">Your Basket</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-zinc-100 shadow-sm">
            <p className="text-zinc-400 font-light mb-6">Your shopping basket is currently empty.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-[#0B2B1B] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-sm"
            >
              Browse Shop Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT SIDE: BASKET ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.scent}-${idx}`} 
                  className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center gap-4"
                >
                  <div className="relative w-20 h-20 bg-zinc-50 rounded-md overflow-hidden shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-[#0B2B1B] truncate">{item.name}</h3>
                    <p className="text-xs text-[#D4AF37] font-medium mb-2">Scent: {item.scent}</p>
                    <span className="text-sm font-medium text-zinc-600">£{item.price.toFixed(2)} each</span>
                  </div>

                  {/* QUANTITY AND REMOVAL ACTIONS */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.scent, item.quantity - 1)}
                        className="w-7 h-7 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.scent, item.quantity + 1)}
                        className="w-7 h-7 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.scent)}
                      className="text-xs text-red-500 hover:underline font-light pt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm space-y-6">
              <h2 className="font-serif text-xl border-b border-zinc-100 pb-3">Order Summary</h2>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-light">Subtotal</span>
                <span className="font-medium text-[#0B2B1B]">£{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-4">
                <span className="text-zinc-500 font-light">Shipping</span>
                <span className="text-zinc-400 text-xs font-light italic">Calculated at checkout</span>
              </div>

              <div className="flex justify-between items-center text-base font-bold">
                <span>Total estimate</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ cartItems: cart })
                    });
                    
                    const data = await response.json();
                    
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      console.error("Checkout route error:", data.error);
                      alert("Checkout configuration error. Please ensure your local keys are active.");
                    }
                  } catch (error) {
                    console.error("Checkout connection failed:", error);
                    alert("Something went wrong connecting to the checkout gateway.");
                  }
                }}
                className="w-full bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md block text-center cursor-pointer"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-[10px] text-zinc-400 font-light text-center leading-relaxed">
                Transactions are encrypted and processed securely. Shipping methods and dynamic courier handling options will populate on the final gateway interface screen.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}