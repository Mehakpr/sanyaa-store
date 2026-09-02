"use client";
import { useEffect, useState } from "react";

const STATUS_STAGES = ["placed", "processing", "shipped", "delivered"];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const GOLD = "#8EB69B";
  const BG = "#051F20";
  const CARD = "#0B2B26";
  const BORDER = "#235347";
  const LIGHT = "#DAF1DE";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("sanyaaUser") || "null");
    if (!user) {
      window.location.href = "/login?redirect=/my-orders";
      return;
    }

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const myOrders = (data.orders || []).filter((o) => o.userId === user.id);
        setOrders(myOrders);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

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
      </header>

      <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: LIGHT, marginBottom: "20px", fontFamily: "Georgia, serif" }}>
          My Orders
        </h2>

        {loading && <p style={{ color: "#888" }}>Loading...</p>}
        {!loading && orders.length === 0 && (
          <p style={{ color: "#888" }}>
            Koi order nahi mila. <a href="/" style={{ color: GOLD }}>Shopping shuru karo →</a>
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const currentStageIndex = STATUS_STAGES.indexOf(order.orderStatus || "placed");

            return (
              <div key={order._id} style={{ background: CARD, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", color: "#a8c9bd" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: GOLD }}>₹{order.totalAmount}</span>
                </div>

                {order.items.map((item, i) => (
                  <p key={i} style={{ fontSize: "13px", color: LIGHT, margin: "0 0 4px 0" }}>
                    {item.name} × {item.qty}
                  </p>
                ))}

                {/* Status tracker */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
                  {STATUS_STAGES.map((stage, i) => (
                    <div key={stage} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STAGES.length - 1 ? 1 : "none" }}>
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: i <= currentStageIndex ? GOLD : BORDER,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: i <= currentStageIndex ? "#051F20" : "#666",
                          flexShrink: 0,
                        }}
                      >
                        {i <= currentStageIndex ? "✓" : ""}
                      </div>
                      {i < STATUS_STAGES.length - 1 && (
                        <div style={{ flex: 1, height: "2px", background: i < currentStageIndex ? GOLD : BORDER }} />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  {STATUS_STAGES.map((stage) => (
                    <span key={stage} style={{ fontSize: "9px", color: "#a8c9bd", textTransform: "capitalize", flex: 1, textAlign: "center" }}>
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
