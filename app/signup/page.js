"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const GOLD = "#8EB69B";
  const BG = "#051F20";
  const CARD = "#0B2B26";
  const BORDER = "#235347";
  const LIGHT = "#DAF1DE";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("sanyaaUser", JSON.stringify(data.user));
      window.location.href = "/";
    } else {
      setMessage(data.error);
    }
    setLoading(false);
  };

  const inputStyle = {
    padding: "14px",
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    color: LIGHT,
    background: CARD,
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif", padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <p style={{ color: GOLD, fontSize: "40px", textAlign: "center", margin: "0 0 6px 0", fontFamily: "'Dancing Script', cursive" }}>
        Sanyaa
      </p>
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: LIGHT, textAlign: "center", margin: "0 0 6px 0", fontFamily: "Georgia, serif" }}>
        Sign Up
      </h1>
      <p style={{ fontSize: "13px", color: "#a8c9bd", textAlign: "center", margin: "0 0 30px 0" }}>
        Create an account to get started
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "360px", width: "100%", margin: "0 auto" }}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={inputStyle} />

        {message && <p style={{ color: "#e57373", fontSize: "13px", margin: 0 }}>{message}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "15px",
            background: GOLD,
            color: "#051F20",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            marginTop: "8px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#a8c9bd", marginTop: "10px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: GOLD, fontWeight: "600", textDecoration: "none" }}>
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
