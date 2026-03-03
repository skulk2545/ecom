import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import LandingPage from "./LandingPage.jsx";

const CATEGORIES = ["All", "KHAKRA", "FLAVOURED ICE"];

export default function Home() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!isAdmin) {
      api.get("/products")
        .then((res) => setProducts(res.data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (authLoading) return (
    <div className="center" style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
      Loading...
    </div>
  );

  if (isAdmin) return <Navigate to="/admin" replace />;

  const filteredProducts = products.filter(p => {
    if (activeCategory === "All") return true;
    const cat = (p.category || "").toUpperCase();
    return cat.includes(activeCategory.toUpperCase()) || p.name.toUpperCase().includes(activeCategory.toUpperCase());
  });

  return (
    <>
      <main className="hd-landing">
        {/* ── Hero Section matching Landing Page but without Auth Links ── */}
        <section className="hd-hero">
          <div className="hd-hero-overlay"></div>
          <div className="hd-hero-content" style={{ marginTop: "1rem" }}>
            <h1 className="hd-hero-title">
              <span className="hd-hero-quote">'</span>HD Foods<br />and Masale
            </h1>
            <p className="hd-hero-subtitle">
              Authentic Maharashtrian<br />Khakhra &amp; Spices
            </p>
          </div>
        </section>
      </main>

      <div className="page" style={{ paddingTop: "2rem", ...(user ? {} : { paddingBottom: '0.1rem' }) }}>
        {/* Category Pills */}
        <div className="category-pills" style={{ marginTop: "0.5rem", marginBottom: "3rem" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              style={activeCategory === cat ? { background: "var(--dark-brown)", color: "white", borderColor: "var(--dark-brown)" } : { background: "transparent", color: "var(--dark-brown)", borderColor: "var(--dark-brown)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h2 className="section-title" style={{ fontSize: "1.5rem", color: "var(--dark-brown)", fontWeight: "600" }}>Our Products</h2>
            <p className="section-subtitle" style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{filteredProducts.length} items available</p>
          </div>
          <div style={{ fontSize: ".85rem", color: "var(--text-muted)", display: "flex", gap: ".5rem", alignItems: "center" }}>
            Sort by: <strong style={{ color: "var(--dark-brown)" }}>Featured</strong>
          </div>
        </div>

        {loading ? (
          <div className="center" style={{ minHeight: "30vh", color: "var(--text-muted)" }}>
            Loading products...
          </div>
        ) : (
          <section className="products-grid">
            {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            {filteredProducts.length === 0 && (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1", textAlign: "center", padding: "4rem 1rem", fontSize: "1rem" }}>
                🛒 No {activeCategory !== "All" ? activeCategory.toLowerCase() : ""} products available at the moment. Check back soon!
              </p>
            )}
          </section>
        )}
      </div>
    </>
  );
}
