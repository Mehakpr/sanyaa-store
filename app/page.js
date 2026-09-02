"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/*
  Homepage (mobile-first)
  - Fetches products from /api/products
  - Shows a premium hero, category row, and product grid
  - ProductCard includes wishlist (localStorage) and navigates to product page
*/

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishIds, setWishIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mk_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (e) {
        console.error("Failed fetching products", e);
        setProducts([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    // persist wishlist
    try {
      localStorage.setItem("mk_wishlist", JSON.stringify(wishIds));
    } catch {}
  }, [wishIds]);

  function toggleWish(id) {
    setWishIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [id, ...prev];
    });
  }

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>MK Legacy</h1>
          <p style={styles.heroSubtitle}>
            Premium everyday fashion — mobile-first shopping experience
          </p>
          <button
            style={styles.cta}
            onClick={() => {
              // scroll to product grid
              const el = document.getElementById("product-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Shop New Collection
          </button>
        </div>
        <div style={styles.heroImageWrap}>
          {/* simple image placeholder - replace src with your hero image */}
          <img
            alt="hero"
            src="/hero-placeholder.jpg"
            style={styles.heroImage}
          />
        </div>
      </section>

      {/* Category row (simple icons) */}
      <section style={styles.categories}>
        {["T-Shirt", "Pant", "Dress", "Jacket"].map((c) => (
          <div key={c} style={styles.catItem}>
            <div style={styles.catIcon}>{c[0]}</div>
            <div style={styles.catLabel}>{c}</div>
          </div>
        ))}
      </section>

      {/* Flash sale / filters bar (simple) */}
      <section style={styles.filterBar}>
        <div style={styles.filterLeft}>Flash Sale</div>
        <div style={styles.filterRight}>See All ▸</div>
      </section>

      {/* Products */}
      <section id="product-grid" style={styles.gridWrap}>
        {loading
          ? // show some skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.skelImage} />
                <div style={styles.skelLineShort} />
                <div style={styles.skelLineLong} />
              </div>
            ))
          : products.length === 0
          ? <div style={{ padding: 20, color: "#6b5b50" }}>No products found</div>
          : products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                wished={wishIds.includes(p._id)}
                onToggleWish={() => toggleWish(p._id)}
                onOpen={() => router.push(`/product/${p._id}`)}
              />
            ))}
      </section>
    </div>
  );
}

/* ProductCard client component (inline for easy paste) */
function ProductCard({ product, onOpen, onToggleWish, wished }) {
  const img = product.images && product.images.length ? product.images[0] : "/placeholder.png";
  return (
    <div style={styles.card}>
      <div style={styles.cardImageWrap} onClick={onOpen}>
        <img src={img} alt={product.name} style={styles.cardImage} />
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTitleRow}>
          <div style={styles.cardTitle}>{product.name}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWish();
            }}
            aria-label="Wishlist"
            style={styles.wishButton}
          >
            <Heart filled={wished} />
          </button>
        </div>

        <div style={styles.cardPrice}>₹{product.price?.toFixed?.(2) ?? product.price}</div>
      </div>
    </div>
  );
}

/* Simple Heart icon */
function Heart({ filled }) {
  return (
    <span style={{ color: filled ? "#7A4B3A" : "#bfb1a8", fontSize: 18 }}>
      {filled ? "❤" : "♡"}
    </span>
  );
}

/* Inline styles (mobile-first, warm beige palette) */
const styles = {
  page: {
    padding: "12px 14px 90px 14px",
    background: "#F7F3F1",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: "#2f2a28",
  },
  hero: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#42342f",
    lineHeight: 1.05,
  },
  heroSubtitle: {
    marginTop: 6,
    marginBottom: 10,
    color: "#6b5b50",
    fontSize: 13,
  },
  cta: {
    background: "#7A4B3A",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(122,75,58,0.12)",
  },
  heroImageWrap: {
    width: 120,
    height: 120,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    flexShrink: 0,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  categories: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    overflowX: "auto",
    paddingBottom: 6,
  },
  catItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 64,
    cursor: "pointer",
  },
  catIcon: {
    width: 52,
    height: 52,
    borderRadius: 999,
    background: "#efe6dd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7A4B3A",
    fontWeight: 700,
    marginBottom: 6,
    boxShadow: "0 6px 12px rgba(0,0,0,0.04)",
    fontSize: 18,
  },
  catLabel: {
    fontSize: 12,
    color: "#5b4f48",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 6px",
    marginBottom: 8,
  },
  filterLeft: { color: "#6b5b50", fontWeight: 600 },
  filterRight: { color: "#a89284", fontSize: 13 },

  gridWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(20,15,12,0.04)",
    cursor: "pointer",
  },
  cardImageWrap: {
    width: "100%",
    height: 160,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform .25s ease",
  },
  cardBody: {
    padding: 10,
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2f2a28",
  },
  cardPrice: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#7A4B3A",
  },
  wishButton: {
    background: "transparent",
    border: "none",
    padding: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // skeleton
  skelImage: {
    height: 120,
    background: "linear-gradient(90deg,#efe9e2,#f6f2ef)",
  },
  skelLineShort: {
    height: 10,
    width: "40%",
    margin: "10px 12px 6px",
    background: "linear-gradient(90deg,#efe9e2,#f6f2ef)",
  },
  skelLineLong: {
    height: 10,
    width: "70%",
    margin: "0 12px 14px",
    background: "linear-gradient(90deg,#efe9e2,#f6f2ef)",
  },
};
