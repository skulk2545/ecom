import React from "react";
import { Link } from "react-router-dom";

export default function OurStory() {
    return (
        <main className="page" style={{ padding: "4rem 2rem", background: "#fefce8", color: "#451a03", minHeight: "80vh" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>

                <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem", color: "#78350f", fontFamily: "var(--font-h)", fontWeight: "800" }}>Our Humble Beginnings</h1>
                <p style={{ fontSize: "1.1rem", color: "#92400e", marginBottom: "2.5rem" }}>A journey of taste, tradition, and timeless spices.</p>

                <img
                    src="https://images.unsplash.com/photo-1596662951368-aa1d53000ba9?auto=format&fit=crop&q=80&w=1200"
                    alt="Traditional Indian Spices"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", marginBottom: "3rem" }}
                />

                <div style={{ textAlign: "justify", fontSize: "1.15rem", lineHeight: "1.8", color: "#451a03", background: "#fff", padding: "3rem", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                    <p style={{ marginBottom: "1.5rem" }}>
                        <strong style={{ fontSize: "1.25rem", color: "#78350f" }}>HD Foods and Masale</strong> was born out of a simple, undeniable truth: nothing beats the taste of home.
                        Founded in a small kitchen by passionate culinary artisans, our journey began with authentic Maharashtrian Khakhra
                        and expanded into a beloved collection of traditional spices.
                    </p>

                    <p style={{ marginBottom: "1.5rem" }}>
                        We believe in sourcing the finest raw ingredients, blending them with generations of inherited wisdom,
                        and delivering a taste that evokes nostalgia in every bite. Every packet we seal carries not just spices,
                        but our deep-rooted love for heritage and quality.
                    </p>

                    <p style={{ marginBottom: "0", fontWeight: "600", color: "#92400e", textAlign: "center", fontSize: "1.3rem", marginTop: "2.5rem" }}>
                        "We aim to bring true Maharashtrian flavors to your dining table."
                    </p>
                </div>

                <img
                    src="https://images.unsplash.com/photo-1615486171431-7bcbfba6dd18?auto=format&fit=crop&q=80&w=1200"
                    alt="Cooking with love"
                    style={{ width: "100%", height: "350px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", marginTop: "3rem" }}
                />

                <div style={{ marginTop: "3.5rem" }}>
                    <Link to="/products" className="btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem", borderRadius: "var(--r-md)", display: "inline-block" }}>
                        Explore Our Products
                    </Link>
                </div>
            </div>
        </main>
    );
}
