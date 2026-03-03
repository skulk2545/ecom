import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function LandingPage() {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/products" replace />;
    }

    return (
        <main className="hd-landing">

            {/* ── Hero Section with full-bleed food image ── */}
            <section className="hd-hero">
                <div className="hd-hero-overlay"></div>
                <div className="hd-hero-content">
                    <h1 className="hd-hero-title">
                        <span className="hd-hero-quote">'</span>HD Foods<br />and Masale
                    </h1>
                    <p className="hd-hero-subtitle">
                        Authentic Maharashtrian<br />Khakhra &amp; Spices
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                        <Link to="/login" className="hd-btn-shop">Login</Link>
                        <Link to="/register" className="hd-btn-shop" style={{ background: "transparent", color: "#fef3c7", border: "2px solid #fef3c7" }}>Sign Up</Link>
                    </div>
                </div>
            </section>

            {/* ── Bottom Band with mandala decorations ── */}
            <section className="hd-bottom-band">
                <div className="hd-mandala hd-mandala-left"></div>
                <div style={{ textAlign: "center", color: "#a06748ff" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontFamily: "var(--font-h)" }}>Join our family today!</h3>
                    <Link to="/register" className="hd-btn-shop hd-btn-center">
                        Create an Account
                    </Link>
                </div>
                <div className="hd-mandala hd-mandala-right"></div>
            </section>

        </main>
    );
}
