import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";

const AuthSystem = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      {/* Ambient orbs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-950 opacity-40 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-blue-950 opacity-40 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-950 opacity-30 blur-[80px] pointer-events-none" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 backdrop-blur-xl overflow-hidden">

          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(160,120,255,0.6), rgba(80,160,255,0.6), transparent)",
            }}
          />

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/15" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/15" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/15" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/15" />

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-white/90 text-xl tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              Emaily
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-white text-[34px] leading-tight mb-1.5 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            {isLogin ? "Welcome back." : "Create your account."}
          </h1>
          <p
            className="text-white/35 text-[11px] uppercase tracking-[0.12em] mb-8 flex items-center gap-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {isLogin ? "Sign in to continue" : "Join the platform"}
          </p>

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 bg-red-500/[0.08] border border-red-500/25 rounded-xl text-red-400 text-xs leading-relaxed tracking-wide"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — slides in for register */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-1">
                <label
                  className="block text-[10px] uppercase tracking-[0.15em] text-white/35 mb-2"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  tabIndex={isLogin ? -1 : 0}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[13px] tracking-wide placeholder-white/20 outline-none focus:bg-white/[0.06] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all duration-200"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[10px] uppercase tracking-[0.15em] text-white/35 mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[13px] tracking-wide placeholder-white/20 outline-none focus:bg-white/[0.06] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all duration-200"
                style={{ fontFamily: "'DM Mono', monospace" }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[10px] uppercase tracking-[0.15em] text-white/35 mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[13px] tracking-wide placeholder-white/20 outline-none focus:bg-white/[0.06] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all duration-200"
                style={{ fontFamily: "'DM Mono', monospace" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-1 rounded-xl text-[11px] uppercase tracking-[0.15em] font-normal transition-all duration-200 ${
                loading
                  ? "bg-white/[0.07] text-white/25 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.45)] active:translate-y-0"
              }`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span
              className="text-[10px] uppercase tracking-[0.12em] text-white/20"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              or
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Google Login — original handler preserved */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/google`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      credential: credentialResponse.credential,
                    }),
                  },
                );

                const data = await res.json();

                if (res.ok) {
                  localStorage.setItem("token", data.token);
                  onLogin();
                }
              }}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </div>

          {/* Switch mode */}
          <div
            className="mt-6 text-center text-[11px] text-white/25 tracking-wide"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {isLogin ? "New here?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className="ml-1.5 text-violet-400/90 hover:text-violet-300 hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer text-[11px]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthSystem;