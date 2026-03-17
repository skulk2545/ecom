import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../state/SettingsContext.jsx";

export default function StorySection() {
    const { settings } = useSettings();
    return (
        <section id="our-story" style={{ padding: "6rem 2rem", background: "#fefce8", color: "#451a03" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "4rem", alignItems: "center" }}>
                <div>
                    <img
                        src={settings.story_image_url || "https://images.unsplash.com/photo-1596662951368-aa1d53000ba9?auto=format&fit=crop&q=80&w=800"}
                        alt="Traditional Indian Spices"
                        style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                    />
                </div>
                <div>
                    <h2 style={{ fontSize: "2.8rem", marginBottom: "1.5rem", color: "#78350f", fontFamily: "var(--font-h)", fontWeight: "800" }}>
                        {settings.story_title || "Our Humble Beginnings"}
                    </h2>
                    <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "2rem", color: "#451a03" }}>
                        {settings.story_paragraph1 ? (
                            <span dangerouslySetInnerHTML={{ __html: settings.story_paragraph1.replace(/\n/g, '<br />') }} />
                        ) : (
                            <>
                                <strong style={{ color: "#78350f" }}>HD Foods and Masale</strong> was born out of a simple, undeniable truth: nothing beats the taste of home.
                                Founded in a small kitchen by passionate culinary artisans, our journey began with authentic Maharashtrian Khakhra
                                and expanded into a beloved collection of traditional spices.
                            </>
                        )}
                    </p>
                    <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "2.5rem", color: "#451a03" }}>
                        {settings.story_paragraph2 ? (
                            <span dangerouslySetInnerHTML={{ __html: settings.story_paragraph2.replace(/\n/g, '<br />') }} />
                        ) : (
                            <>
                                We believe in sourcing the finest raw ingredients, blending them with generations of inherited wisdom,
                                and delivering a taste that evokes nostalgia in every bite.
                            </>
                        )}
                    </p>
                    <Link to="/about" className="hd-btn-shop">Read Our Full Story</Link>
                </div>
            </div>
        </section>
    );
}
