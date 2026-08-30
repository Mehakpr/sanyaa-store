"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "6px", color: "#3d2b1f" }}>Orders</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
        All customer orders ({orders.length})
      </p>

      {loading && <p style={{ color: "#888" }}>Loading orders...</p>}
      {!loading && orders.length === 0 && <p style={{ color: "#888" }}>Koi order nahi aaya abhi.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#888" }}>
                {new Date(order.createdAt).toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: order.paymentStatus === "paid" ? "#0a0" : "#d33",
                }}
              >
                {order.paymentStatus === "paid" ? "PAID" : "PENDING"}
              </span>
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#3d2b1f", margin: "0 0 6px 0" }}>
              {order.customerName} — ₹{order.totalAmount}
            </h3>

            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px 0" }}>
              📞 {order.phone}
            </p>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 12px 0" }}>
              📍 {order.address}, {order.city} - {order.pincode}
            </p>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#3d2b1f", marginBottom: "6px" }}>
                Items:
              </p>
              {order.items.map((item, i) => (
                <p key={i} style={{ fontSize: "13px", color: "#555", margin: "0 0 4px 0" }}>
                  • {item.name} {item.size && `(${item.size})`} {item.color && `- ${item.color}`} × {item.qty} — ₹{item.price}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
