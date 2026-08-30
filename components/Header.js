"use client";

export default function Header() {
  return (
    <div>
      <div style={{ background: "#2b1d14", color: "#e9dfd0", textAlign: "center", padding: "8px", fontSize: "12px", letterSpacing: "0.5px" }}>
        Enjoy 20% off on your first purchase &amp; Free Shipping on Orders Over ₹999
      </div>

      <header
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e8ded0",
          background: "#fffaf3",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", margin: 0, color: "#2b1d14", fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
            SANYAA
          </h1>
        </a>

        <nav style={{ display: "flex", gap: "22px", alignItems: "center" }}>
          <a href="/" style={{ color: "#2b1d14", textDecoration: "none", fontSize: "13px", fontWeight: "500", letterSpacing: "0.5px" }}>
            HOME
          </a>
          <a href="/#products" style={{ color: "#2b1d14", textDecoration: "none", fontSize: "13px", fontWeight: "500", letterSpacing: "0.5px" }}>
            SHOP
          </a>
          <a href="/cart" style={{ color: "#2b1d14", textDecoration: "none", fontSize: "13px", fontWeight: "500", letterSpacing: "0.5px" }}>
            CART
          </a>
        </nav>
      </header>
    </div>
  );
}
