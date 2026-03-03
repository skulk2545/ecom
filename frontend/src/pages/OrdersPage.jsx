import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#d97706";
      case "shipped": return "#2563eb";
      case "delivered": return "#059669";
      default: return "#6b7280";
    }
  };

  return (
    <main className="hd-landing" style={{ minHeight: "90vh" }}>
      {/* Mini Hero */}
      <section className="hd-hero" style={{ minHeight: "25vh", paddingTop: "4rem" }}>
        <div className="hd-hero-overlay"></div>
        <div className="hd-hero-content">
          <h1 className="hd-hero-title" style={{ fontSize: "2.5rem" }}>
            <span className="hd-hero-quote">'</span>My Orders
          </h1>
          <p className="hd-hero-subtitle" style={{ fontSize: "1rem" }}>
            Track your authentic Maharashtrian journey
          </p>
        </div>
      </section>

      <div className="page" style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ color: "#78350f", fontSize: "1.1rem" }}>Fetching your history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "white", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "1rem" }}>📦</span>
            <h3 style={{ color: "#451a03", marginBottom: "1rem" }}>No orders yet</h3>
            <p style={{ color: "#78350f", marginBottom: "2rem", opacity: 0.8 }}>Looks like you haven't started your spice journey yet!</p>
            <Link to="/products" className="hd-btn-shop hd-btn-center" style={{ display: "inline-block" }}>Browse Our Products</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {orders.map((o) => (
              <div key={o.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #fef3c7" }}>
                <div style={{ background: "#fef3c7", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span style={{ color: "#78350f", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</span>
                    <h4 style={{ margin: 0, color: "#451a03", fontSize: "1.1rem" }}>#ORD-{o.id.toString().padStart(5, '0')}</h4>
                  </div>
                  <div>
                    <span style={{ color: "#78350f", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Date</span>
                    <p style={{ margin: 0, color: "#451a03", fontSize: "1rem" }}>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <span style={{ color: "#78350f", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Total Amount</span>
                    <p style={{ margin: 0, color: "#451a03", fontSize: "1.1rem", fontWeight: "bold" }}>₹{Number(o.total_price).toFixed(0)}</p>
                  </div>
                  <div>
                    <span style={{
                      background: getStatusColor(o.status),
                      color: "white",
                      padding: "0.4rem 1rem",
                      borderRadius: "100px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}>
                      {o.status}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "1.5rem 2rem" }}>
                  <h5 style={{ margin: "0 0 1rem 0", color: "#78350f", fontSize: "0.95rem", opacity: 0.7 }}>Order Items</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {o.items.map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                          {/* Using a generic spice icon as we don't have product details here yet */}
                          <div style={{ width: "40px", height: "40px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "1.2rem" }}>🌶️</div>
                          <div>
                            <span style={{ color: "#451a03", fontWeight: "600" }}>Product #{it.product_id}</span>
                            <span style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block" }}>Quantity: {it.quantity}</span>
                          </div>
                        </div>
                        <span style={{ color: "#451a03", fontWeight: "600" }}>₹{Number(it.price).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "1rem 2rem", background: "#fafafa", borderTop: "1px solid #f3f4f6", textAlign: "right" }}>
                  <Link to="/products" style={{ color: "#78350f", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Order Again →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
