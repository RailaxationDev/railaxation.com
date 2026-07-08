"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  // Handle Home Page Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Your navigation bar links mapped to the exact clean targets
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Railaxation Shop", href: "/shop" },
    { name: "About / Contact", href: "/about" },
  ];

  // Your three product collections with precise navigation routes
  const categories = [
    { name: "Railaxation Candles & Melts", img: "/candles.PNG", href: "/shop?category=candles" },
    { name: "Railaxation Soaps", img: "/rosesoap.PNG", href: "/shop?category=soaps" },
    { name: "Railaxation Boxes", img: "/webim.PNG", href: "/shop?category=boxes" },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans">
      
      {/* 1. BRAND NAVIGATION HEADER */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-zinc-200 bg-white">
        <nav className="flex gap-6 text-sm tracking-wide font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Brand Logo Text */}
        <span className="font-serif text-lg tracking-[0.2em] font-bold text-[#0B2B1B]">
          RAILAXATION
        </span>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HERO SECTION WITH IMAGE AND FUNCTIONAL SEARCH BAR */}
        <section className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden flex items-center justify-center shadow-md">
          <Image 
            src="/webim.PNG" 
            alt="It's not relaxation it's Railaxation" 
            fill 
            priority
            sizes="(max-w-7xl) 100vw, 1200px"
            className="object-cover brightness-[0.85]" 
          />

          {/* Foreground elements container inside the center */}
          <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
            
            {/* Search Bar Container */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl flex bg-white rounded-full overflow-hidden shadow-lg border border-zinc-200 mb-6">
              <input 
                type="text" 
                placeholder="Search our Railaxation creations..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-6 py-4 text-zinc-800 focus:outline-none text-sm"
              />
              <button 
                type="submit" 
                className="bg-[#0B2B1B] text-white px-6 font-medium text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all"
              >
                Search
              </button>
            </form>

            {/* Slogan Text - Beneath search bar, and locked to one line */}
            <h1 className="text-white font-serif text-2xl md:text-4xl tracking-wide font-extrabold drop-shadow-md whitespace-nowrap">
              It's not relaxation, it's Railaxation
            </h1>

          </div>
        </section>

        {/* 3. THREE CATEGORIES GRID - LINKED DIRECTLY TO FILTERS */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-2xl tracking-wide mb-10">
            Browse Our Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link href={cat.href} key={cat.name} className="group cursor-pointer">
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image 
                    src={cat.img} 
                    alt={cat.name} 
                    fill 
                    sizes="(max-w-7xl) 33vw, 400px"
                    className="object-cover group-hover:brightness-95 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-serif tracking-wide">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. The Railaxation STORY */}
        <section className="mt-24 max-w-2xl mx-auto text-center border-t border-zinc-200 pt-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-2">
            The Story of Railaxation
          </span>
          <h2 className="font-serif text-3xl mb-6">Meticulously Crafted, Mindfully Made</h2>
          <p className="text-zinc-600 font-light leading-relaxed text-sm md:text-base">
            Railaxation was born in the heart of Birmingham, emerging from a shared moment of 
            inspiration between a mother and her 8-year-old daughter. What began as a childhood interest 
            in the science and craft of blending natural ingredients quickly blossomed into a 
            dedicated focus on helping people relax. Guided by her mother’s wisdom, a daughter’s 
            hobby of crafting handmade products transformed into a premium family business. 
            Today, every single candle, soap, and railaxation box is meticulously handcrafted 
            1-by-1 in Birmingham. We cater to both children and adults with a diverse range 
            of curated hampers designed to suit your unique grooming and wellness needs. By 
            combining strict scientific precision with a deep focus on self-care, we create 
            quiet, comforting rituals that soothe the mind, inspire the spirit, and bring a 
            lasting sense of calm into your home—because it's not relaxation, it's Railaxation.
          </p>
        </section>
      </main>

    </div>
  );
}