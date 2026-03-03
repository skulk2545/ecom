import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";

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

  const TABS = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "products", icon: "🛒", label: "Products" },
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
                  <FormField label="Image URL">
                    <input type="text" placeholder="https://..."
                      value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
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
                      {["#", "Product", "Price", "Stock", "Discount", "Status", "Actions"].map((h) => (
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
                        <td style={tdStyle}><span style={{ color: "#d1d5db", fontSize: ".8rem" }}>#{p.id}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                            <img src={p.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=60"}
                              alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <span style={{ fontWeight: 600, color: "#111827", fontSize: ".88rem" }}>{p.name}</span>
                          </div>
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
                          <button onClick={() => { setEditingDiscount(p.id); setDiscountVal(p.discount || "0"); }}
                            style={{ ...actionBtnStyle, color: "#2563eb", borderColor: "#bfdbfe", background: "#eff6ff" }}>
                            Set Discount
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
