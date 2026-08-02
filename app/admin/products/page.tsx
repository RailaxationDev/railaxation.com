"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const RAILAXATION_SCENTS = [
  "Strawberry", "Lavender", "Eucalyptus", "Lime", "Lemongrass", 
  "Sweet Orange", "Ylang Ylang", "Sandalwood", "Jasmine", "Grapefruit"
] as const;

type ScentVariant = typeof RAILAXATION_SCENTS[number];

const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    name: "Railaxation Heart Soap", 
    price: 4.50, 
    category: "soaps", 
    img: "/redheart.PNG", 
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 2, 
    name: "Railaxation Large Cube Soap", 
    price: 4.50, 
    category: "soaps", 
    img: "/cubesoap.jpg",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 3, 
    name: "Railaxation Car Soap", 
    price: 5.00, 
    category: "soaps", 
    img: "/greencar.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 4, 
    name: "Pack of 3 Railaxation Glam Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/pink3pcs.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 5, 
    name: "Pack of 3 Railaxation Star Shaped Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/transstars.jpg",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 6, 
    name: "Railaxation Cubed Pack of 2 Handsoaps", 
    price: 5.00, 
    category: "soaps", 
    img: "/cubedhandsoap.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 7, 
    name: "Railaxation Wax Melts (Pack of 4)", 
    price: 5.00, 
    category: "candles", 
    img: "/bluemelts.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 8, 
    name: "Railaxation Suddy Bear Handsoap (Pack of 2)", 
    price: 6.00, 
    category: "soaps", 
    img: "/yellowbear.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 9, 
    name: "Railaxation Botanical Rose Soap", 
    price: 6.00, 
    category: "soaps", 
    img: "/purplerose.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 10, 
    name: "Railaxation 8oz Premium Candle Tin", 
    price: 15.00, 
    category: "candles", 
    img: "/greencandle.PNG", 
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 11, 
    name: "Railaxation Kids Box - Girls", 
    price: 15.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 12, 
    name: "Railaxation Kids Box - Boys", 
    price: 15.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 13, 
    name: "Railaxation Women's Standard Box", 
    price: 35.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 14, 
    name: "Railaxation Men's Standard Box", 
    price: 35.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 15, 
    name: "Railaxation Women's Premium Box", 
    price: 40.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  },
  { 
    id: 16, 
    name: "Railaxation Men's Premium Box", 
    price: 45.00, 
    category: "boxes", 
    img: "/webim.PNG",
    inStock: true,
    stockPerScent: {
      "Strawberry": true, "Lavender": true, "Eucalyptus": true, "Lime": true, "Lemongrass": true,
      "Sweet Orange": true, "Ylang Ylang": true, "Sandalwood": true, "Jasmine": true, "Grapefruit": true
    } as Record<ScentVariant, boolean>
  }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => {
    if (typeof window === "undefined") return INITIAL_PRODUCTS;
    const saved = localStorage.getItem("railaxation_admin_variants");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_PRODUCTS.map((prod) => {
          const matchingVariants = Array.isArray(parsed)
            ? parsed.filter((item: any) => item.uniqueId?.startsWith(`${prod.id}-`) || Number(item.id) === Number(prod.id))
            : [];

          const stockPerScent = {
            ...prod.stockPerScent,
          } as Record<ScentVariant, boolean>;

          matchingVariants.forEach((variant: any) => {
            const scent = variant.scent as ScentVariant;
            if (scent && typeof variant.inStock === "boolean") {
              stockPerScent[scent] = variant.inStock;
            }
          });

          return {
            ...prod,
            inStock: Object.values(stockPerScent).some((value) => value),
            stockPerScent,
          };
        });
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });
  
  const saveInventory = (updatedProducts: typeof products) => {
    const savedVariants = localStorage.getItem("railaxation_admin_variants");
    const existingVariants = savedVariants ? JSON.parse(savedVariants) : [];

    const inventoryUpdates = updatedProducts.flatMap((product) =>
      RAILAXATION_SCENTS.map((scent) => {
        const uniqueId = `${product.id}-${scent}`;
        const existingVariant = existingVariants.find((variant: any) => variant.uniqueId === uniqueId);

        return {
          ...existingVariant,
          uniqueId,
          name: product.name,
          price: typeof existingVariant?.price === "number" ? existingVariant.price : product.price,
          category: product.category,
          scent,
          inStock: product.stockPerScent?.[scent] ?? product.inStock,
          discounted: typeof existingVariant?.discounted === "boolean" ? existingVariant.discounted : false,
          discountPercent: typeof existingVariant?.discountPercent === "number" ? existingVariant.discountPercent : 0,
        };
      })
    );

    localStorage.setItem(
      "railaxation_admin_variants",
      JSON.stringify(inventoryUpdates)
    );

    window.dispatchEvent(new Event("railaxation_inventory_updated"));
  };
    const toggleMainStock = (id: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          inStock: !p.inStock
        };
      }
      return p;
    });

    setProducts(updated);
    saveInventory(updated);
  };

    const toggleScent = (productId: number, scentName: ScentVariant) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentScents = p.stockPerScent || {};
        const currentStatus = currentScents[scentName] ?? true;

        return {
          ...p,
          stockPerScent: {
            ...currentScents,
            [scentName]: !currentStatus
          }
        };
      }

      return p;
    });

    setProducts(updated);
    saveInventory(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div>
            <h1 className="text-2xl font-serif font-bold">Admin Inventory Management</h1>
            <p className="text-xs text-zinc-500 mt-1">Click buttons below to toggle stock items instantly.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-xs font-semibold px-4 py-2 bg-zinc-100 rounded-lg hover:bg-zinc-200">
              Back to Dashboard
            </Link>
            <Link href="/shop" target="_blank" className="text-xs font-semibold px-4 py-2 bg-[#0B2B1B] text-white rounded-lg hover:opacity-90">
              View Live Shop ↗
            </Link>
          </div>
        </header>

        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200 flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                <Image src={product.img} alt={product.name} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">ID: {product.id} • {product.category}</span>
                    <h3 className="font-serif text-lg font-semibold">{product.name}</h3>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => toggleMainStock(product.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      product.inStock 
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {product.inStock ? "Main Item: In Stock" : "Main Item: Sold Out"}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                    Individual Scent Availability:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {RAILAXATION_SCENTS.map((scent) => {
                      const isScentAvailable = product.stockPerScent?.[scent] ?? true;

                      return (
                        <button
                          key={scent}
                          type="button"
                          onClick={() => toggleScent(product.id, scent)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                            isScentAvailable
                              ? "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400"
                              : "bg-red-600 border-red-600 text-white font-bold"
                          }`}
                        >
                          {scent} {isScentAvailable ? "✓" : "✕ (Sold Out)"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}