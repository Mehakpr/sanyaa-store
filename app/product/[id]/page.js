"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/*
  Product detail (client component)
  - Reads id from useParams, fetches /api/products/[id]
  - Shows image carousel thumbnails, lightbox zoom on tap
  - Size / color selection (if present in product)
  - Add to Cart (localStorage) and Add to Wishlist
*/

export default function ProductPageClient() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
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
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data?.success && data.product) {
          setProduct(data.product);
          setActiveImage(0);
          setSelectedSize(data.product.sizes?.[0] ?? null);
          setSelectedColor(data.product.colors?.[0] ?? null);
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error("err", e);
        setProduct(null);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  useEffect(() => {
    try {
      localStorage.setItem("mk_wishlist", JSON.stringify(wishIds));
    } catch {}
  }, [wishIds]);

  function toggleWish() {
    if (!product) return;
    setWishIds((prev) => {
      if (prev.includes(product._id)) return prev.filter((x) => x !== product._id);
      return [product._id, ...prev];
    });
  }

  function addToCart() {
    if (!product) return;
    const cartRaw = localStorage.getItem("mk_cart");
    let cart = [];
    try {
      cart = JSON.parse(cartRaw || "[]");
    } catch {}
    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: 1,
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0] ?? null,
    };
    cart.push(item);
    try {
      localStorage.setItem("mk_cart", JSON.stringify(cart));
      alert("Added to cart"); // simple feedback (we'll replace with toast later)
      router.push("/cart");
    } catch {
      alert("Could not add to cart");
    }
  }

  if (loading) {
    return (
      <div style={pstyles.page}>
        <div style={pstyles.skelLarge} />
      </div>
    );
  }

  if (!product) {
    return <div style={pstyles.page}><p style={{ padding: 18 }}>Product not found</p></div>;
  }

  const images = product.images && product.images.length ? product.images : ["/placeholder.png"];
  const wished = wishIds.includes(product._id);

  return (
    <div style={pstyles.page}>
      {/* Top bar */}
      <div style={pstyles.topBar}>
        <button style={pstyles.backBtn} onClick={() => router.back()}>◂</button>
        <div style={{ flex: 1 }} />
        <button onClick={toggleWish} style={pstyles.iconBtn}>{wished ? "❤" : "♡"}</button>
      </div>

      {/* Image gallery */}
      <div style={pstyles.gallery}>
        <img
          src={images[activeImage]}
          alt={product.name}
          style={pstyles.mainImage}
          onClick={() => setLightboxOpen(true)}
        />
        <div style={pstyles.thumbRow}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={i}
              style={{
                ...pstyles.thumb,
                border: i === activeImage ? "2px solid #7A4B3A" : "2px solid transparent",
              }}
              onClick={() => setActiveImage(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={pstyles.lightbox} onClick={() => setLightboxOpen(false)}>
          <img src={images[activeImage]} alt="zoom" style={pstyles.lightboxImage} />
        </div>
      )}

      {/* Details */}
      <div style={pstyles.detailCard}>
        <div style={pstyles.titleRow}>
          <h2 style={pstyles.title}>{product.name}</h2>
          <div style={pstyles.rating}>★ 4.5</div>
        </div>

        <p style={pstyles.price}>₹{product.price?.toFixed?.(2)}</p>

        <p style={pstyles.description}>{product.description}</p>

        {/* Size selectors */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={pstyles.subLabel}>Select Size</div>
            <div style={pstyles.optionsRow}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    ...pstyles.optionBtn,
                    background: selectedSize === s ? "#7A4B3A" : "#fff",
                    color: selectedSize === s ? "#fff" : "#2f2a28",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selectors */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={pstyles.subLabel}>Select Color</div>
            <div style={pstyles.optionsRow}>
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    ...pstyles.colorSwatch,
                    border: selectedColor === c ? "2px solid #7A4B3A" : "2px solid #eee",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: 12 }}>{c}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add-to-cart bar */}
      <div style={pstyles.stickyBar}>
        <div>
          <div style={{ fontSize: 12, color: "#85746b" }}>Total Price</div>
          <div style={{ fontWeight: 700, color: "#7A4B3A" }}>₹{product.price?.toFixed?.(2)}</div>
        </div>
        <button style={pstyles.addCartBtn} onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* styles for product page */
const pstyles = {
  page: {
    padding: "12px 14px 110px 14px",
    background: "#F7F3F1",
    minHeight: "100vh",
    color: "#2f2a28",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  backBtn: {
    background: "#fff",
    borderRadius: 10,
    padding: "6px 10px",
    border: "none",
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
  },
  iconBtn: {
    background: "#fff",
    borderRadius: 10,
    padding: "6px 10px",
    border: "none",
    fontSize: 16,
  },

  gallery: {
    marginBottom: 12,
  },
  mainImage: {
    width: "100%",
    height: 360,
    objectFit: "cover",
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  thumbRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    overflowX: "auto",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    objectFit: "cover",
    cursor: "pointer",
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 80,
  },
  lightboxImage: {
    width: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    borderRadius: 8,
  },

  detailCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 8px 20px rgba(20,15,12,0.04)",
    marginBottom: 90,
  },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  title: { margin: 0, fontSize: 18 },
  rating: { color: "#f3a712", fontWeight: 700 },

  price: { marginTop: 8, fontSize: 18, color: "#7A4B3A", fontWeight: 800 },

  description: { marginTop: 10, fontSize: 13, color: "#6b5b50", lineHeight: 1.45 },

  subLabel: { fontSize: 12, color: "#7b6b61", marginBottom: 8, fontWeight: 600 },

  optionsRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  optionBtn: {
    borderRadius: 12,
    padding: "6px 10px",
    border: "1px solid #efe6dd",
    cursor: "pointer",
    fontWeight: 700,
  },

  colorSwatch: {
    width: 44,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  stickyBar: {
    position: "fixed",
    left: 12,
    right: 12,
    bottom: 12,
    background: "#fff",
    borderRadius: 14,
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 12px 40px rgba(20,15,12,0.08)",
  },
  addCartBtn: {
    background: "#7A4B3A",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },

  // skeleton
  skelLarge: {
    height: 320,
    borderRadius: 14,
    background: "linear-gradient(90deg,#efe9e2,#f6f2ef)",
  },
};
