"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBFBFA] text-black">
        <CartProvider>
          {/* AUTOMATED SCROLLING TICKER BANNER */}
          <div className="bg-white border-b border-black py-2 overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-widest text-black">
            <div className="inline-block animate-marquee">
              ✨ SPECIAL ARTISAN DISCOUNTS CURRENTLY ACTIVE ACROSS SELECTED CANDLES & SOAPS — SHOP HANDCRAFTED SELF-CARE TODAY &bull; 
               ✨
            </div>
          </div>

          {/* DYNAMIC NAVBAR COMPONENT */}
          <HeaderNavbar />

          <div className="flex-1 text-black">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

function HeaderNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Railaxation Shop", href: "/shop" },
    { name: "Track Order", href: "/track-order" },
    { name: "About / Contact", href: "/about" },
  ];

  useEffect(() => {
    const customerAuth = localStorage.getItem("railaxation_user_auth");
    const adminAuth = localStorage.getItem("railaxation_admin_auth");

    if (adminAuth) {
      setIsLoggedIn(true);
      setUserRole("admin");
    } else if (customerAuth) {
      setIsLoggedIn(true);
      setUserRole("customer");
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("railaxation_user_auth");
    localStorage.removeItem("railaxation_user_email");
    localStorage.removeItem("railaxation_user_name");
    localStorage.removeItem("railaxation_admin_auth");
    localStorage.removeItem("railaxation_admin_email");

    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/login");
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 flex flex-col gap-3 border-b border-black bg-white md:flex-row md:items-center md:justify-between">
      <nav className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 text-[11px] sm:text-sm tracking-wide font-medium text-black">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-black hover:text-orange-500 transition-colors font-semibold"
          >
            {link.name}
          </Link>
        ))}
        {userRole === "admin" && (
          <Link href="/admin" className="text-orange-600 font-bold hover:underline">Admin Dashboard</Link>
        )}
        {userRole === "customer" && (
          <Link href="/account" className="text-emerald-700 font-bold hover:underline">My Account</Link>
        )}
      </nav>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-[10px] sm:text-xs uppercase tracking-widest font-bold bg-black text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-sm whitespace-nowrap"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-black bg-white border border-black px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:text-orange-500 hover:border-orange-500 transition-all whitespace-nowrap"
          >
            Sign In / Sign Up
          </Link>
        )}
        
        <Link href="/" className="font-serif text-base sm:text-lg tracking-[0.2em] font-bold text-black whitespace-nowrap">
          RAILAXATION
        </Link>
      </div>
    </header>
  );
}