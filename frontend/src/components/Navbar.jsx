import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useCart } from "../state/CartContext.jsx";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="navbar hd-navbar">
      {/* Logo */}
      <Link to={user ? "/products" : "/"} className="hd-logo">
        HD Foods and Masale
      </Link>

      {/* Nav Links */}
      <nav className="nav-links hd-nav-links">
        {!isAdmin && (
          <>
            {!user && <NavLink to="/" end>Home</NavLink>}
            <NavLink to="/about">Our Story</NavLink>
            <NavLink to="/products">Our Products</NavLink>
            {user && <NavLink to="/orders">My Orders</NavLink>}
          </>
        )}
        {isAdmin && (
          <NavLink to="/admin" end>Dashboard</NavLink>
        )}
      </nav>

      {/* Actions */}
      <div className="nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {user ? (
          <>
            <span className="nav-user" style={{ fontSize: "0.9rem", fontWeight: "600", color: "#451a03" }}>👋 {user.name}</span>
            {!isAdmin && (
              <NavLink to="/cart" className="nav-icon-btn" title="Cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: "1.2rem" }}>🛒</span>
                {cartCount > 0 && <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>{cartCount}</span>}
              </NavLink>
            )}
            <button onClick={logout} className="btn-outline" style={{ padding: ".45rem 1.1rem", fontSize: ".85rem", borderRadius: "100px", border: "1.5px solid #78350f", color: "#78350f", cursor: "pointer", background: "transparent" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn-outline" style={{ padding: ".45rem 1.2rem", fontSize: ".85rem", borderRadius: "100px", border: "1.5px solid #78350f", color: "#78350f", textDecoration: "none", fontWeight: "600" }}>Login</NavLink>
            <NavLink to="/register" className="btn-primary" style={{ padding: ".5rem 1.2rem", fontSize: ".85rem", borderRadius: "100px", background: "#78350f", color: "#fef3c7", textDecoration: "none", fontWeight: "600" }}>Sign Up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
