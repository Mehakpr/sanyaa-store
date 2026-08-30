"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const GOLD = "#d4af37";
  const BG = "#0e0c0a";
  const CARD = "#1a1613";
  const BORDER = "#2c261f";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (cartId) => {
    updateCart(cart.filter((item) => item.cartId !== cartId));
  };

  const changeQty = (cartId, delta) => {
    const newCart = cart.map((item) => {
      if (item.cartId === cartId) {
        const newQty = item.qty + delta;
        return { ...item, qty: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    if (!form.customerName || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all fields");
      return;
    }

    setProcessing(true);

    try {
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Error creating order: " + orderData.error);
        setProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_TStcOFuXJTB2Qk",
        amount: orderData.order.amount,
        currency: "INR",
        name: "Sanyaa",
        description: "Order Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          const saveRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart,
              ...form,
              totalAmount: total,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const saveData = await saveRes.json();

          if (saveData.success) {
            localStorage.removeItem("cart");
            alert("Order placed successfully!");
            window.location.href = "/";
          } else {
            alert("Order save karne mein error: " + saveData.error);
          }
        },
        prefill: { name: form.customerName, contact: form.phone },
        theme: { color: "#d4af37" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessing(false);
    } catch (error) {
      alert("Error: " + error.message);
      setProcessing(false);
    }
  };

  const inputStyle = {
    padding: "12px",
    border: `1px solid ${BORDER}`,
    borderRadius: "8px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    color: "#f5f0e8",
    background: "#111",
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, sans-serif" }}>
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
      </header>

      <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f5f0e8", marginBottom: "20px", fontFamily: "Georgia, serif" }}>
          Your Bag
        </h2>

        {cart.length === 0 && (
          <p style={{ color: "#888" }}>
            Cart khali hai. <a href="/" style={{ color: GOLD }}>Shopping shuru karo →</a>
          </p>
        )}

        {cart.map((item) => (
          <div
            key={item.cartId}
            style={{
              display: "flex",
              gap: "14px",
              padding: "14px",
              background: CARD,
              borderRadius: "12px",
              border: `1px solid ${BORDER}`,
              marginBottom: "12px",
              alignItems: "center",
            }}
          >
            <div style={{ width: "70px", height: "70px", background: "#111", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
              <img
                src={item.images && item.images[0]}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f5f0e8", margin: "0 0 4px 0" }}>{item.name}</h3>
              {(item.size || item.color) && (
                <p style={{ fontSize: "12px", color: "#999", margin: "0 0 4px 0" }}>
                  {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                </p>
              )}
              <p style={{ fontSize: "14px", color: GOLD, fontWeight: "700", margin: "0 0 8px 0" }}>₹{item.price}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => changeQty(item.cartId, -1)} style={{ width: "26px", height: "26px", border: `1px solid ${BORDER}`, background: "#111", color: "#fff", borderRadius: "6px" }}>-</button>
                <span style={{ color: "#f5f0e8" }}>{item.qty}</span>
                <button onClick={() => changeQty(item.cartId, 1)} style={{ width: "26px", height: "26px", border: `1px solid ${BORDER}`, background: "#111", color: "#fff", borderRadius: "6px" }}>+</button>
                <button onClick={() => removeItem(item.cartId)} style={{ marginLeft: "10px", color: "#c0392b", background: "none", border: "none", fontSize: "12px", textDecoration: "underline" }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ marginTop: "24px", padding: "20px", background: CARD, borderRadius: "12px", border: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700", color: "#f5f0e8", marginBottom: "18px" }}>
              <span>Total:</span>
              <span style={{ color: GOLD }}>₹{total}</span>
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  width: "100%",
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
                PROCEED TO CHECKOUT
              </button>
            )}

            {showForm && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h3 style={{ fontSize: "14px", color: "#f5f0e8", margin: "0 0 4px 0" }}>Delivery Details</h3>
                <input name="customerName" placeholder="Full Name" value={form.customerName} onChange={handleFormChange} style={inputStyle} />
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleFormChange} style={inputStyle} />
                <input name="address" placeholder="Full Address" value={form.address} onChange={handleFormChange} style={inputStyle} />
                <input name="city" placeholder="City" value={form.city} onChange={handleFormChange} style={inputStyle} />
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleFormChange} style={inputStyle} />

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  style={{
                    width: "100%",
                    background: GOLD,
                    color: "#1a1613",
                    padding: "14px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    opacity: processing ? 0.6 : 1,
                  }}
                >
                  {processing ? "PROCESSING..." : `PAY ₹${total}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
