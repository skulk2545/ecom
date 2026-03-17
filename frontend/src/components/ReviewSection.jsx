import React from "react";

const REVIEWS = [
    {
        id: 1,
        name: "Sneha Kulkarni",
        location: "Pune, Maharashtra",
        rating: 5,
        text: "The Khakhra from HD Foods is exactly like the ones my grandmother used to make. Perfectly crisp and full of authentic flavors!",
        avatar: "https://i.pravatar.cc/150?u=sneha"
    },
    {
        id: 2,
        name: "Rahul Deshpande",
        location: "Mumbai, Maharashtra",
        rating: 5,
        text: "I've tried many brands, but the spices here are on another level. The aroma is so fresh. Highly recommend the Garlic Khakhra!",
        avatar: "https://i.pravatar.cc/150?u=rahul"
    },
    {
        id: 3,
        name: "Priya Patil",
        location: "Nashik, Maharashtra",
        rating: 4,
        text: "Great quality and fast delivery. The Methi Khakhra is my favorite tea-time snack now. Authentic Maharashtrian taste!",
        avatar: "https://i.pravatar.cc/150?u=priya"
    }
];

export default function ReviewSection() {
    return (
        <section className="hd-reviews" style={{ padding: "5rem 2rem", background: "#fdfaf6", textAlign: "center" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ fontSize: "2.5rem", color: "#3a200d", fontFamily: "var(--font-h)", marginBottom: "1rem" }}>What Our Customers Say</h2>
                <p style={{ color: "#5a4030", marginBottom: "3rem", fontSize: "1.1rem" }}>Trusted by thousands of families across Maharashtra.</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    {REVIEWS.map((review) => (
                        <div key={review.id} style={{
                            background: "white",
                            padding: "2.5rem",
                            borderRadius: "20px",
                            boxShadow: "0 10px 30px rgba(139, 69, 19, 0.08)",
                            textAlign: "left",
                            border: "1px solid #eee5d8",
                            transition: "transform 0.3s ease"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                                <img src={review.avatar} alt={review.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                                <div>
                                    <h4 style={{ margin: 0, color: "#3a200d", fontWeight: "700" }}>{review.name}</h4>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400e" }}>{review.location}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: i < review.rating ? "#b85e28" : "#d1d5db" }}>★</span>
                                ))}
                            </div>
                            <p style={{ color: "#451a03", lineHeight: "1.6", fontStyle: "italic" }}>"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
