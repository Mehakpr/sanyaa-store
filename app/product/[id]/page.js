"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
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
    alert("Product cart mein add ho gaya!");
  };

  const buyNow = () => {
    addToCart();
    window.location.href = "/cart";
  };

  if (loading) return <p style={{ padding: "24px", color: "#888", background: "#0e0c0a", minHeight: "100vh" }}>Loading...</p>;
  if (!product) return <p style={{ padding: "24px", color: "#888", background: "#0e0c0a", minHeight: "100vh" }}>Product not found.</p>;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  const GOLD = "#d4af37";
  const BG = "#0e0c0a";
  const CARD = "#1a1613";
  const BORDER = "#2c261f";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif" }}>
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
        <a href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#f5f0e8", fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
            SANYAA
          </h1>
        </a>
        <a href="/cart" style={{ textDecoration: "none", color: GOLD, fontSize: "20px" }}>🛍</a>
      </header>

      <div style={{ padding: "20px", maxWidth: "950px", margin: "0 auto" }}>
        <div
          style={{
            background: CARD,
            borderRadius: "18px",
            border: `1px solid ${BORDER}`,
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
          }}
        >
          {/* Image */}
          <div>
            <div style={{ width: "100%", height: "340px", background: "#111", borderRadius: "14px", overflow: "hidden", marginBottom: "12px", position: "relative" }}>
              {images[activeImage] && (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              {discount > 0 && (
                <span style={{ position: "absolute", top: "12px", left: "12px", background: GOLD, color: "#1a1613", fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px" }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: "56px",
                      height: "56px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: activeImage === i ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "2px", fontWeight: "700", marginBottom: "6px" }}>
              {product.category?.toUpperCase()} {product.subcategory && `• ${product.subcategory.toUpperCase()}`}
            </p>

            <h2 style={{ fontSize: "26px", fontWeight: "500", color: "#f5f0e8", margin: "0 0 10px 0", fontFamily: "Georgia, serif" }}>
              {product.name}
            </h2>

            {avgRating && (
              <p style={{ fontSize: "13px", color: GOLD, marginBottom: "12px" }}>
                {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}{" "}
                <span style={{ color: "#999" }}>{avgRating} ({product.reviews.length} reviews)</span>
              </p>
            )}

            <p style={{ fontSize: "13px", color: "#a8a29a", lineHeight: "1.7", margin: "0 0 18px 0" }}>
              {product.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
              <span style={{ fontSize: "26px", fontWeight: "700", color: GOLD }}>₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: "15px", color: "#666", textDecoration: "line-through" }}>₹{product.originalPrice}</span>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "#999", letterSpacing: "1px", marginBottom: "10px" }}>COLOR: {selectedColor}</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: color.toLowerCase().replace(" ", ""),
                        border: selectedColor === color ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                        cursor: "pointer",
                        boxShadow: selectedColor === color ? `0 0 0 2px ${BG}, 0 0 0 3px ${GOLD}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "12px", color: "#999", letterSpacing: "1px", marginBottom: "10px" }}>SIZE</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: "40px",
                        height: "40px",
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

            <p style={{ fontSize: "12px", color: "#777", marginBottom: "20px" }}>
              In Stock: {product.stock} units
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addToCart}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: GOLD,
                  padding: "14px",
                  border: `1.5px solid ${GOLD}`,
                  borderRadius: "8px",
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
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "13px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#f5f0e8", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
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
    </div>
  );
}
