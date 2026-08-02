"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define your authorized admin email addresses
const ADMIN_EMAILS = [
  "railaxation@gmail.com", // Replace with your actual Railaxation email
  "brumbeeziemusic@gmail.com",
  "ayrgabriel@outlook.com", // Replace with your personal email
];

export default function UnifiedLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Check if the email belongs to an authorized admin
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      // In a real app, you would validate the password against a backend or auth provider here.
      // For this frontend implementation, we check the admin password:
      if (password === "Railaxation2026!") {
        localStorage.setItem("railaxation_admin_auth", "true");
        localStorage.setItem("railaxation_user_email", cleanEmail);
        router.push("/admin"); // Route straight to admin dashboard
        return;
      }
    }

    // If not an admin email, treat them as a standard customer user
    if (password.length >= 6) {
      localStorage.setItem("railaxation_user_auth", "true");
      localStorage.setItem("railaxation_user_email", cleanEmail);
      router.push("/shop"); // Route standard users to the shop/account page
    } else {
      setError("Invalid email or password. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 font-sans">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border border-zinc-100">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Railaxation Portal</span>
          <h1 className="font-serif text-2xl text-[#0B2B1B]">Sign In / Admin</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2B1B] text-[#0B2B1B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2B1B] text-[#0B2B1B]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0B2B1B] text-white py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-opacity-90 transition-all shadow-md"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}