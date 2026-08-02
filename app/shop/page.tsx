"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const RAILAXATION_SCENTS = [
  "Strawberry", "Lavender", "Eucalyptus", "Lime", "Lemongrass", 
  "Sweet Orange", "Ylang Ylang", "Sandalwood", "Jasmine", "Grapefruit"
] as const;

type ScentVariant = typeof RAILAXATION_SCENTS[number];

type AdminVariantRecord = {
  uniqueId?: string;
  id?: number;
  name?: string;
  price?: number;
  category?: string;
  scent?: string;
  inStock?: boolean;
  discounted?: boolean;
  discountPercent?: number;
};

type ShopProduct = typeof PRODUCTS[number] & {
  variantPrices?: Partial<Record<ScentVariant, number>>;
  variantDiscounts?: Partial<Record<ScentVariant, { discounted: boolean; discountPercent: number }>>;
};

const PRODUCTS = [
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
    } as Record<ScentVariant, boolean>,
    description: "A beautifully molded heart-shaped single soap bar, designed to enrich skin texture with a soothing calm.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redheart.PNG", "Lavender": "/purpleheart.PNG", "Eucalyptus": "/blueheart.PNG",
      "Lime": "/greenheart.PNG", "Lemongrass": "/yellowheartsoap.jpg", "Sweet Orange": "/orangeheart.PNG",
      "Ylang Ylang": "/blackheart.PNG", "Sandalwood": "/transheart.PNG", "Jasmine": "/lilacheart.PNG",
      "Grapefruit": "/pinkheart.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A substantial, minimalist hand-poured block soap crafted to offer a luxury creamy lather.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redcube.PNG", "Lavender": "/purplecube.PNG", "Eucalyptus": "/bluecube.PNG",
      "Lime": "/greencube.PNG", "Lemongrass": "/yellowcube.PNG", "Sweet Orange": "/cubesoap.jpg",
      "Ylang Ylang": "/blackcube.PNG", "Sandalwood": "/transcube.PNG", "Jasmine": "/lilacube.PNG",
      "Grapefruit": "/pinkcube.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A wonderfully detailed novelty car soap layout. Makes standard handwashing fun for all ages.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redcar.jpg", "Lavender": "/purplecar.PNG", "Eucalyptus": "/bluecar.PNG",
      "Lime": "/greencar.PNG", "Lemongrass": "/yellowcar.PNG", "Sweet Orange": "/orangecar.PNG",
      "Ylang Ylang": "/blackcar.PNG", "Sandalwood": "/transcar.PNG", "Jasmine": "/lightpurplecar.PNG",
      "Grapefruit": "/pinkcar.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A delicate triple-set collection of meticulously blended skin-loving handsoaps.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/red3pcs.PNG", "Lavender": "/purple3pcs.PNG", "Eucalyptus": "/blue3pcs.PNG",
      "Lime": "/green3pcs.PNG", "Lemongrass": "/3Handsoap.jpg", "Sweet Orange": "/orange3pcs.PNG",
      "Ylang Ylang": "/black3pcs.PNG", "Sandalwood": "/trans3pc.PNG", "Jasmine": "/lilac3pcs.PNG",
      "Grapefruit": "/pink3pcs.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "Three handcrafted star-shaped decorative soaps that deliver comforting aromatic bubbles.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redstars.PNG", "Lavender": "/purplestars.PNG", "Eucalyptus": "/bluestars.PNG",
      "Lime": "/greenstars.PNG", "Lemongrass": "/yellowstars.PNG", "Sweet Orange": "/orangestars.PNG",
      "Ylang Ylang": "/blackstars.PNG", "Sandalwood": "/transstars.jpg", "Jasmine": "/lilacstars.PNG",
      "Grapefruit": "/pinkstars.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "Two matching geo-cubed soap items bundled in an elegant display profile.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/red2cubey.PNG", "Lavender": "/purple2cubey.PNG", "Eucalyptus": "/cubedhandsoap.PNG",
      "Lime": "/green2cubey.PNG", "Lemongrass": "/yellow2cubey.PNG", "Sweet Orange": "/orange2cubey.PNG",
      "Ylang Ylang": "/black2cubey.PNG", "Sandalwood": "/trans2cubey.PNG", "Jasmine": "/lilac2cubey.PNG",
      "Grapefruit": "/pink2cubey.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A pack of 4 break-apart highly scented premium wax sections designed for long lasting indoor calm.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redmelts.PNG", "Lavender": "/purplemelts.PNG", "Eucalyptus": "/bluemelts.PNG",
      "Lime": "/greenmelts.PNG", "Lemongrass": "/yellowmelts.PNG", "Sweet Orange": "/orangemelts.PNG",
      "Ylang Ylang": "/blackmelts.PNG", "Sandalwood": "/transmelts.PNG", "Jasmine": "/lilacmelts.PNG",
      "Grapefruit": "/pinkmelts.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "An adorable pair of handcrafted bear-shaped soaps that bring rich moisture and charming aesthetic to your sink.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redbear.PNG", "Lavender": "/2purplebears.PNG", "Eucalyptus": "/blueybear.PNG",
      "Lime": "/greenbear.PNG", "Lemongrass": "/yellowbear.PNG", "Sweet Orange": "/orangebear.PNG",
      "Ylang Ylang": "/blackbear.PNG", "Sandalwood": "/transbear.PNG", "Jasmine": "/lilacbear.PNG",
      "Grapefruit": "/pinkbear.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "Gently cleansing artisan soap bars infused with elegant petal contours for sensitive skin.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redroseysoap.PNG", "Lavender": "/purplerose.PNG", "Eucalyptus": "/bluerose.PNG",
      "Lime": "/greenrose.PNG", "Lemongrass": "/yellowrose.PNG", "Sweet Orange": "/orangerose.PNG",
      "Ylang Ylang": "/blackrose.PNG", "Sandalwood": "/transrose.PNG", "Jasmine": "/lilacrose.PNG",
      "Grapefruit": "/rosesoap.jpg"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "Our signature 8oz slow-burn hand-poured candle tin, built with scientific precision to maximize aroma distribution.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/redcandle.PNG", "Lavender": "/purplecandle.PNG", "Eucalyptus": "/bluecandle.PNG",
      "Lime": "/greencandle.PNG", "Lemongrass": "/yellowcandle.PNG", "Sweet Orange": "/orangecandle.PNG",
      "Ylang Ylang": "/blackcandle.PNG", "Sandalwood": "/transcandle.PNG", "Jasmine": "/lilaccandle.PNG",
      "Grapefruit": "/pinkcandle.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A vibrant custom grooming box curated for young minds to enjoy a quiet, calming luxury bubble routine.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A fun-filled self-care box designed specifically to make comfort time exciting and refreshing for boys.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A beautifully bundled sanctuary gift set packed with premium essentials to upgrade your wellness needs.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "A tailored grooming and relaxation box containing robust, deeply comforting self-care essentials.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "Our ultra-luxury extended collection package, packed with extra items for the ultimate home spa ritual.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
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
    } as Record<ScentVariant, boolean>,
    description: "The peak collection tier for men. An extensive package of premium products for deep body care and focus.",
    scents: RAILAXATION_SCENTS,
    scentImages: {
      "Strawberry": "/comingsoon.PNG", "Lavender": "/comingsoon.PNG", "Eucalyptus": "/comingsoon.PNG",
      "Lime": "/comingsoon.PNG", "Lemongrass": "/comingsoon.PNG", "Sweet Orange": "/comingsoon.PNG",
      "Ylang Ylang": "/comingsoon.PNG", "Sandalwood": "/comingsoon.PNG", "Jasmine": "/comingsoon.PNG", "Grapefruit": "/comingsoon.PNG"
    } as Record<ScentVariant, string>
  }
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const currentCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  const [productsList, setProductsList] = useState<ShopProduct[]>(() => {
    return PRODUCTS as ShopProduct[];
  });

  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [chosenScent, setChosenScent] = useState<ScentVariant>("Strawberry");
  const [quantity, setQuantity] = useState(1);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const getDisplayPrice = (product: ShopProduct, scent: ScentVariant) => {
    const variantPrice = product.variantPrices?.[scent] ?? product.price;
    const discountState = product.variantDiscounts?.[scent];

    if (!discountState?.discounted) {
      return Number(variantPrice.toFixed(2));
    }

    const discountPercent = Math.max(0, Math.min(100, discountState.discountPercent || 0));
    return Number((variantPrice * (1 - discountPercent / 100)).toFixed(2));
  };

  const getVariantPriceLookup = (product: ShopProduct) => {
    const prices: Partial<Record<ScentVariant, number>> = {};

    product.scents.forEach((scent) => {
      prices[scent as ScentVariant] = getDisplayPrice(product, scent as ScentVariant);
    });

    return prices;
  };

 const loadInventory = () => {
  try {
    const savedAdminVariants = localStorage.getItem("railaxation_admin_variants");

    if (!savedAdminVariants) {
      setProductsList(PRODUCTS as ShopProduct[]);
      return;
    }

    const parsedAdminVariants = JSON.parse(savedAdminVariants);
    const variantList = Array.isArray(parsedAdminVariants) ? parsedAdminVariants : [];

    const updated = PRODUCTS.map((prod) => {
      const matchingVariants = variantList.filter((variant: AdminVariantRecord) => {
        if (typeof variant.uniqueId === "string") {
          return variant.uniqueId.startsWith(`${prod.id}-`);
        }

        return Number(variant.id) === Number(prod.id);
      });

      const stockPerScent = { ...prod.stockPerScent } as Record<ScentVariant, boolean>;
      const variantPrices: Partial<Record<ScentVariant, number>> = {};
      const variantDiscounts: Partial<Record<ScentVariant, { discounted: boolean; discountPercent: number }>> = {};

      prod.scents.forEach((scent) => {
        const variant = matchingVariants.find((item: AdminVariantRecord) => {
          if (typeof item.uniqueId === "string") {
            return item.uniqueId === `${prod.id}-${scent}`;
          }

          return item.scent === scent;
        });

        if (!variant) return;

        const scentKey = scent as ScentVariant;
        const isVariantInStock = variant.inStock !== false;
        stockPerScent[scentKey] = isVariantInStock;

        if (typeof variant.price === "number") {
          variantPrices[scentKey] = Number(variant.price.toFixed(2));
        }

        variantDiscounts[scentKey] = {
          discounted: Boolean(variant.discounted),
          discountPercent: Math.max(0, Math.min(100, Number(variant.discountPercent || 0)))
        };
      });

      return {
        ...prod,
        inStock: Object.values(stockPerScent).some((value) => value),
        price: (matchingVariants[0]?.price ?? prod.price) as number,
        stockPerScent,
        variantPrices: Object.keys(variantPrices).length ? variantPrices : undefined,
        variantDiscounts: Object.keys(variantDiscounts).length ? variantDiscounts : undefined,
      } as ShopProduct;
    });

    setProductsList(updated);

  } catch (error) {
    console.error("Inventory loading failed:", error);
    setProductsList(PRODUCTS as ShopProduct[]);
  }
};

  useEffect(() => {
    loadInventory();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "railaxation_admin_variants") {
        loadInventory();
      }
    };

    const handleFocus = () => {
      loadInventory();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("railaxation_inventory_updated", loadInventory as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("railaxation_inventory_updated", loadInventory as EventListener);
    };
  }, []);

  useEffect(() => {
  if (!selectedProduct) return;

  const currentLiveProduct = productsList.find(
    (p) => p.id === selectedProduct.id
  );

  if (currentLiveProduct) {
    setSelectedProduct(currentLiveProduct);
  }
}, [productsList]);

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

  const filteredProducts = productsList.filter((product) => {
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
        cat.includes(word) || cat.includes(baseWord)
      );
    });
  });

  const openModal = (product: ShopProduct) => {
    const liveProduct = productsList.find((p) => p.id === product.id) || product;
    setSelectedProduct(liveProduct);
    
    const firstAvailableScent = liveProduct.scents.find((scent: string) => liveProduct.stockPerScent?.[scent as ScentVariant] !== false) || liveProduct.scents[0] || "Strawberry";
    setChosenScent(firstAvailableScent as ScentVariant);
    setQuantity(1);
  };

  const isCompletelySoldOut = (product: ShopProduct) => {
  if (product.inStock === false) return true;

  if (product.stockPerScent) {
    const available = Object.values(product.stockPerScent).some(
      (value) => value === true
    );

    return !available;
  }

  return false;
};

  const isCurrentVariantSoldOut = selectedProduct 
    ? selectedProduct.inStock === false || selectedProduct.stockPerScent?.[chosenScent as ScentVariant] === false 
    : false;

  const handleAddToBasket = () => {
    if (!selectedProduct || isCurrentVariantSoldOut) return;

    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: getDisplayPrice(selectedProduct, chosenScent),
      img: displayImage,
      scent: chosenScent,
      quantity: quantity
    });

    setSelectedProduct(null);
    router.push("/cart");
  };

  const displayImage = selectedProduct 
    ? (selectedProduct.scentImages?.[chosenScent as ScentVariant] || selectedProduct.img || "/webim.PNG")
    : "/webim.PNG";

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B2B1B] font-sans relative">
      
      {/* BRAND NAVIGATION HEADER */}
      

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
            {filteredProducts.map((product) => {
              const soldOut = isCompletelySoldOut(product);

              return (
                <div key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-zinc-100 p-4">
                  <div className="relative w-full h-72 rounded-md overflow-hidden mb-4 bg-zinc-50">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      sizes="(max-w-7xl) 33vw, 400px"
                      className={`object-cover transition-transform duration-300 ${soldOut ? "opacity-50 grayscale" : "group-hover:scale-[1.03]"}`}
                    />
                    {soldOut && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow z-10">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
                    <span className="font-medium text-zinc-700">£{getDisplayPrice(product, product.scents[0] as ScentVariant).toFixed(2)}</span>
                    <button 
                      onClick={() => openModal(product)}
                      className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all bg-[#0B2B1B] text-white hover:bg-opacity-90 cursor-pointer"
                    >
                      View Item
                    </button>
                  </div>
                </div>
              );
            })}
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
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 font-bold z-20 text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[320px] bg-zinc-50">
              <Image 
                src={displayImage} 
                alt={selectedProduct.name}
                fill
                className={`object-cover ${isCurrentVariantSoldOut ? "grayscale opacity-60" : ""}`}
              />
              {isCurrentVariantSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                  <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                    Variant Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                {selectedProduct.category === "boxes" ? "Railaxation Boxes" : `Railaxation ${selectedProduct.category}`}
              </span>
              <h2 className="font-serif text-2xl mb-2">{selectedProduct.name}</h2>
              <p className="text-zinc-500 text-xs font-light mb-4 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="text-xl font-semibold mb-4 text-[#0B2B1B]">
                £{(getDisplayPrice(selectedProduct, chosenScent) * quantity).toFixed(2)}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1">Select Fragrance / Scent</label>
                  <select 
                    value={chosenScent}
                    onChange={(e) => setChosenScent(e.target.value as ScentVariant)}
                    className="w-full border border-zinc-200 bg-white rounded-md p-2 text-sm focus:outline-none focus:border-[#0B2B1B]"
                  >
                    {selectedProduct.scents.map((scent: string) => {
                      const isVariantOut = selectedProduct.inStock === false || selectedProduct.stockPerScent?.[scent as ScentVariant] === false;
                      return (
                        <option key={scent} value={scent}>
                          {scent} {isVariantOut ? "(Sold Out)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isCurrentVariantSoldOut}
                      className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-sm disabled:opacity-50 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isCurrentVariantSoldOut}
                      className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center hover:bg-zinc-50 text-sm disabled:opacity-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddToBasket}
                disabled={isCurrentVariantSoldOut}
                className={`w-full mt-auto py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-all shadow-md ${
                  !isCurrentVariantSoldOut
                    ? "bg-[#0B2B1B] text-white hover:bg-opacity-90 cursor-pointer"
                    : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                }`}
              >
                {!isCurrentVariantSoldOut ? "Add to Cart" : "Selected Scent Sold Out"}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] text-[#0B2B1B] text-sm">Loading Railaxation Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}