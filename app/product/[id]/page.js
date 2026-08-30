"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
        if (data.product?.sizes?.length) setSelectedSize(data.product.sizes[0]);
        if (data.product?.colors?.length) setSelectedColor(data.product.colors[0]);

        fetch("/api/products")
          .then((res) => res.json())
          .then((allData) => {
            const others = (allData.products || []).filter(
              (p) => p._id !== data.product._id && p.category === data.product.category
            );
            setRelated(others.slice(0, 6));
          });
      });
  }, [params.id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartId = product._id + (selectedSize || "") + (selectedColor || "");
    const existing = cart.find((item) => item.cartId === cartId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, cartId, size: selectedSize, color: selectedColor, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  };

  const handleAddToCart = () => {
    addToCart();
    alert("Product cart mein add ho gaya!");
  };

  const buyNow = () => {
    addToCart();
    window.location.href = "/cart";
  };

  const GOLD = "#d4af37";
  const BG = "#0e0c0a";
  const CARD = "#1a1613";
  const CARD2 = "#221c17";
  const BORDER = "#2c261f";

  if (loading) return <p style={{ padding: "24px", color: "#888", background: BG, minHeight: "100vh" }}>Loading...</p>;
  if (!product) return <p style={{ padding: "24px", color: "#888", background: BG, minHeight: "100vh" }}>Product not found.</p>;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

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
        <a href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "700", margin: 0, color: GOLD, fontFamily: "'Dancing Script', cursive" }}>
            Sanyaa
          </h1>
        </a>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ color: GOLD, fontSize: "18px" }}>♡</span>
          <a href="/cart" style={{ textDecoration: "none", color: GOLD, fontSize: "18px" }}>🛍</a>
        </div>
      </header>

      {/* Category pill row (mobile version of sidebar) */}
      <div style={{ display: "flex", gap: "8px", padding: "14px 20px", overflowX: "auto" }}>
        <span style={{ background: GOLD, color: "#1a1613", padding: "6px 16px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>
          {product.category}
        </span>
        <span style={{ border: `1px solid ${BORDER}`, color: "#ccc", padding: "6px 16px", borderRadius: "20px", fontSize: "11px", whiteSpace: "nowrap" }}>
          {product.subcategory}
        </span>
      </div>

      {/* Hero product card */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            background: `linear-gradient(180deg, ${CARD2}, ${CARD})`,
            borderRadius: "22px",
            border: `1px solid ${BORDER}`,
            padding: "18px",
            position: "relative",
          }}
        >
          <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "3px", fontWeight: "700", margin: "0 0 8px 0" }}>
            NEW ARRIVAL
          </p>

          <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#f5f0e8", margin: "0 0 14px 0", fontFamily: "Georgia, serif", lineHeight: "1.2" }}>
            {product.name}
          </h2>

          <div style={{ width: "100%", height: "280px", borderRadius: "16px", overflow: "hidden", background: "#111", position: "relative", marginBottom: "14px" }}>
            {images[activeImage] && (
              <img
                src={images[activeImage]}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <button
              onClick={handleAddToCart}
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: GOLD,
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ♡
            </button>
            {discount > 0 && (
              <span style={{ position: "absolute", top: "12px", left: "12px", background: GOLD, color: "#1a1613", fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px" }}>
                {discount}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: activeImage === i ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}

          <p style={{ fontSize: "13px", color: "#a8a29a", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            {product.description}
          </p>

          {avgRating && (
            <p style={{ fontSize: "13px", color: GOLD, marginBottom: "14px" }}>
              {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}{" "}
              <span style={{ color: "#999" }}>{avgRating} ({product.reviews.length})</span>
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <span style={{ fontSize: "26px", fontWeight: "700", color: GOLD }}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: "15px", color: "#666", textDecoration: "line-through" }}>₹{product.originalPrice}</span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px", alignItems: "center" }}>
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: color.toLowerCase().replace(" ", ""),
                    border: selectedColor === color ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                    cursor: "pointer",
                    boxShadow: selectedColor === color ? `0 0 0 2px ${BG}, 0 0 0 3px ${GOLD}` : "none",
                  }}
                />
              ))}
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>Size</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: "38px",
                      height: "38px",
                      padding: "0 10px",
                      borderRadius: "8px",
                      border: selectedSize === size ? `1.5px solid ${GOLD}` : `1px solid ${BORDER}`,
                      background: selectedSize === size ? GOLD : "transparent",
                      color: selectedSize === size ? "#1a1613" : "#e8e2d8",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like */}
      {related.length > 0 && (
        <div style={{ padding: "24px 16px 0" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f5f0e8", marginBottom: "12px", fontFamily: "Georgia, serif" }}>
            You May Also Like
          </h3>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {related.map((p) => (
              <a key={p._id} href={`/product/${p._id}`} style={{ textDecoration: "none", flexShrink: 0, width: "130px" }}>
                <div style={{ background: CARD, borderRadius: "12px", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "120px", background: "#111" }}>
                    <img src={p.images && p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                  <div style={{ padding: "10px" }}>
                    <p style={{ fontSize: "12px", color: "#f5f0e8", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "13px", color: GOLD, fontWeight: "700", margin: 0 }}>₹{p.price}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trust badges */}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "24px 16px", textAlign: "center" }}>
        <div>
          <p style={{ fontSize: "16px", margin: "0 0 4px 0" }}>🚚</p>
          <p style={{ fontSize: "10px", color: "#999", margin: 0 }}>Free Shipping</p>
        </div>
        <div>
          <p style={{ fontSize: "16px", margin: "0 0 4px 0" }}>↩️</p>
          <p style={{ fontSize: "10px", color: "#999", margin: 0 }}>Easy Returns</p>
        </div>
        <div>
          <p style={{ fontSize: "16px", margin: "0 0 4px 0" }}>🔒</p>
          <p style={{ fontSize: "10px", color: "#999", margin: 0 }}>Secure Payment</p>
        </div>
      </div>

      {/* Sticky bottom buttons */}
      <div style={{ display: "flex", gap: "10px", padding: "16px", position: "sticky", bottom: 0, background: BG, borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1,
            background: "transparent",
            color: GOLD,
            padding: "15px",
            border: `1.5px solid ${GOLD}`,
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          ADD TO BAG
        </button>
        <button
          onClick={buyNow}
          style={{
            flex: 1,
            background: GOLD,
            color: "#1a1613",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          BUY NOW
        </button>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div style={{ padding: "0 16px 30px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f5f0e8", margin: "20px 0 12px 0", fontFamily: "Georgia, serif" }}>
            Customer Reviews
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {product.reviews.map((r, i) => (
              <div key={i} style={{ background: CARD, padding: "14px", borderRadius: "10px", border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "600", fontSize: "13px", color: "#f5f0e8" }}>{r.reviewerName}</span>
                  <span style={{ color: GOLD, fontSize: "12px" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#a8a29a", margin: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
