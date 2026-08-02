"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Save user credentials as staff account
    const existingUsers = JSON.parse(localStorage.getItem("railaxation_users") || "[]");
    existingUsers.push({ email: "staff@railaxation.com", password, role: "staff" });
    localStorage.setItem("railaxation_users", JSON.stringify(existingUsers));

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 font-sans text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border border-black">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-black font-bold">Staff Onboarding</span>
          <h1 className="font-serif text-2xl text-black">Set Your Password</h1>
        </div>

        {error && (
          <div className="p-3 bg-white border border-black text-black text-xs rounded-xl">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-white border border-black text-black text-xs rounded-xl text-center font-bold">
            Password successfully set! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div>
              <label className="block text-xs uppercase tracking-wider text-black mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-black mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
            >
              Complete Account Setup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-black font-sans">Loading invitation...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}