"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "railaxation@gmail.com",
  "brumbeeziemusic@gmail.com",
  "ayrgabriel@outlook.com",
];

export default function CustomerAuthPortal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (isResetMode) {
      if (!cleanEmail) {
        setError("Please enter your email address first.");
        return;
      }
      setMessage(`Password reset instructions have been sent to ${cleanEmail}.`);
      setError("");
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      
      const existingUsers = JSON.parse(localStorage.getItem("railaxation_users") || "[]");
      const userExists = existingUsers.some((u: any) => u.email === cleanEmail);

      if (userExists) {
        setError("An account with this email already exists. Please sign in.");
        return;
      }

      const newUser = { name, email: cleanEmail, password };
      existingUsers.push(newUser);
      localStorage.setItem("railaxation_users", JSON.stringify(existingUsers));
      
      localStorage.setItem("railaxation_user_auth", "true");
      localStorage.setItem("railaxation_user_email", cleanEmail);
      localStorage.setItem("railaxation_user_name", name);

      router.push("/account");
      return;
    }

    if (ADMIN_EMAILS.includes(cleanEmail)) {
      const savedCustomAdminPass = localStorage.getItem("railaxation_custom_admin_password");
      const currentAdminPassword = savedCustomAdminPass || "Railaxation2026!";

      if (password === currentAdminPassword) {
        localStorage.setItem("railaxation_admin_auth", "true");
        localStorage.setItem("railaxation_user_email", cleanEmail);
        router.push("/admin");
        return;
      } else {
        setError("Incorrect password for admin account.");
        return;
      }
    }

    const existingUsers = JSON.parse(localStorage.getItem("railaxation_users") || "[]");
    const foundUser = existingUsers.find((u: any) => u.email === cleanEmail && u.password === password);

    if (foundUser) {
      localStorage.setItem("railaxation_user_auth", "true");
      localStorage.setItem("railaxation_user_email", foundUser.email);
      localStorage.setItem("railaxation_user_name", foundUser.name);
      router.push("/account");
    } else {
      setError("Invalid email or password. Please check your details or sign up.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 font-sans text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border border-black">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-black font-bold">Railaxation Portal</span>
          <h1 className="font-serif text-2xl text-black">
            {isResetMode ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
          </h1>
        </div>

        {error && (
          <div className="p-3 bg-white border border-black text-black text-xs rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-white border border-black text-black text-xs rounded-xl">
            {message}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-black">
          <div className="space-y-3">
            {isSignUp && !isResetMode && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-black mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-zinc-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-black mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-zinc-600"
                required
              />
            </div>

            {!isResetMode && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs uppercase tracking-wider text-black">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => { setIsResetMode(true); setError(""); setMessage(""); }}
                      className="text-[11px] text-black font-semibold hover:text-orange-500 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-zinc-600"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
          >
            {isResetMode ? "Send Reset Instructions" : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2 space-y-2 text-xs text-black">
          {isResetMode ? (
            <button
              type="button"
              onClick={() => { setIsResetMode(false); setError(""); setMessage(""); }}
              className="text-black font-semibold hover:text-orange-500 transition-colors"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}