import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Footer() {
    const { user } = useAuth();
    return (
        <footer className="hd-footer" style={{ background: "#451a03", color: "#fef3c7", padding: "4rem 2rem", marginTop: "auto", borderTop: "6px solid #fbbf24" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.8rem", fontFamily: "var(--font-h)", color: "#fbbf24", fontWeight: "800" }}>HD Foods and Masale</h3>
                    <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9, lineHeight: "1.6" }}>Crafting authentic Maharashtrian Khakhra & Spices with love since generations.</p>
                </div>

                <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <h4 style={{ color: "#fbbf24", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Quick Links</h4>
                        <Link to={user ? "/products" : "/"} style={{ color: "#fef3c7", textDecoration: "none", opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Our Store</Link>
                        <Link to="/about" style={{ color: "#fef3c7", textDecoration: "none", opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Our Story</Link>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: '200px' }}>
                        <h4 style={{ color: "#fbbf24", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Contact Us</h4>
                        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>📍 Plot 42, Masale Lane, Pune</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>📞 +91 98765 43210</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>✉️ hello@hdfoods.com</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <h4 style={{ color: "#fbbf24", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Admin</h4>
                        <Link to="/admin/login" style={{ color: "#fef3c7", textDecoration: "none", opacity: 0.6 }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>Admin Login</Link>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(251, 191, 36, 0.2)", marginTop: "4rem", paddingTop: "2rem", textAlign: "center", fontSize: "0.85rem", opacity: 0.6 }}>
                <p>&copy; {new Date().getFullYear()} <span style={{ color: "#fbbf24" }}>HD Foods and Masale</span>. All rights reserved.</p>
            </div>
        </footer>
    );
}
