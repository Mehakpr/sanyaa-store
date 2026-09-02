"use client";

export default function OrderSuccess() {
  const GOLD = "#8EB69B";
  const BG = "#051F20";
  const CARD = "#0B2B26";
  const BORDER = "#235347";
  const LIGHT = "#DAF1DE";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", marginBottom: "20px" }}>
        ✓
      </div>

      <h1 style={{ fontSize: "24px", fontWeight: "600", color: LIGHT, margin: "0 0 10px 0", fontFamily: "Georgia, serif" }}>
        Order Placed Successfully!
      </h1>
      <p style={{ fontSize: "14px", color: "#a8c9bd", margin: "0 0 30px 0", maxWidth: "300px" }}>
        Thank you for shopping with Sanyaa. Your order is being processed and will be shipped soon.
      </p>

      <a href="/" style={{ textDecoration: "none" }}>
        <button
          style={{
            background: GOLD,
            color: "#051F20",
            padding: "14px 36px",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          CONTINUE SHOPPING
        </button>
      </a>

      <p style={{ color: GOLD, fontSize: "22px", margin: "40px 0 0 0", fontFamily: "'Dancing Script', cursive" }}>
        Sanyaa
      </p>
    </div>
  );
}
