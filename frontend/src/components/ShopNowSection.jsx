import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../state/SettingsContext.jsx";

export default function ShopNowSection() {
    const { settings } = useSettings();
    return (
        <section style={{
            padding: "8rem 2rem",
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${settings.shopnow_image_url || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1600"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            textAlign: "center",
            color: "white"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h2 style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "1.5rem", fontFamily: "var(--font-h)" }}>
                    {settings.shopnow_title || "Ready to Taste Tradition?"}
                </h2>
                <p style={{ fontSize: "1.4rem", marginBottom: "3rem", opacity: "0.9" }}>
                    {settings.shopnow_subtitle || "Join the HD Foods family today and bring the authentic flavors of Maharashtra to your home."}
                </p>
                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/products" className="hd-btn-shop" style={{ padding: "1rem 3rem", fontSize: "1.2rem" }}>Shop Now</Link>
                    <Link to="/register" className="hd-btn-shop" style={{
                        padding: "1rem 3rem",
                        fontSize: "1.2rem",
                        background: "transparent",
                        border: "2px solid white",
                        color: "white"
                    }}>Create Account</Link>
                </div>
            </div>
        </section>
    );
}
