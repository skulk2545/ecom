import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Footer() {
    const { user } = useAuth();
    return (
        <footer className="hd-footer" style={{ background: "#6f3617ff", color: "#fef3c7", padding: "2rem 4rem", marginTop: "auto", borderTop: "4px solid #c9977bff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", maxWidth: "1200px", margin: "0 auto" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.4rem", fontFamily: "var(--font-h)" }}>HD Foods and Masale</h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>Authentic Maharashtrian Khakhra & Spices.</p>
                </div>

                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", fontWeight: "600" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <Link to={user ? "/products" : "/"} style={{ color: "#fef3c7", textDecoration: "none" }}>Our Store</Link>
                        <Link to="/about" style={{ color: "#fef3c7", textDecoration: "none" }}>Our Story</Link>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: '150px' }}>
                        <span style={{ color: "#fef3c7", fontSize: "1rem", fontWeight: "700" }}>Contact Us</span>
                        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>📍 Plot 42, Masale Lane, Pune</p>
                        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>📞 +91 98765 43210</p>
                        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>✉️ hello@hdfoods.com</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <Link to="/admin/login" style={{ color: "#fef3c7", textDecoration: "none", opacity: 0.8 }}>Admin Area</Link>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(254, 243, 199, 0.2)", marginTop: "2rem", paddingTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", opacity: 0.7 }}>
                <p>&copy; {new Date().getFullYear()} HD Foods and Masale. All rights reserved.</p>
            </div>
        </footer>
    );
}
