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

  // Your three product collections with precise navigation routes and editable image placeholders
  const categories = [
    { 
      name: "Railaxation Candles & Melts", 
      img: "/bluecandle.PNG",
      href: "/shop?category=candles" 
    },
    { 
      name: "Railaxation Soaps", 
      img: "/rosesoap.jpg",
      href: "/shop?category=soaps" 
    },
    { 
      name: "Railaxation Boxes", 
      img: "/comingsoon.PNG",
      href: "/shop?category=boxes" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans">
      
      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* HERO SECTION WITH IMAGE AND FUNCTIONAL SEARCH BAR */}
        <section className="relative w-full h-[300px] sm:h-[360px] md:h-[450px] rounded-xl overflow-hidden flex items-center justify-center shadow-md">
          <Image 
            src="/webim.PNG" 
            alt="It's not relaxation it's Railaxation" 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center brightness-[0.85]"
          />

          {/* Foreground elements container inside the center */}
          <div className="relative z-10 w-full max-w-2xl px-3 sm:px-4 flex flex-col items-center pt-40 sm:pt-48 md:pt-56">
            
            {/* Search Bar Container */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl flex flex-col sm:flex-row bg-white rounded-full overflow-hidden shadow-lg border border-zinc-200 mb-4 sm:mb-6">
              <input 
                type="text" 
                placeholder="Search our Railaxation creations..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-zinc-800 focus:outline-none text-xs sm:text-sm"
              />
              <button 
                type="submit" 
                className="bg-[#0B2B1B] text-white px-4 sm:px-6 py-3 font-medium text-[10px] sm:text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all"
              >
                Search
              </button>
            </form>

            {/* Slogan Text */}
            <h1 className="text-white font-serif text-lg sm:text-2xl md:text-4xl tracking-wide font-extrabold drop-shadow-md text-center px-2 max-w-full break-words">
              It's not relaxation, it's Railaxation
            </h1>

          </div>
        </section>

        {/* THREE CATEGORIES GRID */}
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

        {/* THE RAILAXATION STORY */}
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