"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

// 10 Core Railaxation Fragrance Variants shared across your line
const RAILAXATION_SCENTS = [
  "Strawberry", "Lavender", "Eucalyptus", "Lime", "Lemongrass", 
  "Sweet Orange", "Ylang Ylang", "Sandalwood", "Jasmine", "Grapefruit"
];

// All 15 distinct products organized meticulously from Low-to-High Price
const PRODUCTS = [
  { 
    id: 1, 
    name: "Railaxation Heart Soap", 
    price: 4.50, 
    category: "soaps", 
    img: "/heartsoap.jpg", 
    description: "A beautifully molded heart-shaped single soap bar, designed to enrich skin texture with a soothing calm.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/heart-strawberry.PNG",
      "Lavender": "/heart-lavender.PNG"
    }
  },
  { 
    id: 2, 
    name: "Railaxation Large Cube Soap", 
    price: 4.50, 
    category: "soaps", 
    img: "/cubesoap.jpg",
    description: "A substantial, minimalist hand-poured block soap crafted to offer a luxury creamy lather.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 3, 
    name: "Railaxation Car Soap", 
    price: 5.00, 
    category: "soaps", 
    img: "/carsoap.jpg",
    description: "A wonderfully detailed novelty car soap layout. Makes standard handwashing fun for all ages.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 4, 
    name: "Pack of 3 Railaxation Glam Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/3handsoap.jpg",
    description: "A delicate triple-set collection of meticulously blended skin-loving handsoaps.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 5, 
    name: "Pack of 3 Railaxation Star Shaped Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/3starhandsoap.jpg",
    description: "Three handcrafted star-shaped decorative soaps that deliver comforting aromatic bubbles.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 6, 
    name: "Railaxation Cubed Pack of 2 Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/cubedhandsoap.PNG",
    description: "Two matching geo-cubed soap items bundled in an elegant display profile.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 7, 
    name: "Railaxation Wax Melts (Pack of 4)", 
    price: 5.00, 
    category: "candles", 
    img: "/candles.PNG",
    description: "A pack of 4 break-apart highly scented premium wax sections designed for long lasting indoor calm.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 8, 
    name: "Railaxation Botanical Rose Soap", 
    price: 6.00, 
    category: "soaps", 
    img: "/rosesoap.jpg",
    description: "Gently cleansing artisan soap bars infused with elegant petal contours for sensitive skin.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 9, 
    name: "Railaxation 8oz Premium Candle Tin", 
    price: 15.00, 
    category: "candles", 
    img: "/candles.PNG", 
    description: "Our signature 8oz slow-burn hand-poured candle tin, built with scientific precision to maximize aroma distribution.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/candle-strawberry.PNG",
      "Lavender": "/candle-lavender.PNG",
      "Eucalyptus": "/candle-eucalyptus.PNG",
      "Lime": "/candle-lime.PNG",
      "Lemongrass": "/candle-lemongrass.PNG",
      "Sweet Orange": "/candle-orange.PNG",
      "Ylang Ylang": "/candle-ylang.PNG",
      "Sandalwood": "/candle-sandalwood.PNG",
      "Jasmine": "/candle-jasmine.PNG",
      "Grapefruit": "/candle-grapefruit.PNG"
    }
  },
  { 
    id: 10, 
    name: "Railaxation Kids Box - Girls", 
    price: 15.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "A vibrant custom grooming box curated for young minds to enjoy a quiet, calming luxury bubble routine.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 11, 
    name: "Railaxation Kids Box - Boys", 
    price: 15.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "A fun-filled self-care box designed specifically to make comfort time exciting and refreshing for boys.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 12, 
    name: "Railaxation Women's Standard Box", 
    price: 35.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "A beautifully bundled sanctuary gift set packed with premium essentials to upgrade your wellness needs.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 13, 
    name: "Railaxation Men's Standard Box", 
    price: 35.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "A tailored grooming and relaxation box containing robust, deeply comforting self-care essentials.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 14, 
    name: "Railaxation Women's Premium Box", 
    price: 40.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "Our ultra-luxury extended collection package, packed with extra items for the ultimate home spa ritual.",
    scents: RAILAXATION_SCENTS
  },
  { 
    id: 15, 
    name: "Railaxation Men's Premium Box", 
    price: 45.00, 
    category: "boxes", 
    img: "/webim.PNG",
    description: "The peak collection tier for men. An extensive package of premium products for deep body care and focus.",
    scents: RAILAXATION_SCENTS
  }
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const currentCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [chosenScent, setChosenScent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  // BROAD PHRASE MATCHING SYSTEM
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = currentCategory === "all" || product.category === currentCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const rawQuery = searchQuery.toLowerCase().trim();
    const name = product.name.toLowerCase();
    const desc = product.description.toLowerCase();
    const cat = product.category.toLowerCase();

    if (name.includes(rawQuery) || desc.includes(rawQuery) || cat.includes(rawQuery)) {
      return true;
    }

    if (rawQuery.includes("box") || rawQuery.includes("hamper")) {
      if (cat === "boxes") return true;
    }
    if (rawQuery.includes("candle") || rawQuery.includes("melt") || rawQuery.includes("tin")) {
      if (cat === "candles") return true;
    }
    if (rawQuery.includes("soap")) {
      if (cat === "soaps") return true;
    }

    const searchWords = rawQuery.split(/\s+/);
    return searchWords.every((word) => {
      let baseWord = word;
      if (word.endsWith("s") && word.length > 3) baseWord = word.slice(0, -1);
      if (word.endsWith("es") && word.length > 4) baseWord = word.slice(0, -2);

      return (
        name.includes(word) || name.includes(baseWord) ||
        desc.includes(word) || desc.includes(baseWord) ||
        cat.includes(word) || cat.includes(baseWord) ||
        ((word === "melt" || word === "melts" || word === "tin") && cat === "candles") ||
        ((word === "hamper" || word === "hampers") && cat === "boxes")
      );
    });
  });

  const openModal = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct(product);
    setChosenScent(product.scents[0] || "Strawberry");
    setQuantity(1);
  };

  const handleAddToBasket = () => {
    if (!selectedProduct) return;

    // Trigger context global cart add
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      img: selectedProduct.img,
      scent: chosenScent,
      quantity: quantity
    });

    setSelectedProduct(null);
    router.push("/cart");
  };

  const displayImage = selectedProduct 
    ? (selectedProduct as any).scentImages?.[chosenScent] || selectedProduct.img 
    : "/webim.PNG";

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans relative">
      
      {/* BRAND NAVIGATION HEADER */}
      <header className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-200 bg-white">
        <nav className="flex gap-6 text-sm tracking-wide font-medium">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/shop" className="text-[#D4AF37] font-semibold">Railaxation Shop</Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About / Contact</Link>
          <Link href="/cart" className="hover:text-[#D4AF37] transition-colors font-semibold">View Basket</Link>
        </nav>
        
        <span className="font-serif text-lg tracking-[0.2em] font-bold">RAILAXATION</span>

        {/* HEADER SEARCH INPUT */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search Railaxation..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-full px-4 py-2 text-[#0B2B1B] focus:outline-none focus:border-[#0B2B1B]"
          />
          {searchInput && (
            <button 
              type="button" 
              onClick={() => { setSearchInput(""); router.push("/shop"); }} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs"
            >
              ✕
            </button>
          )}
        </form>
      </header>

      {/* SHOP GRID CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl capitalize tracking-wide mb-2">
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : currentCategory === "all" ? "Our Whole Collection" : currentCategory === "boxes" ? "Railaxation Boxes" : `Railaxation ${currentCategory}`}
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            Meticulously handcrafted 1-by-1 in Birmingham.
          </p>
        </div>

        {/* DESKTOP FILTER BAR TABS */}
        <div className="flex justify-center gap-4 mb-12 border-b border-zinc-200 pb-4 text-sm tracking-wide">
          {[
            { tag: "all", label: "All Items" },
            { tag: "candles", label: "Railaxation Candles & Melts" },
            { tag: "soaps", label: "Railaxation Soaps" },
            { tag: "boxes", label: "Railaxation Boxes" }
          ].map((tab) => (
            <Link
              key={tab.tag}
              href={tab.tag === "all" ? "/shop" : `/shop?category=${tab.tag}`}
              className={`px-4 py-2 transition-all ${
                currentCategory === tab.tag && !searchQuery ? "border-b-2 border-[#0B2B1B] font-bold" : "text-zinc-400 hover:text-zinc-800"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* PRODUCTS CARDS RENDER */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-zinc-400 font-light">
            No Railaxation products found matching your selections.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-zinc-100 p-4">
                <div className="relative w-full h-72 rounded-md overflow-hidden mb-4 bg-zinc-50">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    sizes="(max-w-7xl) 33vw, 400px"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
                  <span className="font-medium text-zinc-700">£{product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => openModal(product)}
                    className="bg-[#0B2B1B] text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium hover:bg-opacity-90 transition-all"
                  >
                    View Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QUICK VIEW POPUP BOX MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="absolute inset-0" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row shadow-2xl border border-zinc-100">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 font-bold z-20 text-lg"
            >
              ✕
            </button>

            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[320px] bg-zinc-50">
              <Image 
                src={displayImage} 
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                {selectedProduct.category === "boxes" ? "Railaxation Boxes" : `Railaxation ${selectedProduct.category}`}
              </span>
              <h2 className="font-serif text-2xl mb-2">{selectedProduct.name}</h2>
              <p className="text-zinc-500 text-xs font-light mb-4 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="text-xl font-semibold mb-4 text-[#0B2B1B]">
                £{(selectedProduct.price * quantity).toFixed(2)}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1">Select Fragrance / Scent</label>
                  <select 
                    value={chosenScent}
                    onChange={(e) => setChosenScent(e.target.value)}
                    className="w-full border border-zinc-200 bg-white rounded-md p-2 text-sm focus:outline-none focus:border-[#0B2B1B]"
                  >
                    {selectedProduct.scents.map((scent) => (
                      <option key={scent} value={scent}>{scent}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddToBasket}
                className="w-full mt-auto bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center p-24 font-serif text-xl">Loading Sanctuary Collections...</div>}>
      <ShopContent />
    </Suspense>
  );
}