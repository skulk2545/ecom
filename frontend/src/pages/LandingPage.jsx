import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import ProductSection from "../components/ProductSection.jsx";
import StorySection from "../components/StorySection.jsx";
import ReviewSection from "../components/ReviewSection.jsx";
import ShopNowSection from "../components/ShopNowSection.jsx";
import { useSettings } from "../state/SettingsContext.jsx";

export default function LandingPage() {
    const { user } = useAuth();
    const { settings } = useSettings();

    return (
        <main className="hd-landing">

            {/* 1. Landing Page (Hero) */}
            <section className="hd-hero" style={settings.hero_image_url ? { backgroundImage: `url(${settings.hero_image_url})` } : {}}>
                <div className="hd-hero-overlay"></div>
                <div className="hd-hero-content">
                    <h1 className="hd-hero-title">
                        {settings.hero_title ? (
                            <span dangerouslySetInnerHTML={{ __html: `<span className="hd-hero-quote">'</span>${settings.hero_title.replace(/\n/g, '<br />')}` }} />
                        ) : (
                            <>
                                <span className="hd-hero-quote">'</span>HD Foods<br />and Masale
                            </>
                        )}
                    </h1>
                    <p className="hd-hero-subtitle">
                        {settings.hero_subtitle ? (
                            <span dangerouslySetInnerHTML={{ __html: settings.hero_subtitle.replace(/\n/g, '<br />') }} />
                        ) : (
                            <>Authentic Maharashtrian<br />Khakhra &amp; Spices</>
                        )}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                        {!user ? (
                            <>
                                <Link to="/login" className="hd-btn-shop">Login</Link>
                                <Link to="/register" className="hd-btn-shop" style={{ background: "transparent", color: "#fef3c7", border: "2px solid #fef3c7" }}>Sign Up</Link>
                            </>
                        ) : (
                            <Link to="/products" className="hd-btn-shop">Explore Products</Link>
                        )}
                        <a href="#products-section" className="hd-btn-shop" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.3)" }}>View Menu</a>
                    </div>
                </div>
            </section>

            {/* 2. Products Display */}
            <ProductSection />

            {/* 3. Our Story */}
            <StorySection />

            {/* 4. Review Section */}
            <ReviewSection />

            {/* 5. Shop Now Section */}
            <ShopNowSection />

            {/* Optional Bottom Band / Footer Linkage */}
            {!user && (
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
            )}

        </main>
    );
}
