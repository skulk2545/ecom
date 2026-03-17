import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useSettings } from "../state/SettingsContext.jsx";

const API_BASE = "http://localhost:8000";

const STATUS_FLOW = ["pending", "shipped", "delivered"];

const STATUS_COLOR = {
  pending: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  shipped: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  delivered: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  cancelled: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 999,
      fontSize: ".73rem", fontWeight: 700, letterSpacing: ".3px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", stock: "", discount: "", image_url: "",
  });

  const { settings, updateLandingPageSettings } = useSettings();
  const [landingForm, setLandingForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    story_title: "",
    story_paragraph1: "",
    story_paragraph2: "",
    story_image_url: "",
    shopnow_title: "",
    shopnow_subtitle: "",
    shopnow_image_url: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // Inline discount editor
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountVal, setDiscountVal] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes, pRes] = await Promise.all([
        api.get("/users/stats"),
        api.get("/orders"),
        api.get("/products"),
      ]);
      setStats(sRes.data);
      setOrders(oRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (settings) {
      setLandingForm({
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        hero_image_url: settings.hero_image_url || "",
        story_title: settings.story_title || "",
        story_paragraph1: settings.story_paragraph1 || "",
        story_paragraph2: settings.story_paragraph2 || "",
        story_image_url: settings.story_image_url || "",
        shopnow_title: settings.shopnow_title || "",
        shopnow_subtitle: settings.shopnow_subtitle || "",
        shopnow_image_url: settings.shopnow_image_url || "",
      });
    }
  }, [settings]);

  const updateOrderStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, null, { params: { status_value: status } });
    loadData();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products", {
        name: newProduct.name,
        description: newProduct.description || "No description",
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        discount: newProduct.discount ? parseFloat(newProduct.discount) : 0,
        image_url: newProduct.image_url || null,
      });
      setNewProduct({ name: "", description: "", price: "", stock: "", discount: "", image_url: "" });
      setSuccessMsg("Product added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/products/${id}`);
    loadData();
  };

  const handleSaveDiscount = async (id) => {
    await api.patch(`/products/${id}/discount`, null, { params: { discount: parseFloat(discountVal) } });
    setEditingDiscount(null);
    setDiscountVal("");
    loadData();
  };

  const handleUpdateLanding = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateLandingPageSettings(landingForm);
      setSuccessMsg("Landing page updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock, 10),
        discount: parseFloat(editingProduct.discount || 0),
        image_url: editingProduct.image_url
      });
      setSuccessMsg("Product updated successfully!");
      setEditingProduct(null);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProductImage = async (productId, imageUrl) => {
    try {
      await api.patch(`/products/${productId}`, { image_url: imageUrl });
      setSuccessMsg("Product image updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const TABS = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "products", icon: "🛒", label: "Products" },
    { id: "landing", icon: "🏠", label: "Landing Page" },
  ];

  const statCards = stats ? [
    { icon: "💰", label: "Total Revenue", value: `₹${Number(stats.total_revenue).toFixed(0)}`, color: "#22c55e", bg: "#f0fdf4" },
    { icon: "📦", label: "Total Orders", value: stats.total_orders, color: "#3b82f6", bg: "#eff6ff" },
    { icon: "🛒", label: "Active Products", value: stats.active_products, color: "#f97316", bg: "#fff7ed" },
    { icon: "👥", label: "Registered Users", value: stats.total_users ?? "—", color: "#a855f7", bg: "#faf5ff" },
  ] : [];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 62px)", background: "#f8faf8", fontFamily: "var(--font-body)" }}>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside style={{
        width: 240, minWidth: 240,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column",
        padding: "2rem 1rem",
        gap: ".35rem",
      }}>
        {/* Admin identity */}
        <div style={{ marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", marginBottom: ".6rem", color: "#fff",
          }}>
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={{ fontWeight: 700, fontSize: ".9rem", color: "#111827" }}>{user?.name}</div>
          <div style={{ fontSize: ".75rem", color: "#9ca3af", marginTop: ".15rem" }}>Administrator</div>
        </div>

        <p style={{ fontSize: ".68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1.5px", padding: "0 .5rem", marginBottom: ".25rem" }}>
          Menu
        </p>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: ".65rem",
              padding: ".7rem .85rem",
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: activeTab === t.id ? "#bbf7d0" : "transparent",
              background: activeTab === t.id ? "#f0fdf4" : "transparent",
              color: activeTab === t.id ? "#15803d" : "#4b5563",
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: ".88rem",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              fontFamily: "var(--font-body)",
              transition: "all .18s",
            }}
          >
            <span style={{ fontSize: "1rem" }}>{t.icon}</span>
            {t.label}
          </button>
        ))}

        {/* Spacer + Logout */}
        <div style={{ flex: 1 }} />
        <button
          onClick={logout}
          style={{
            display: "flex", alignItems: "center", gap: ".65rem",
            padding: ".7rem .85rem",
            borderRadius: 10, border: "1.5px solid #fecaca",
            background: "#fef2f2", color: "#dc2626",
            fontSize: ".85rem", fontWeight: 600,
            cursor: "pointer", width: "100%", textAlign: "left",
            fontFamily: "var(--font-body)",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main style={{ flex: 1, padding: "2.5rem", overflowY: "auto", maxHeight: "calc(100vh - 62px)" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af", fontSize: "1rem" }}>
            Loading data…
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {!loading && activeTab === "overview" && stats && (
          <>
            <PageHeader title="Dashboard Overview" subtitle={`Welcome back, ${user?.name?.split(" ")[0]}! Here's what's happening today.`} />

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {statCards.map((s) => (
                <div key={s.label} style={{
                  background: "#fff", border: "1.5px solid #f3f4f6",
                  borderRadius: 16, padding: "1.4rem 1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                  transition: "box-shadow .2s, transform .2s",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.06)"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "1rem" }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-h)", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: ".8rem", color: "#6b7280", fontWeight: 600, marginTop: ".35rem" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders table */}
            <SectionCard title="📦 Recent Orders" action={<button onClick={() => setActiveTab("orders")} style={linkBtnStyle}>View All →</button>}>
              <OrdersTable orders={orders.slice(0, 5)} onUpdateStatus={updateOrderStatus} />
            </SectionCard>
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {!loading && activeTab === "orders" && (
          <>
            <PageHeader title="Manage Orders" subtitle={`${orders.length} total orders`} />
            <SectionCard title="All Orders">
              <OrdersTable orders={orders} onUpdateStatus={updateOrderStatus} />
            </SectionCard>
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {!loading && activeTab === "products" && (
          <>
            {/* Edit Product Form (Overlay/Modal style) */}
            {editingProduct && (
              <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.5)", zIndex: 9999,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
              }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Edit Product: {editingProduct.name}</h2>
                    <button onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
                  </div>

                  <form onSubmit={handleUpdateProduct}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      <FormField label="Product Name">
                        <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                      </FormField>
                      <FormField label="Price (₹)">
                        <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                      </FormField>
                      <FormField label="Stock">
                        <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                      </FormField>
                      <FormField label="Discount (%)">
                        <input type="number" value={editingProduct.discount} onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })} />
                      </FormField>
                      <div style={{ gridColumn: "span 2" }}>
                        <FormField label="Description">
                          <textarea rows={3} value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            style={{ padding: ".75rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: ".9rem" }}
                          />
                        </FormField>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <FormField label="Product Image">
                          <ImageUploadField
                            currentValue={editingProduct.image_url}
                            onUploadSuccess={(url) => setEditingProduct({ ...editingProduct, image_url: url })}
                          />
                        </FormField>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                      <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, padding: ".8rem" }}>
                        {submitting ? "Saving..." : "Save Changes"}
                      </button>
                      <button type="button" onClick={() => setEditingProduct(null)}
                        style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <PageHeader title="Manage Products" subtitle={`${products.length} products in catalogue`} />

            {/* Add Product Form */}
            <SectionCard title="➕ Add New Product" style={{ marginBottom: "1.75rem" }}>
              {successMsg && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: ".65rem 1rem", borderRadius: 8, marginBottom: "1rem", fontSize: ".88rem", fontWeight: 600 }}>
                  ✅ {successMsg}
                </div>
              )}
              <form onSubmit={handleAddProduct}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <FormField label="Product Name *">
                    <input type="text" placeholder="e.g. Fresh Basmati Rice" required
                      value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                  </FormField>
                  <FormField label="Description">
                    <input type="text" placeholder="Short product description"
                      value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                  </FormField>
                  <FormField label="Price (₹) *">
                    <input type="number" step="0.01" min="0" placeholder="0.00" required
                      value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </FormField>
                  <FormField label="Stock Units *">
                    <input type="number" min="0" placeholder="100" required
                      value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  </FormField>
                  <FormField label="Discount (%)">
                    <input type="number" min="0" max="100" step="0.1" placeholder="0"
                      value={newProduct.discount} onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })} />
                  </FormField>
                  <FormField label="Image URL (or upload and preview below)">
                    <input type="text" placeholder="https://..."
                      value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
                  </FormField>
                  <FormField label="Product Image Preview & Upload">
                    <ImageUploadField
                      currentValue={newProduct.image_url}
                      onUploadSuccess={(url) => setNewProduct({ ...newProduct, image_url: url })}
                      label="Upload New Photo"
                    />
                  </FormField>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".5rem" }}>
                  <button type="submit" className="btn-primary" disabled={submitting}
                    style={{ padding: ".65rem 2rem", borderRadius: 10, fontSize: ".9rem" }}>
                    {submitting ? "Adding…" : "Add Product"}
                  </button>
                </div>
              </form>
            </SectionCard>

            {/* Products table */}
            <SectionCard title="📋 All Products">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Image", "Name", "Price", "Stock", "Discount", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: ".85rem 1rem", textAlign: "left", fontSize: ".72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".8px", background: "#f9fafb", borderBottom: "1.5px solid #f3f4f6", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f9fafb" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={tdStyle}>
                          <img src={p.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=60"}
                            alt={p.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, border: "1px solid #f3f4f6" }}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=60"; }}
                          />
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, color: "#111827", fontSize: ".9rem" }}>{p.name}</span>
                        </td>
                        <td style={tdStyle}><span style={{ fontWeight: 700, color: "#15803d" }}>₹{Number(p.price).toFixed(0)}</span></td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: p.stock > 0 ? "#111827" : "#dc2626" }}>{p.stock}</span>
                        </td>
                        <td style={tdStyle}>
                          {editingDiscount === p.id ? (
                            <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                              <input type="number" min="0" max="100" value={discountVal}
                                onChange={(e) => setDiscountVal(e.target.value)}
                                style={{ width: 65, padding: ".35rem .5rem", fontSize: ".83rem", borderRadius: 6, border: "1.5px solid #22c55e" }}
                                autoFocus
                              />
                              <button onClick={() => handleSaveDiscount(p.id)} style={{ ...iconBtnStyle, background: "#f0fdf4", color: "#15803d" }}>✓</button>
                              <button onClick={() => setEditingDiscount(null)} style={{ ...iconBtnStyle, background: "#fef2f2", color: "#dc2626" }}>✕</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: ".83rem", fontWeight: 600, color: p.discount > 0 ? "#c2410c" : "#9ca3af" }}>
                              {p.discount > 0 ? `-${p.discount}%` : "—"}
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          {p.stock > 0
                            ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: 999, fontSize: ".72rem", fontWeight: 700 }}>In Stock</span>
                            : <span style={{ background: "#fef2f2", color: "#dc2626", padding: "3px 10px", borderRadius: 999, fontSize: ".72rem", fontWeight: 700 }}>Out of Stock</span>
                          }
                        </td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                          <button onClick={() => setEditingProduct(p)}
                            style={{ ...actionBtnStyle, color: "#22c55e", borderColor: "#bbf7d0", background: "#f0fdf4" }}>
                            Edit
                          </button>
                          <button onClick={() => { setEditingDiscount(p.id); setDiscountVal(p.discount || "0"); }}
                            style={{ ...actionBtnStyle, color: "#2563eb", borderColor: "#bfdbfe", background: "#eff6ff", marginLeft: ".5rem" }}>
                            Discount
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)}
                            style={{ ...actionBtnStyle, color: "#dc2626", borderColor: "#fecaca", background: "#fef2f2", marginLeft: ".5rem" }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>No products yet. Add your first one above!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </>
        )}


        {/* ── LANDING PAGE TAB ── */}
        {!loading && activeTab === "landing" && (
          <>
            <PageHeader title="Landing Page Settings" subtitle="Customize titles, text, and images on the main page." />

            <SectionCard title="Edit Landing Page Content">
              {successMsg && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: ".65rem 1rem", borderRadius: 8, marginBottom: "1rem", fontSize: ".88rem", fontWeight: 600 }}>
                  ✅ {successMsg}
                </div>
              )}
              <form onSubmit={handleUpdateLanding}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>

                  <div style={{ padding: "1.5rem", background: "#f9fafb", borderRadius: 12 }}>
                    <h4 style={{ marginBottom: "1rem", color: "#111827", fontSize: ".9rem", fontWeight: 700 }}>Hero Section</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <FormField label="Hero Title (Use \n for new line)">
                        <textarea
                          rows={2}
                          value={landingForm.hero_title}
                          onChange={(e) => setLandingForm({ ...landingForm, hero_title: e.target.value })}
                          placeholder="e.g. HD Foods \n and Masale"
                        />
                      </FormField>
                      <FormField label="Hero Subtitle">
                        <textarea
                          rows={2}
                          value={landingForm.hero_subtitle}
                          onChange={(e) => setLandingForm({ ...landingForm, hero_subtitle: e.target.value })}
                          placeholder="e.g. Authentic Maharashtrian \n Khakhra & Spices"
                        />
                      </FormField>
                      <FormField label="Hero Image Upload & Preview">
                        <ImageUploadField
                          currentValue={landingForm.hero_image_url}
                          onUploadSuccess={(url) => setLandingForm({ ...landingForm, hero_image_url: url })}
                        />
                      </FormField>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem", background: "#f9fafb", borderRadius: 12 }}>
                    <h4 style={{ marginBottom: "1rem", color: "#111827", fontSize: ".9rem", fontWeight: 700 }}>Our Story Section</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                      <FormField label="Story Title">
                        <input type="text" value={landingForm.story_title} onChange={(e) => setLandingForm({ ...landingForm, story_title: e.target.value })} placeholder="Our Humble Beginnings" />
                      </FormField>
                      <FormField label="Story Paragraph 1">
                        <textarea rows={4} value={landingForm.story_paragraph1} onChange={(e) => setLandingForm({ ...landingForm, story_paragraph1: e.target.value })} />
                      </FormField>
                      <FormField label="Story Paragraph 2">
                        <textarea rows={4} value={landingForm.story_paragraph2} onChange={(e) => setLandingForm({ ...landingForm, story_paragraph2: e.target.value })} />
                      </FormField>
                      <FormField label="Story Image Preview & Upload">
                        <ImageUploadField
                          currentValue={landingForm.story_image_url}
                          onUploadSuccess={(url) => setLandingForm({ ...landingForm, story_image_url: url })}
                        />
                      </FormField>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem", background: "#f9fafb", borderRadius: 12 }}>
                    <h4 style={{ marginBottom: "1rem", color: "#111827", fontSize: ".9rem", fontWeight: 700 }}>Shop Now Section</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                      <FormField label="Shop Now Title">
                        <input type="text" value={landingForm.shopnow_title} onChange={(e) => setLandingForm({ ...landingForm, shopnow_title: e.target.value })} placeholder="Ready to Taste Tradition?" />
                      </FormField>
                      <FormField label="Shop Now Subtitle">
                        <textarea rows={3} value={landingForm.shopnow_subtitle} onChange={(e) => setLandingForm({ ...landingForm, shopnow_subtitle: e.target.value })} />
                      </FormField>
                      <FormField label="Shop Now Image Preview & Upload">
                        <ImageUploadField
                          currentValue={landingForm.shopnow_image_url}
                          onUploadSuccess={(url) => setLandingForm({ ...landingForm, shopnow_image_url: url })}
                        />
                      </FormField>
                    </div>
                  </div>

                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                  <button type="submit" className="btn-primary" disabled={submitting}
                    style={{ padding: ".75rem 2.5rem", borderRadius: 10, fontSize: "1rem" }}>
                    {submitting ? "Saving Changes…" : "Save All Changes"}
                  </button>
                </div>
              </form>
            </SectionCard>
          </>
        )}
      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#111827", margin: 0, fontFamily: "var(--font-h)" }}>{title}</h1>
      {subtitle && <p style={{ color: "#9ca3af", fontSize: ".88rem", marginTop: ".3rem" }}>{subtitle}</p>}
    </div>
  );
}

function SectionCard({ title, children, action }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f9fafb" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#111827", fontFamily: "var(--font-h)" }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: ".4rem", fontSize: ".82rem", fontWeight: 600, color: "#374151", marginBottom: 0 }}>
      {label}
      {children}
    </label>
  );
}

function ImageUploadField({ onUploadSuccess, currentValue, label = "Change Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fullUrl = res.data.url.startsWith("http") ? res.data.url : `${API_BASE}${res.data.url}`;
      onUploadSuccess(fullUrl);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {currentValue && (
          <img src={currentValue} alt="Preview"
            style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", border: "1px solid #e5e7eb" }}
          />
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          style={{
            padding: ".5rem 1rem", borderRadius: 8, border: "1.5px solid #e5e7eb",
            background: "#fff", fontSize: ".82rem", fontWeight: 600, color: "#374151",
            cursor: "pointer", transition: "all .2s"
          }}
          onMouseEnter={(e) => e.target.style.borderColor = "#22c55e"}
          onMouseLeave={(e) => e.target.style.borderColor = "#e5e7eb"}
        >
          {uploading ? "Uploading..." : label}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      {error && <span style={{ fontSize: ".7rem", color: "#dc2626" }}>{error}</span>}
    </div>
  );
}

function OrdersTable({ orders, onUpdateStatus }) {
  if (orders.length === 0) return <p style={{ color: "#9ca3af", padding: "2rem 0", textAlign: "center" }}>No orders found.</p>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Order", "Customer", "Total", "Status", "Actions"].map((h) => (
              <th key={h} style={{ padding: ".85rem 1rem", textAlign: "left", fontSize: ".72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".8px", background: "#f9fafb", borderBottom: "1.5px solid #f3f4f6" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderBottom: "1px solid #f9fafb" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <td style={tdStyle}><span style={{ fontWeight: 700, color: "#111827" }}>#{o.id}</span></td>
              <td style={tdStyle}><span style={{ color: "#6b7280", fontSize: ".85rem" }}>User #{o.user_id}</span></td>
              <td style={tdStyle}><span style={{ fontWeight: 700, color: "#15803d" }}>₹{Number(o.total_price).toFixed(0)}</span></td>
              <td style={tdStyle}><StatusBadge status={o.status} /></td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                {STATUS_FLOW.filter((s) => s !== o.status).map((s) => (
                  <button key={s} onClick={() => onUpdateStatus(o.id, s)}
                    style={{
                      ...actionBtnStyle, marginRight: ".4rem",
                      ...(s === "delivered" ? { color: "#15803d", borderColor: "#bbf7d0", background: "#f0fdf4" }
                        : s === "shipped" ? { color: "#1d4ed8", borderColor: "#bfdbfe", background: "#eff6ff" }
                          : { color: "#92400e", borderColor: "#fed7aa", background: "#fff7ed" })
                    }}>
                    → {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Inline style helpers ───────────────────────────────── */
const tdStyle = { padding: ".85rem 1rem", fontSize: ".88rem", color: "#374151", verticalAlign: "middle" };

const actionBtnStyle = {
  padding: ".3rem .8rem", borderRadius: 8, border: "1.5px solid", fontSize: ".78rem",
  fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "opacity .15s",
  background: "transparent",
};

const linkBtnStyle = {
  padding: ".35rem .85rem", borderRadius: 8, border: "1.5px solid #bbf7d0",
  background: "#f0fdf4", color: "#15803d", fontSize: ".8rem", fontWeight: 700,
  cursor: "pointer", fontFamily: "var(--font-body)",
};

const iconBtnStyle = {
  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: 6, border: "none", cursor: "pointer", fontSize: ".85rem", fontWeight: 700,
  fontFamily: "var(--font-body)",
};
