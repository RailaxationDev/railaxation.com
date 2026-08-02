"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"story" | "faq" | "policies">("story");

  const faqs = [
    {
      q: "Where are Railaxation products made?",
      a: "Every single candle, soap bar, and relaxation box is meticulously handcrafted 1-by-1 right here in Birmingham."
    },
    {
      q: "What makes the 8oz Premium Candle Tin slow-burn signature?",
      a: "Our Railaxation 8oz travel-friendly tins are poured with precise parameters. This specific formulation maximizes premium aroma throw while maintaining a steady, soot-free slow burn cycle."
    },
    {
      q: "Are the Railaxation Soaps safe for children's sensitive skin?",
      a: "Absolutely. Our single heart soaps, novelty car soaps, and cube pack combinations are completely covered by an official Cosmetic Product Safety Report (CPSR). We use premium, skin-loving ingredients sourced from trusted UK suppliers to ensure our formulas are gentle, thoroughly evaluated, and entirely safe for daily bubble routines."
    },
    {
      q: "How can I contact the Railaxation team?",
      a: "You can reach us directly for customer care, custom event requests, or wholesale box orders at railaxation@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans">
      
      {/* BRAND NAVIGATION HEADER */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 flex flex-col gap-3 border-b border-zinc-200 bg-white sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm tracking-wide font-medium">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Railaxation Shop</Link>
          <span className="text-[#D4AF37] font-semibold">About & Support</span>
        </nav>
        <span className="font-serif text-base sm:text-lg tracking-[0.2em] font-bold whitespace-nowrap">RAILAXATION</span>
      </header>

      {/* CORE FRAMEWORK BANNER */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl tracking-wide mb-3">Customer Sanctuary</h1>
          <p className="text-zinc-500 text-sm font-light">Explore our foundational roots, support channels, and store policies.</p>
        </div>

        {/* INTERACTIVE NAVIGATION CONTROL TABS */}
        <div className="flex justify-center gap-6 border-b border-zinc-200 pb-4 mb-12 text-sm tracking-wide font-medium">
          <button 
            onClick={() => setActiveTab("story")}
            className={`pb-2 transition-all ${activeTab === "story" ? "border-b-2 border-[#0B2B1B] font-bold text-[#0B2B1B]" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            Our Story
          </button>
          <button 
            onClick={() => setActiveTab("faq")}
            className={`pb-2 transition-all ${activeTab === "faq" ? "border-b-2 border-[#0B2B1B] font-bold text-[#0B2B1B]" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            Frequently Asked Questions
          </button>
          <button 
            onClick={() => setActiveTab("policies")}
            className={`pb-2 transition-all ${activeTab === "policies" ? "border-b-2 border-[#0B2B1B] font-bold text-[#0B2B1B]" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            Shipping & Returns
          </button>
        </div>

        {/* TAB TARGET CONTENT PANEL 1: BRAND STORY */}
        {activeTab === "story" && (
          <div className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-2">The Story of Railaxation</span>
            <h2 className="font-serif text-2xl mb-6">Meticulously Crafted, Mindfully Made</h2>
            <p className="text-zinc-600 font-light leading-relaxed mb-6 text-sm md:text-base">
              Railaxation was born in the heart of Birmingham, emerging from a shared moment of inspiration between a mother and her 8-year-old daughter. What began as a childhood interest in the science and craft of blending ingredients quickly blossomed into a dedicated focus on helping people relax. 
            </p>
            <p className="text-zinc-600 font-light leading-relaxed mb-6 text-sm md:text-base">
              Guided by her mother’s wisdom, a daughter’s hobby of crafting handmade products transformed into a certified family business. Today, every single candle, soap, and Railaxation Box is meticulously handcrafted 1-by-1 right here in Birmingham. We utilize premium, industry-trusted bases and ingredients to create products that cater beautifully to both children and adults.
            </p>
            <p className="text-zinc-600 font-light leading-relaxed text-sm md:text-base">
              By combining certified cosmetic safety standards with a deep focus on self-care, we create quiet, comforting rituals that soothe the mind, inspire the spirit, and bring a lasting sense of calm into your home—because it's not relaxation, it's Railaxation.
            </p>
            
            <div className="mt-10 border-t border-zinc-100 pt-8 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h4 className="font-serif text-lg mb-1">Direct Assistance</h4>
                <p className="text-zinc-400 text-xs font-light">Have a general question, bespoke hamper request, or wholesale inquiry?</p>
              </div>
              <a href="mailto:railaxation@gmail.com" className="bg-[#0B2B1B] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-sm shrink-0">
                Email Customer Support
              </a>
            </div>
          </div>
        )}

        {/* TAB TARGET CONTENT PANEL 2: FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
                <h3 className="font-serif text-lg text-[#0B2B1B] mb-2">✨ {faq.q}</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB TARGET CONTENT PANEL 3: POLICIES */}
        {activeTab === "policies" && (
          <div className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm space-y-8">
            <div>
              <h3 className="font-serif text-xl mb-3 text-[#0B2B1B]">Dispatch & Shipping Policies</h3>
              <p className="text-zinc-500 text-sm font-light leading-relaxed mb-3">
                Because all Railaxation creations are meticulously handcrafted 1-by-1 in Birmingham, orders undergo a careful processing and packaging window to ensure high standards of finish and curing quality before they are sent out.
              </p>
              <ul className="text-zinc-500 text-sm font-light list-disc list-inside space-y-1 pl-2">
                <li>All available shipping carrier methods and exact delivery rates are calculated dynamically directly at checkout.</li>
                <li>Tracking details will be emailed to you immediately upon dispatch.</li>
              </ul>
            </div>

            <hr className="border-zinc-100" />

            <div>
              <h3 className="font-serif text-xl mb-3 text-[#0B2B1B]">Returns & Replacements Guidelines</h3>
              <p className="text-zinc-500 text-sm font-light leading-relaxed mb-3">
                Due to the customized nature of personal cosmetic products and hand-poured candle elements, we are unable to offer standard returns on opened or used items for health and safety reasons. 
              </p>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                However, your satisfaction is our priority. If any candle tins arrive dented or dynamic box sets are damaged during transit, please email clear photos to <strong>railaxation@gmail.com</strong> within 48 hours of delivery, and we will issue an immediate priority replacement package free of charge.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}