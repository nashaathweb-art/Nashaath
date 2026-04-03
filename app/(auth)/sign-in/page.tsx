"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignIn = async () => {
    if (!phone.trim() || !password.trim()) {
      setError("Please enter both phone number and password.");
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    setError("");
    const fakeEmail = `${phone.trim()}@student.com`;
    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });
    if (error) {
      setError("Invalid phone number or password. Please try again.");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Georgia','Times New Roman',serif", display: "flex", flexDirection: "column" }}>

      {/* Top strip */}
      <div style={{ height: "4px", background: "linear-gradient(90deg,#B45309,#6D28D9,#1D4ED8,#047857,#BE123C,#92400E)" }} />

      {/* Center card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ background: "#FFFFFF", border: "1.5px solid #EDE8E0", borderRadius: "6px", width: "100%", maxWidth: "400px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Card top strip */}
          <div style={{ height: "4px", background: "#B45309" }} />

          <div style={{ padding: "40px 36px" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "24px", color: "#B45309", marginBottom: "12px" }}>✦</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#B45309", border: "1px solid #FDE68A", background: "#FFFBF0", padding: "4px 16px", borderRadius: "2px", display: "inline-block", marginBottom: "16px" }}>
                Student Portal
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: 400, color: "#1A1208", margin: 0, letterSpacing: "-0.01em" }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: "13px", color: "#A8A29E", marginTop: "8px", fontStyle: "italic" }}>
                Sign in with your phone number & password
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "4px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "#BE123C", fontStyle: "italic" }}>
                ✦ {error}
              </div>
            )}

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#78716C", display: "block", marginBottom: "6px" }}>
                Phone Number
              </label>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #EDE8E0", borderRadius: "2px", background: "#FAFAF8", overflow: "hidden" }}>
                <span style={{ padding: "10px 12px", fontSize: "14px", color: "#78716C", borderRight: "1.5px solid #EDE8E0", background: "#F5F0E8", fontFamily: "Georgia,serif" }}>
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  style={{ flex: 1, padding: "10px 14px", border: "none", fontSize: "14px", fontFamily: "Georgia,serif", color: "#1A1208", background: "transparent", outline: "none" }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#78716C", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #EDE8E0", borderRadius: "2px", fontSize: "14px", fontFamily: "Georgia,serif", color: "#1A1208", background: "#FAFAF8", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: loading ? "#D6C9A8" : "#B45309", border: "none", color: "#FFFFFF", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: "2px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Georgia,serif" }}>
              {loading ? "Signing In…" : "Sign In"}
            </button>

            {/* Help */}
            <p style={{ textAlign: "center", fontSize: "12px", color: "#A8A29E", marginTop: "24px", fontStyle: "italic" }}>
              Don't have credentials? &nbsp;
              <a href="/#contact" style={{ color: "#B45309", textDecoration: "none" }}>Contact us</a>
            </p>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px 24px", borderTop: "1px solid #EDE8E0", background: "#FFFFFF", color: "#C4B89A", fontSize: "12px", letterSpacing: "0.15em" }}>
        ✦ Craft Your Future — One Stitch at a Time ✦
      </footer>

    </div>
  );
}