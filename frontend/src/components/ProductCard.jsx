import React from "react";
import { useCart } from "../state/CartContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const price = Number(product.price);
  const discount = product.discount || 0;
  const hasDiscount = discount > 0;
  const effective = price * (1 - discount / 100);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-image-wrap">
        <img
          src={product.image_url || FALLBACK}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        {hasDiscount && !isOutOfStock && (
          <span className="product-badge sale">-{discount}% OFF</span>
        )}
        {isOutOfStock && (
          <span className="product-badge sold">Sold Out</span>
        )}
        {!hasDiscount && !isOutOfStock && product.is_new && (
          <span className="product-badge new">New</span>
        )}
      </div>

      {/* Content */}
      <div className="product-content">
        <h3>{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-pricing">
          {hasDiscount ? (
            <>
              <span className="price-discounted">₹{effective.toFixed(0)}</span>
              <span className="price-original">₹{price.toFixed(0)}</span>
              <span className="price-badge">-{discount}%</span>
            </>
          ) : (
            <span className="price-normal">₹{price.toFixed(0)}</span>
          )}
        </div>

        <button
          className="btn-add"
          onClick={handleAddToCart}
          disabled={isOutOfStock && user}
        >
          {isOutOfStock ? "Out of Stock" : (!user ? "Login to Buy" : "🛒 Add to Cart")}
        </button>
      </div>
    </div>
  );
}
