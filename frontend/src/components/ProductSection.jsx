import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import ProductCard from "./ProductCard.jsx";

const CATEGORIES = ["All", "KHAKRA", "FLAVOURED ICE"];

export default function ProductSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        api.get("/products")
            .then((res) => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    const filteredProducts = products.filter(p => {
        if (activeCategory === "All") return true;
        const cat = (p.category || "").toUpperCase();
        return cat.includes(activeCategory.toUpperCase()) || p.name.toUpperCase().includes(activeCategory.toUpperCase());
    });

    return (
        <section id="products-section" className="page" style={{ padding: "5rem 2rem", background: "#fff", borderTop: "1px solid #eee" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <h2 style={{ fontSize: "2.5rem", color: "#3a200d", fontFamily: "var(--font-h)", marginBottom: "1rem" }}>Explore Our Products</h2>
                    <p style={{ color: "#5a4030", fontSize: "1.1rem" }}>Handcrafted with love, from our kitchen to yours.</p>
                </div>

                {/* Category Pills */}
                <div className="category-pills" style={{ justifyContent: "center", marginBottom: "3rem" }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`category-pill ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                            style={activeCategory === cat ? { background: "var(--green-dark)", color: "white", borderColor: "var(--green-dark)" } : { background: "transparent", color: "var(--green-dark)", borderColor: "var(--green-dark)" }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="center" style={{ minHeight: "30vh", color: "var(--text-muted)" }}>
                        Loading products...
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
                        {filteredProducts.length === 0 && (
                            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem 1rem", fontSize: "1rem", width: "100%" }}>
                                🛒 No products available in this category.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
