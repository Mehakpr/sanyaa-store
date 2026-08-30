"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const GOLD = "#d4af37";
  const BG = "#0e0c0a";
  const CARD = "#1a1613";
  const BORDER = "#2c261f";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: "#f5f0e8", fontFamily: "Georgia, serif", letterSpacing: "3px" }}>
          SANYAA
        </h1>
        <a href="/cart" style={{ textDecoration: "none", color: GOLD, fontSize: "20px" }}>🛍</a>
      </header>

      {/* Hero */}
      <div style={{ padding: "50px 24px", textAlign: "center" }}>
        <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "10px" }}>
          NEW ARRIVAL
        </p>
        <h2 style={{ fontSize: "30px", fontWeight: "500", color: "#f5f0e8", margin: "0 0 12px 0", fontFamily: "Georgia, serif" }}>
          Timeless Elegance
        </h2>
        <p style={{ color: "#a8a29a", fontSize: "13px", margin: "0 0 24px 0" }}>
          Curated collections, crafted for those who value quality
        </p>
        <a href="#products" style={{ textDecoration: "none" }}>
          <button
            style={{
              background: GOLD,
              color: "#1a1613",
              padding: "13px 32px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "1.5px",
              cursor: "pointer",
            }}
          >
            EXPLORE NOW
          </button>
        </a>
      </div>

      <main id="products" style={{ padding: "20px 20px 50px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            marginBottom: "18px",
            fontSize: "14px",
            boxSizing: "border-box",
            background: CARD,
            color: "#f5f0e8",
          }}
        />

        {/* Categories */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: activeCategory === cat ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                background: activeCategory === cat ? GOLD : "transparent",
                color: activeCategory === cat ? "#1a1613" : "#e8e2d8",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                cursor: "pointer",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#888" }}>Loading products...</p>}
        {!loading && filteredProducts.length === 0 && (
          <p style={{ color: "#888" }}>Koi product nahi mila.</p>
        )}

        {/* Products grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "18px",
          }}
        >
          {filteredProducts.map((product) => {
            const discount =
              product.originalPrice && product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <a key={product._id} href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: CARD,
                    borderRadius: "14px",
                    border: `1px solid ${BORDER}`,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: "100%", height: "190px", background: "#111", position: "relative" }}>
                    <img
                      src={product.images && product.images[0]}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {discount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          background: GOLD,
                          color: "#1a1613",
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "3px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "12px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#f5f0e8", margin: "0 0 6px 0" }}>
                      {product.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: GOLD }}>
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span style={{ fontSize: "11px", color: "#666", textDecoration: "line-through" }}>
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </main>

      {/* Features */}
      <div
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: "30px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "20px",
          textAlign: "center",
        }}
      >
        {[
          { title: "Free Shipping", desc: "On all orders" },
          { title: "24/7 Support", desc: "We're here to help" },
          { title: "Easy Returns", desc: "Hassle free process" },
          { title: "Secure Payment", desc: "100% protected" },
        ].map((f) => (
          <div key={f.title}>
            <h4 style={{ color: GOLD, fontSize: "13px", margin: "0 0 6px 0", letterSpacing: "0.5px" }}>{f.title}</h4>
            <p style={{ color: "#777", fontSize: "11px", margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ padding: "28px", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: "#f5f0e8", fontSize: "16px", margin: 0, letterSpacing: "3px", fontFamily: "Georgia, serif" }}>
          SANYAA
        </p>
        <p style={{ color: "#666", fontSize: "11px", margin: "6px 0 0 0" }}>
          © 2026 Sanyaa. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
