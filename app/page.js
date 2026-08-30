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

  const featured = filteredProducts[0];
  const restProducts = filteredProducts.slice(1);

  const GOLD = "#d4af37";
  const BG = "#0e0c0a";
  const CARD = "#1a1613";
  const CARD2 = "#221c17";
  const BORDER = "#2c261f";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        @keyframes fadeInLogo {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .sanyaa-logo { animation: fadeInLogo 1.2s ease-out; }
      `}</style>

      {/* Header */}
      <header
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <h1
          className="sanyaa-logo"
          style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: GOLD, fontFamily: "'Dancing Script', cursive" }}
        >
          Sanyaa
        </h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ color: GOLD, fontSize: "18px" }}>♡</span>
          <a href="/cart" style={{ textDecoration: "none", color: GOLD, fontSize: "18px" }}>🛍</a>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: "16px 20px 0" }}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: "12px",
            border: `1px solid ${BORDER}`,
            fontSize: "14px",
            boxSizing: "border-box",
            background: CARD,
            color: "#f5f0e8",
          }}
        />
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: "10px", padding: "16px 20px", overflowX: "auto" }}>
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
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#888", padding: "0 20px" }}>Loading products...</p>}
      {!loading && filteredProducts.length === 0 && (
        <p style={{ color: "#888", padding: "0 20px" }}>Koi product nahi mila.</p>
      )}

      {/* Featured hero card */}
      {featured && (
        <div style={{ padding: "0 16px 20px" }}>
          <a href={`/product/${featured._id}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `linear-gradient(180deg, ${CARD2}, ${CARD})`,
                borderRadius: "22px",
                border: `1px solid ${BORDER}`,
                padding: "18px",
              }}
            >
              <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "3px", fontWeight: "700", margin: "0 0 8px 0" }}>
                NEW ARRIVAL
              </p>
              <h2 style={{ fontSize: "22px", fontWeight: "500", color: "#f5f0e8", margin: "0 0 14px 0", fontFamily: "Georgia, serif" }}>
                {featured.name}
              </h2>
              <div style={{ width: "100%", height: "260px", borderRadius: "16px", overflow: "hidden", background: "#111", position: "relative" }}>
                <img
                  src={featured.images && featured.images[0]}
                  alt={featured.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", color: GOLD }}>₹{featured.price}</span>
                {featured.originalPrice > featured.price && (
                  <span style={{ fontSize: "14px", color: "#666", textDecoration: "line-through" }}>₹{featured.originalPrice}</span>
                )}
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Product grid */}
      <main style={{ padding: "0 16px 40px" }}>
        {restProducts.length > 0 && (
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f5f0e8", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
            You May Also Like
          </h3>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "14px",
          }}
        >
          {restProducts.map((product) => {
            const discount =
              product.originalPrice && product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <a key={product._id} href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: CARD, borderRadius: "14px", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "150px", background: "#111", position: "relative" }}>
                    <img
                      src={product.images && product.images[0]}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    {discount > 0 && (
                      <span style={{ position: "absolute", top: "8px", left: "8px", background: GOLD, color: "#1a1613", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "20px" }}>
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: "600", color: "#f5f0e8", margin: "0 0 6px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: GOLD }}>₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span style={{ fontSize: "10px", color: "#666", textDecoration: "line-through" }}>₹{product.originalPrice}</span>
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
          padding: "24px 16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          textAlign: "center",
        }}
      >
        {[
          { icon: "🚚", title: "Free Shipping", desc: "On all orders" },
          { icon: "↩️", title: "Easy Returns", desc: "7 day return policy" },
          { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
        ].map((f) => (
          <div key={f.title}>
            <p style={{ fontSize: "18px", margin: "0 0 6px 0" }}>{f.icon}</p>
            <h4 style={{ color: GOLD, fontSize: "12px", margin: "0 0 4px 0" }}>{f.title}</h4>
            <p style={{ color: "#777", fontSize: "10px", margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ padding: "28px", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: GOLD, fontSize: "26px", margin: 0, fontFamily: "'Dancing Script', cursive" }}>
          Sanyaa
        </p>
        <p style={{ color: "#666", fontSize: "11px", margin: "6px 0 0 0" }}>
          © 2026 Sanyaa. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
