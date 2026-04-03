"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@stitching.com"; // change this to your admin email

export default function AdminSignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignIn = async () => {
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error) {
      setError("Invalid password. Please try again.");
    } else if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError("You are not authorized to access this panel.");
    } else {
      router.push("/admindashboard");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1208", fontFamily: "'Georgia','Times New Roman',serif", display: "flex", flexDirection: "column" }}>

      {/* Top strip */}
      <div style={{ height: "4px", background: "linear-gradient(90deg,#B45309,#6D28D9,#1D4ED8,#047857,#BE123C,#92400E)" }} />

      {/* Center card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ background: "#FFFFFF", border: "1.5px solid #EDE8E0", borderRadius: "6px", width: "100%", maxWidth: "380px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>

          {/* Card top strip */}
          <div style={{ height: "4px", background: "#B45309" }} />

          <div style={{ padding: "40px 36px" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "24px", color: "#B45309", marginBottom: "12px" }}>✦</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#B45309", border: "1px solid #FDE68A", background: "#FFFBF0", padding: "4px 16px", borderRadius: "2px", display: "inline-block", marginBottom: "16px" }}>
                Admin Panel
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: 400, color: "#1A1208", margin: 0, letterSpacing: "-0.01em" }}>
                Admin Access
              </h1>
              <p style={{ fontSize: "13px", color: "#A8A29E", marginTop: "8px", fontStyle: "italic" }}>
                Restricted to authorized personnel only
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "4px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "#BE123C", fontStyle: "italic" }}>
                ✦ {error}
              </div>
            )}

            {/* Password only — admin email is hardcoded */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#78716C", display: "block", marginBottom: "6px" }}>
                Admin Password
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
              {loading ? "Verifying…" : "Enter Admin Panel"}
            </button>

            {/* Back to site */}
            <p style={{ textAlign: "center", fontSize: "12px", color: "#A8A29E", marginTop: "24px", fontStyle: "italic" }}>
              <a href="/" style={{ color: "#B45309", textDecoration: "none" }}>← Back to Website</a>
            </p>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px 24px", borderTop: "1px solid #2A1F0F", color: "#57534E", fontSize: "12px", letterSpacing: "0.15em" }}>
        ✦ Admin Panel — Stitching Excellence ✦
      </footer>

    </div>
  );
}