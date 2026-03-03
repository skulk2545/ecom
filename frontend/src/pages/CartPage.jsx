import React from "react";
import { useCart } from "../state/CartContext.jsx";
import api from "../api/client.js";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, totals, removeFromCart, updateQuantity, clearCart } = useCart();
  const [placing, setPlacing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const placeOrder = async () => {
    setMessage("");
    if (!items.length) return;
    setPlacing(true);
    try {
      const payload = {
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
        })),
      };
      await api.post("/orders", payload);
      clearCart();
      setMessage("Order placed successfully!");
    } catch (err) {
      setMessage("Failed to place order. Are you logged in?");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="hd-landing" style={{ minHeight: "80vh" }}>
      <div className="page" style={{ maxWidth: "800px", margin: "3rem auto", padding: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h2 style={{ color: "#451a03", fontSize: "2rem", marginBottom: "1.5rem", borderBottom: "2px solid #fef3c7", paddingBottom: "1rem" }}>Your Shopping Cart</h2>

        {message && <div style={{ background: "#fef3c7", color: "#78350f", padding: "1rem", borderRadius: "8px", marginBottom: "2rem", fontWeight: "600" }}>{message}</div>}

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🛒</span>
            <p style={{ color: "#78350f", fontSize: "1.2rem", marginBottom: "1.5rem" }}>Your cart is currently empty.</p>
            <Link to="/products" className="hd-btn-shop hd-btn-center" style={{ display: "inline-block" }}>Shop Now</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map(({ product, quantity }) => {
                const price = Number(product.price);
                const discount = product.discount || 0;
                const effective = price * (1 - discount / 100);
                return (
                  <li key={product.id} className="cart-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <img src={product.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"} alt={product.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                      <div>
                        <h4 style={{ color: "#451a03", fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>{product.name}</h4>
                        <p style={{ color: "#d97706", fontWeight: "bold", margin: 0 }}>₹{effective.toFixed(0)} <span style={{ color: "#9ca3af", fontWeight: "normal", fontSize: "0.9rem" }}>x {quantity}</span></p>
                      </div>
                    </div>
                    <div className="cart-controls" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                          style={{ width: "60px", padding: "0.4rem", border: "1px solid #d1d5db", borderRadius: "6px", textAlign: "center" }}
                        />
                      </div>
                      <button
                        className="btn-link"
                        onClick={() => removeFromCart(product.id)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="cart-summary" style={{ marginTop: "2rem", padding: "2rem", background: "#fef3c7", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#78350f", fontSize: "1rem", fontWeight: "500" }}>Subtotal</span>
                <span style={{ color: "#451a03", fontSize: "1.8rem", fontWeight: "bold" }}>₹{totals.total.toFixed(0)}</span>
              </div>
              <button
                className="hd-btn-shop"
                onClick={placeOrder}
                disabled={placing}
                style={{ padding: "1rem 2rem", fontSize: "1.1rem", borderRadius: "8px", border: "none" }}
              >
                {placing ? "Processing..." : "Secure Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
