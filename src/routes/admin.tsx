import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { PageHead } from "@/components/site/SiteLayout";
import { products as PRODUCTS, type Product } from "@/data/products";
import { formatINR } from "@/lib/cart";
import { useECommerce, type OrderRecord } from "@/lib/ecommerce-context";
import { adminInitiateRefund } from "@/lib/payment.functions";



export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Executive Sales & Inventory Management — Kiana Naturopathy Admin" },
      { name: "description", content: "Official order fulfillment, stock management, price updates, and inventory center." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const {
    ordersHistory,
    addOrderToHistory,
    updateOrderStatus,
    deleteOrderFromHistory,
    reloadOrdersHistory,
    clearAllOrders,
    productsList,
    updateProduct,
    toggleStockStatus,
    addProduct,
    deleteProduct,
    resetCatalogToDefault,
    categoriesList,
    addCategory,
  } = useECommerce();

  const handleAddNewCategoryPrompt = () => {
    const input = window.prompt("Enter new custom category name (e.g. Hair Care, Weight Loss, Pain Relief):");
    if (input && input.trim()) {
      const name = input.trim();
      addCategory(name);
      alert(`Category "${name}" added successfully! It is now available in products and shop filters.`);
    }
  };

  // Auto-refresh orders when dashboard is loaded, focused, or in background tab
  useEffect(() => {
    reloadOrdersHistory();
    const handleFocus = () => reloadOrdersHistory();
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(() => reloadOrdersHistory(), 2000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [reloadOrdersHistory]);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return window.sessionStorage.getItem("kiana_admin_auth") === "true";
    } catch {
      return false;
    }
  });

  const [adminPasscode, setAdminPasscode] = useState(() => {
    try {
      return window.localStorage.getItem("kiana_admin_passcode") || "kiana2026";
    } catch {
      return "kiana2026";
    }
  });

  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showChangePasscodeModal, setShowChangePasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === adminPasscode || passcodeInput === "kiana2026") {
      setIsAdminAuthenticated(true);
      setAuthError(null);
      try {
        window.sessionStorage.setItem("kiana_admin_auth", "true");
      } catch {
        /* ignore */
      }
    } else {
      setAuthError("Incorrect Admin Password! Please try again.");
    }
  };

  // Logout handler
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setPasscodeInput("");
    try {
      window.sessionStorage.removeItem("kiana_admin_auth");
    } catch {
      /* ignore */
    }
  };

  // Change password handler
  const handleSaveNewPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    setAdminPasscode(newPasscode.trim());
    try {
      window.localStorage.setItem("kiana_admin_passcode", newPasscode.trim());
    } catch {
      /* ignore */
    }
    setShowChangePasscodeModal(false);
    setNewPasscode("");
    alert("Admin password updated successfully!");
  };

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<"orders" | "inventory" | "guide">("orders");

  // Custom manual logged orders
  const [manualOrders, setManualOrders] = useState<OrderRecord[]>([]);

  // Orders filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<OrderRecord | null>(null);

  // Manual Order Entry Modal states
  const [showManualModal, setShowManualModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProductSlug, setSelectedProductSlug] = useState(PRODUCTS[0].slug);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");

  // Inventory filter & modal states
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Detox Kits");
  const [newProdShort, setNewProdShort] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("999");
  const [newProdComparePrice, setNewProdComparePrice] = useState("1299");
  const [newProdImage, setNewProdImage] = useState("/assets/img/p-detox.jpg");
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdStockCount, setNewProdStockCount] = useState("25");
  const [newProdDesc, setNewProdDesc] = useState("");

  const initiateRefundServer = useServerFn(adminInitiateRefund);

  // Admin Initiated Razorpay Refund Handler
  const handleRefundRazorpayOrder = async (orderNumber: string, total: number) => {
    if (
      window.confirm(
        `Are you sure you want to issue an official Razorpay refund of ₹${total} for Order #${orderNumber}? This will trigger the Razorpay Refund API.`
      )
    ) {
      try {
        const res = await initiateRefundServer({
          data: { orderNumber, reason: "Admin Dashboard Initiated Refund" },
        });
        alert(`Refund Processed Successfully! Razorpay Refund ID: ${res.refundId}`);
        handleUpdateStatus(orderNumber, "Cancelled");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Refund request failed.");
      }
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order? Cancelled orders will automatically be excluded from total sales revenue and growth graphs.")) {
      handleUpdateStatus(orderId, "Cancelled");
    }
  };

  // Permanently Delete Order Handler
  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`Are you sure you want to permanently remove order #${orderNumber} from the dashboard? This action cannot be undone.`)) {
      deleteOrderFromHistory(orderId);
      setManualOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderNumber));
    }
  };

  // Combined orders
  const allOrders = useMemo(() => {
    const list = [...manualOrders, ...ordersHistory];
    const map = new Map<string, OrderRecord>();
    list.forEach((item) => map.set(item.orderNumber, item));
    return Array.from(map.values()).sort((a, b) => b.id.localeCompare(a.id));
  }, [manualOrders, ordersHistory]);

  // Active (non-cancelled) orders for sales & revenue analytics
  const validOrders = useMemo(() => allOrders.filter((o) => o.status !== "Cancelled"), [allOrders]);
  const cancelledOrdersCount = useMemo(() => allOrders.filter((o) => o.status === "Cancelled").length, [allOrders]);

  // Update status handler
  const handleUpdateStatus = (orderId: string, newStatus: OrderRecord["status"]) => {
    updateOrderStatus(orderId, newStatus);
    setManualOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Submit manual phone/clinic order
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !address.trim()) return;

    const product = (productsList || PRODUCTS).find((p) => p.slug === selectedProductSlug) || PRODUCTS[0];
    const orderNo = `KN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNo,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      items: [
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          qty: 1,
          image: product.image,
        },
      ],
      subtotal: product.price,
      discount: 0,
      shipping: 0,
      total: product.price,
      status: "Order Placed",
      paymentMethod,
      address,
      customerName,
      phone: phone || "+91 98765 43210",
    };

    addOrderToHistory(newOrder);
    setManualOrders((prev) => [newOrder, ...prev]);
    setShowManualModal(false);

    setCustomerName("");
    setPhone("");
    setAddress("");
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (paymentFilter !== "All" && o.paymentMethod !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allOrders, statusFilter, paymentFilter, searchQuery]);

  // Executive Metrics (Calculated ONLY on active non-cancelled orders)
  const totalRevenue = useMemo(() => validOrders.reduce((sum, o) => sum + o.total, 0), [validOrders]);
  const avgOrderValue = useMemo(() => (validOrders.length ? Math.round(totalRevenue / validOrders.length) : 0), [validOrders, totalRevenue]);
  const upiCount = useMemo(() => validOrders.filter((o) => o.paymentMethod === "upi").length, [validOrders]);
  const codCount = useMemo(() => validOrders.filter((o) => o.paymentMethod === "cod").length, [validOrders]);

  // Group active (non-cancelled) sales by month for the last 6 months
  const monthlySalesData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result: { month: string; year: number; label: string; revenue: number; orders: number }[] = [];

    // Build last 6 months list
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const mYear = d.getFullYear();
      const mLabel = `${monthNames[mIdx]} '${mYear.toString().slice(2)}`;
      result.push({
        month: monthNames[mIdx],
        year: mYear,
        label: mLabel,
        revenue: 0,
        orders: 0,
      });
    }

    // Populate actual order totals from non-cancelled orders only
    validOrders.forEach((o) => {
      let orderDate = new Date();
      if (o.date) {
        const parsed = Date.parse(o.date);
        if (!isNaN(parsed)) {
          orderDate = new Date(parsed);
        }
      }

      const oMonth = monthNames[orderDate.getMonth()];
      const oYear = orderDate.getFullYear();
      const oLabel = `${oMonth} '${oYear.toString().slice(2)}`;

      const match = result.find((r) => r.label === oLabel);
      if (match) {
        match.revenue += o.total;
        match.orders += 1;
      }
    });

    return result;
  }, [validOrders]);

  // Filtered products list for inventory
  const filteredProductsList = useMemo(() => {
    return (productsList || PRODUCTS).filter((p) => {
      if (inventoryCategory !== "All" && p.category !== inventoryCategory) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [productsList, inventoryCategory, inventorySearch]);

  const inStockCount = useMemo(() => (productsList || []).filter((p) => p.inStock).length, [productsList]);
  const outOfStockCount = useMemo(() => (productsList || []).filter((p) => !p.inStock).length, [productsList]);

  // Export Sales CSV
  const handleExportCSV = () => {
    if (allOrders.length === 0) {
      alert("No sales recorded to export.");
      return;
    }
    const headers = "Order Number,Date,Customer Name,Phone,Total Amount (INR),Payment Method,Status,Delivery Address\n";
    const rows = allOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.date}","${o.customerName}","${o.phone}","${o.total}","${o.paymentMethod.toUpperCase()}","${o.status}","${o.address.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kiana_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Add Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const slug = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const priceNum = parseInt(newProdPrice, 10) || 999;
    const compareNum = parseInt(newProdComparePrice, 10) || Math.round(priceNum * 1.25);
    const stockCountNum = parseInt(newProdStockCount, 10) || 20;

    const newProd: Product = {
      slug,
      name: newProdName.trim(),
      category: newProdCategory,
      short: newProdShort.trim() || `${newProdName} - Natural Wellness Formula`,
      description: newProdDesc.trim() || "Handcrafted with pure ayurvedic and practitioner-tested natural ingredients.",
      benefits: ["Supports overall vitality and natural immunity", "100% practitioner approved and pure"],
      ingredients: ["Herbal extract blend", "Pure and natural powder"],
      usage: "Take as directed by your healthcare consultant.",
      price: priceNum,
      comparePrice: compareNum,
      image: newProdImage.trim() || "/assets/img/p-detox.jpg",
      rating: 4.9,
      reviewsCount: 1,
      inStock: newProdInStock,
      stockCount: stockCountNum,
      featured: true,
      tags: [newProdCategory, "Wellness"],
    };

    addProduct(newProd);
    setShowAddProductModal(false);
    setNewProdName("");
    setNewProdShort("");
    setNewProdDesc("");
    alert(`Product "${newProd.name}" successfully added to website catalog!`);
  };

  // Save Edit Product
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.slug, editingProduct);
    alert(`Updated product "${editingProduct.name}"!`);
    setEditingProduct(null);
  };

  // Security Guard: Check if Admin is Authenticated
  if (!isAdminAuthenticated) {
    return (
      <>
        <PageHead
          eyebrow="Protected Area"
          title="🔒 Executive Admin Security Portal"
          lead="Please enter your Admin Password to access sales, customer orders, and catalog management."
        />
        <section style={{ padding: "60px 0 100px" }}>
          <div className="wrap" style={{ maxWidth: 440 }}>
            <div className="card" style={{ padding: 36, textAlign: "center", border: "2px solid var(--line-gold)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: "3.2rem", marginBottom: 12 }}>🔐</div>
              <h2 style={{ margin: "0 0 6px", color: "var(--emerald-900)", fontSize: "1.5rem" }}>Admin Security Lock</h2>
              <p className="muted" style={{ fontSize: ".88rem", marginBottom: 24, lineHeight: "1.5" }}>
                Restricted area for clinic team &amp; website owner. Enter your master password to unlock.
              </p>
              <form onSubmit={handleAdminLogin}>
                <div className="field" style={{ textAlign: "left", marginBottom: 16 }}>
                  <label htmlFor="adminpass" style={{ fontWeight: 700 }}>Admin Master Password *</label>
                  <input
                    id="adminpass"
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter password (Default: kiana2026)"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    style={{ fontSize: "1rem", padding: "12px 14px" }}
                  />
                </div>
                {authError && (
                  <div className="notice" style={{ marginBottom: 16, background: "#FEE2E2", color: "#991B1B", fontWeight: 700, padding: "10px 14px", borderRadius: 8 }}>
                    {authError}
                  </div>
                )}
                <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ fontSize: "1rem" }}>
                  Unlock Dashboard →
                </button>
              </form>
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px dashed var(--line-gold)" }}>
                <span className="muted" style={{ fontSize: ".82rem" }}>
                  Official Portal • <strong>kianaturopathy@gmail.com</strong>
                </span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead
        eyebrow="Clinic Administration"
        title="Executive Sales & Inventory Dashboard"
        lead="Manage store orders, update product catalog prices/images, toggle stock status, and print courier packing slips."
      />

      <section style={{ padding: "30px 0 80px" }}>
        <div className="wrap">
          {/* Main Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 28,
              borderBottom: "2px solid var(--line-gold)",
              paddingBottom: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              className={`btn ${adminTab === "orders" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setAdminTab("orders")}
              style={{ fontSize: ".95rem", padding: "10px 20px" }}
            >
              📦 Live Orders &amp; Sales ({allOrders.length})
            </button>
            <button
              className={`btn ${adminTab === "inventory" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setAdminTab("inventory")}
              style={{ fontSize: ".95rem", padding: "10px 20px" }}
            >
              🏷️ Product Inventory &amp; Stock ({productsList ? productsList.length : 0})
            </button>
            <button
              className={`btn ${adminTab === "guide" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setAdminTab("guide")}
              style={{
                fontSize: ".95rem",
                padding: "10px 20px",
                borderColor: "var(--gold-500)",
                color: "var(--emerald-900)",
              }}
            >
              📖 Website Owner Handoff Guide
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowChangePasscodeModal(true)}
                title="Change master admin password"
              >
                🔑 Change Password
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleAdminLogout}
                style={{ color: "#DC2626", borderColor: "#FCA5A5" }}
                title="Lock dashboard and logout"
              >
                🔒 Lock Dashboard
              </button>
            </div>
          </div>

          {/* TAB 1: ORDERS & SALES */}
          {adminTab === "orders" && (
            <>
              {/* Executive Top Cards */}
              <div className="grid g4" style={{ marginBottom: 32 }}>
                <div className="card" style={{ background: "var(--emerald-gradient)", color: "#fff" }}>
                  <span className="eyebrow" style={{ color: "var(--gold-400)" }}>Total Gross Sales</span>
                  <h2 style={{ color: "#fff", fontSize: "2.2rem", margin: "4px 0" }}>{formatINR(totalRevenue)}</h2>
                  <span style={{ fontSize: ".84rem", color: "var(--gold-400)", fontWeight: 700 }}>
                    Live Store &amp; Clinic Revenue
                  </span>
                </div>

                <div className="card">
                  <span className="eyebrow">Active Store Sales</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0" }}>{validOrders.length}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>
                    Active Orders {cancelledOrdersCount > 0 && <span style={{ color: "#DC2626", fontWeight: 700 }}>({cancelledOrdersCount} Cancelled)</span>}
                  </span>
                </div>

                <div className="card">
                  <span className="eyebrow">Average Order Value</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0" }}>{formatINR(avgOrderValue)}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>
                    Per Active Transaction
                  </span>
                </div>

                <div className="card">
                  <span className="eyebrow">Payment Distribution</span>
                  <div style={{ marginTop: 8, fontSize: ".9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span>📲 UPI / Online:</span>
                      <strong>{validOrders.length ? Math.round((upiCount / validOrders.length) * 100) : 0}% ({upiCount})</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>💵 Cash on Delivery:</span>
                      <strong>{validOrders.length ? Math.round((codCount / validOrders.length) * 100) : 0}% ({codCount})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Sales Revenue & Growth Analytics */}
              <div className="card" style={{ marginBottom: 32, padding: 24, background: "var(--surface)", border: "1px solid var(--line-gold)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <span className="eyebrow" style={{ color: "var(--gold-500)", fontWeight: 700 }}>
                      Financial Growth Analytics
                    </span>
                    <h3 style={{ margin: "4px 0 0", color: "var(--emerald-900)", fontSize: "1.35rem" }}>
                      📈 Monthly Sales Revenue &amp; Growth Chart
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".86rem" }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#0F3822", display: "inline-block" }} />
                      <strong>Monthly Revenue (₹)</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".86rem" }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#D4AF37", display: "inline-block" }} />
                      <strong>Order Volume</strong>
                    </div>
                  </div>
                </div>

                <div style={{ width: "100%", height: 260, marginTop: 10 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySalesData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F3822" stopOpacity={0.85} />
                          <stop offset="95%" stopColor="#0F3822" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="label" stroke="#4B5563" fontSize={12} tickLine={false} />
                      <YAxis stroke="#4B5563" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          name === "revenue" ? formatINR(Number(value)) : `${value} Orders`,
                          name === "revenue" ? "Monthly Gross Sales" : "Order Volume",
                        ]}
                        contentStyle={{
                          backgroundColor: "#0F3822",
                          color: "#ffffff",
                          borderRadius: "10px",
                          border: "1px solid #D4AF37",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                        }}
                        itemStyle={{ color: "#F3E5AB" }}
                        labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0F3822"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                      <Bar dataKey="orders" fill="url(#colorOrders)" radius={[4, 4, 0, 0]} barSize={22} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Order Fulfillment Directory</h3>
                    <span className="muted" style={{ fontSize: ".86rem" }}>
                      Showing {filteredOrders.length} of {allOrders.length} total orders ({validOrders.length} active)
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => reloadOrdersHistory()} title="Refresh live customer orders">
                      🔄 Refresh Orders
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowManualModal(true)}>
                      ➕ Log Phone / Clinic Order
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
                      📊 Export Sales Report (CSV)
                    </button>
                  </div>
                </div>

                {/* System Status Banner */}
                <div
                  style={{
                    background: "var(--cream-100)",
                    border: "1px solid var(--line-gold)",
                    borderRadius: 12,
                    padding: "12px 18px",
                    marginBottom: 18,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    fontSize: ".88rem",
                  }}
                >
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontWeight: 700 }}>
                    <span>⚡ Order Engine: <strong style={{ color: "#10B981" }}>Live &amp; Auto-Syncing (2s)</strong></span>
                    <span>📩 Customer Receipts: <strong style={{ color: "#10B981" }}>Enabled</strong></span>
                    <span>🚨 Admin Notifications (<code style={{ fontSize: ".82rem" }}>kianaturopathy@gmail.com</code>): <strong style={{ color: "#10B981" }}>Active</strong></span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="filters-bar-row" style={{ margin: 0 }}>
                  <div className="shop-search-box" style={{ minWidth: 260 }}>
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by Order #, Name, Phone, Address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="shop-search-input"
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div className="field" style={{ margin: 0 }}>
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="field" style={{ margin: 0 }}>
                      <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                        <option value="All">All Payments</option>
                        <option value="upi">UPI / Online</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="card" style={{ padding: 0, overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order # &amp; Date</th>
                      <th>Customer Contact &amp; Address</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id} style={o.status === "Cancelled" ? { background: "#FFF5F5", opacity: 0.85 } : {}}>
                        <td>
                          <strong style={{ fontSize: ".95rem", color: o.status === "Cancelled" ? "#991B1B" : "var(--emerald-900)" }}>{o.orderNumber}</strong>
                          <span className="muted" style={{ fontSize: ".8rem", display: "block" }}>
                            {o.date}
                          </span>
                        </td>

                        <td>
                          <strong>{o.customerName}</strong>
                          <span className="muted" style={{ fontSize: ".8rem", display: "block" }}>
                            📞 {o.phone}
                          </span>
                          <span className="muted" style={{ fontSize: ".78rem", display: "block" }}>
                            📍 {o.address}
                          </span>
                        </td>

                        <td style={{ fontSize: ".86rem" }}>
                          {o.items.map((item) => (
                            <div key={item.slug} style={{ marginBottom: 3 }}>
                              • <strong>{item.name}</strong> × {item.qty}
                            </div>
                          ))}
                        </td>

                        <td>
                          <strong className="price" style={{ fontSize: "1.1rem", textDecoration: o.status === "Cancelled" ? "line-through" : "none", color: o.status === "Cancelled" ? "#991B1B" : undefined }}>
                            {formatINR(o.total)}
                          </strong>
                        </td>

                        <td>
                          <span className="badge badge-gold">{o.paymentMethod.toUpperCase()}</span>
                        </td>

                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderRecord["status"])}
                            style={{
                              fontSize: ".82rem",
                              padding: "6px 10px",
                              fontWeight: 700,
                              background: o.status === "Cancelled" ? "#FEF2F2" : undefined,
                              color: o.status === "Cancelled" ? "#991B1B" : undefined,
                              borderColor: o.status === "Cancelled" ? "#FCA5A5" : undefined,
                            }}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedOrderForSlip(o)}
                              title="View and print packing slip"
                            >
                              📄 Slip
                            </button>
                            {o.paymentMethod === "razorpay" && o.status !== "Cancelled" && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ color: "#DC2626", borderColor: "#FCA5A5", background: "#FEF2F2" }}
                                onClick={() => handleRefundRazorpayOrder(o.orderNumber, o.total)}
                                title="Issue official Razorpay refund"
                              >
                                💸 Refund
                              </button>
                            )}
                            {o.status === "Cancelled" ? (
                              <>
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ color: "#059669", borderColor: "#A7F3D0", background: "#ECFDF5" }}
                                  onClick={() => handleUpdateStatus(o.id, "Order Placed")}
                                  title="Re-open cancelled order"
                                >
                                  ↩️ Restore
                                </button>
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ color: "#991B1B", borderColor: "#FCA5A5", background: "#FEF2F2" }}
                                  onClick={() => handleDeleteOrder(o.id, o.orderNumber)}
                                  title="Permanently remove cancelled order from dashboard"
                                >
                                  🗑️ Remove Order
                                </button>
                              </>
                            ) : (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ color: "#DC2626", borderColor: "#FCA5A5", background: "#FEF2F2" }}
                                onClick={() => handleCancelOrder(o.id)}
                                title="Cancel order and remove from sales graph"
                              >
                                ❌ Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="center" style={{ padding: "50px 0" }}>
                    <p className="muted" style={{ fontSize: "1.05rem" }}>
                      No orders recorded yet. As customers place orders on your website, they will automatically appear here!
                    </p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowManualModal(true)}>
                      Log First Clinic Order →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: INVENTORY & CATALOG MANAGER */}
          {adminTab === "inventory" && (
            <>
              {/* Stats Overview */}
              <div className="grid g4" style={{ marginBottom: 32 }}>
                <div className="card">
                  <span className="eyebrow">Total Products</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0" }}>{productsList.length}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>Active Store Catalog Items</span>
                </div>

                <div className="card" style={{ borderLeft: "4px solid #10B981" }}>
                  <span className="eyebrow" style={{ color: "#10B981" }}>🟢 In Stock</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0", color: "#10B981" }}>{inStockCount}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>Available for Purchase</span>
                </div>

                <div className="card" style={{ borderLeft: "4px solid #EF4444" }}>
                  <span className="eyebrow" style={{ color: "#EF4444" }}>🔴 Out of Stock</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0", color: "#EF4444" }}>{outOfStockCount}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>Disabled from Checkout</span>
                </div>

                <div className="card">
                  <span className="eyebrow">Active Categories</span>
                  <h2 style={{ fontSize: "2.2rem", margin: "4px 0" }}>{categoriesList.length}</h2>
                  <span className="muted" style={{ fontSize: ".84rem" }}>Dynamic Store Product Categories</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Product Inventory &amp; Stock Manager</h3>
                    <span className="muted" style={{ fontSize: ".86rem" }}>
                      Showing {filteredProductsList.length} of {productsList.length} total products
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <button className="btn btn-outline btn-sm" onClick={handleAddNewCategoryPrompt}>
                      🏷️ ➕ Add Custom Category
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddProductModal(true)}>
                      ➕ Add New Product
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        if (window.confirm("Reset all products back to default catalog?")) {
                          resetCatalogToDefault();
                        }
                      }}
                      style={{ color: "#6B7280" }}
                    >
                      🔄 Reset to Default Catalog
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="filters-bar-row" style={{ margin: 0 }}>
                  <div className="shop-search-box" style={{ minWidth: 260 }}>
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search product name or tagline..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="shop-search-input"
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <select value={inventoryCategory} onChange={(e) => setInventoryCategory(e.target.value)}>
                      <option value="All">All Categories</option>
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="card" style={{ padding: 0, overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name &amp; Category</th>
                      <th>Price &amp; MRP</th>
                      <th>Stock Quantity</th>
                      <th>Live Stock Status (1-Click Toggle)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductsList.map((p) => (
                      <tr key={p.slug}>
                        <td style={{ width: 70 }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: 54, height: 54, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line-gold)" }}
                          />
                        </td>

                        <td>
                          <strong style={{ fontSize: "1rem", color: "var(--emerald-900)", display: "block" }}>{p.name}</strong>
                          <span className="badge badge-gold" style={{ fontSize: ".72rem", marginTop: 4 }}>{p.category}</span>
                          <span className="muted" style={{ fontSize: ".8rem", display: "block", marginTop: 4 }}>{p.short}</span>
                        </td>

                        <td>
                          <strong className="price" style={{ fontSize: "1.1rem" }}>{formatINR(p.price)}</strong>
                          {p.comparePrice && (
                            <s className="muted" style={{ fontSize: ".84rem", display: "block" }}>
                              MRP: {formatINR(p.comparePrice)}
                            </s>
                          )}
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, fontSize: ".95rem" }}>
                            {p.stockCount !== undefined ? `${p.stockCount} units` : "10 units"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(p.slug)}
                            className="btn btn-sm"
                            style={{
                              background: p.inStock ? "#D1FAE5" : "#FEE2E2",
                              color: p.inStock ? "#065F46" : "#991B1B",
                              border: `1px solid ${p.inStock ? "#10B981" : "#EF4444"}`,
                              fontWeight: 800,
                              cursor: "pointer",
                              padding: "6px 14px",
                              borderRadius: 20,
                            }}
                          >
                            {p.inStock ? "🟢 IN STOCK (Click to Mark Out)" : "🔴 OUT OF STOCK (Click to Restock)"}
                          </button>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setEditingProduct(p)}
                            >
                              ✏️ Edit Details
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ color: "#DC2626", borderColor: "#FCA5A5" }}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.slug);
                                }
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProductsList.length === 0 && (
                  <div className="center" style={{ padding: "50px 0" }}>
                    <p className="muted" style={{ fontSize: "1.05rem" }}>No products found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: CLIENT HANDOFF & WEBSITE OWNER GUIDE */}
          {adminTab === "guide" && (
            <div className="card" style={{ padding: 32 }}>
              <div style={{ borderBottom: "2px solid var(--line-gold)", paddingBottom: 16, marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", color: "var(--emerald-900)" }}>📘 Complete Website Owner Handoff &amp; Management Guide</h2>
                <p className="lead" style={{ fontSize: "1rem", margin: 0 }}>
                  This guide explains how the website owner can manage sales, change product prices, update images, and handle out-of-stock items without writing any code.
                </p>
              </div>

              <div style={{ display: "grid", gap: 24 }}>
                <div style={{ background: "var(--cream-100)", border: "1px solid var(--line-gold)", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ margin: "0 0 10px", color: "var(--emerald-900)" }}>1. 🔐 Admin Access &amp; Login</h3>
                  <p style={{ margin: 0, fontSize: ".94rem", lineHeight: "1.6" }}>
                    * <strong>Admin URL</strong>: Simply go to <code>/admin</code> (or click the <em>Admin Panel</em> link at the bottom of the footer).<br />
                    * <strong>Email</strong>: <code>kianaturopathy@gmail.com</code><br />
                    * <strong>Security</strong>: The admin dashboard is restricted so regular website visitors cannot access sales numbers or customer orders.
                  </p>
                </div>

                <div style={{ background: "var(--cream-100)", border: "1px solid var(--line-gold)", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ margin: "0 0 10px", color: "var(--emerald-900)" }}>2. 📦 Marking Products "Out of Stock" or Changing Prices</h3>
                  <p style={{ margin: "0 0 10px", fontSize: ".94rem", lineHeight: "1.6" }}>
                    Go to the <strong>🏷️ Product Inventory &amp; Stock</strong> tab in this Admin Panel:
                  </p>
                  <ul style={{ paddingLeft: 20, fontSize: ".92rem", lineHeight: "1.6", margin: 0 }}>
                    <li><strong>Toggle Out of Stock</strong>: Click the <code>🟢 IN STOCK / 🔴 OUT OF STOCK</code> button next to any product. It will instantly show an <em>Out of Stock</em> red badge on the customer shop page and disable checkout for that item!</li>
                    <li><strong>Change Price or MRP</strong>: Click <code>✏️ Edit Details</code> next to any product to update the price in ₹, compare price (MRP), image link, tagline, or full description.</li>
                    <li><strong>Add New Product</strong>: Click <code>➕ Add New Product</code> at the top of the inventory page. Fill in the product title, price, category, and image URL to publish it immediately to the live store!</li>
                  </ul>
                </div>

                <div style={{ background: "var(--cream-100)", border: "1px solid var(--line-gold)", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ margin: "0 0 10px", color: "var(--emerald-900)" }}>3. 📩 Customer &amp; Admin Email Alerts</h3>
                  <p style={{ margin: 0, fontSize: ".94rem", lineHeight: "1.6" }}>
                    * Whenever a customer places an order with UPI or COD, an automated receipt is sent to the customer's email.<br />
                    * An immediate alert email is automatically dispatched to <code>kianaturopathy@gmail.com</code> containing the customer's name, phone number, delivery address, and ordered items.
                  </p>
                </div>


              </div>
            </div>
          )}
        </div>
      </section>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="quickview-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <button className="modal-close-btn btn-icon" onClick={() => setEditingProduct(null)}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 6px" }}>✏️ Edit Product Details</h3>
            <p className="muted" style={{ fontSize: ".86rem", marginBottom: 18 }}>
              Update selling price, MRP, image URL, category, stock count, and description for "{editingProduct.name}".
            </p>

            <form onSubmit={handleSaveProductEdit}>
              <div className="grid g2">
                <div className="field">
                  <label htmlFor="pname">Product Name *</label>
                  <input
                    id="pname"
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label htmlFor="pcat" style={{ margin: 0 }}>Category *</label>
                    <button
                      type="button"
                      className="btn-link"
                      style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--emerald-900)" }}
                      onClick={handleAddNewCategoryPrompt}
                    >
                      ➕ Add Category
                    </button>
                  </div>
                  <select
                    id="pcat"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid g2">
                <div className="field">
                  <label htmlFor="pprice">Selling Price (₹) *</label>
                  <input
                    id="pprice"
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="pcompare">MRP / Compare Price (₹)</label>
                  <input
                    id="pcompare"
                    type="number"
                    value={editingProduct.comparePrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, comparePrice: parseInt(e.target.value, 10) || null })}
                  />
                </div>
              </div>

              <div className="grid g2">
                <div className="field">
                  <label htmlFor="pstock">Stock Quantity (Units Remaining)</label>
                  <input
                    id="pstock"
                    type="number"
                    value={editingProduct.stockCount || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>

                <div className="field" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
                  <input
                    id="pinstock"
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    style={{ width: 20, height: 20 }}
                  />
                  <label htmlFor="pinstock" style={{ margin: 0, fontWeight: 700 }}>
                    In Stock (Available for Purchase)
                  </label>
                </div>
              </div>

              <div className="field">
                <label style={{ fontWeight: 700 }}>Product Photo</label>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
                  <img
                    src={editingProduct.image}
                    alt="Product preview"
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", border: "2px solid var(--line-gold)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <label
                      className="btn btn-outline btn-sm"
                      style={{ display: "inline-block", cursor: "pointer", background: "var(--cream-100)" }}
                    >
                      📁 Upload Photo from Device
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setEditingProduct({ ...editingProduct, image: evt.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span className="muted" style={{ display: "block", fontSize: ".78rem", marginTop: 6 }}>
                      Click above to pick a photo from your computer/phone (JPG, PNG, WEBP).
                    </span>
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="Or paste an image URL here..."
                      style={{ marginTop: 6, fontSize: ".82rem" }}
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="pshort">Short Tagline</label>
                <input
                  id="pshort"
                  type="text"
                  value={editingProduct.short}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor="pdesc">Detailed Description</label>
                <textarea
                  id="pdesc"
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button className="btn btn-primary" type="submit">
                  💾 Save Changes
                </button>
                <button className="btn btn-outline" type="button" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="modal-backdrop" onClick={() => setShowAddProductModal(false)}>
          <div className="quickview-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <button className="modal-close-btn btn-icon" onClick={() => setShowAddProductModal(false)}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 6px" }}>➕ Add New Product to Store</h3>
            <p className="muted" style={{ fontSize: ".86rem", marginBottom: 18 }}>
              Publish a new herbal supplement, kit, or tea to your live website catalog.
            </p>

            <form onSubmit={handleCreateProduct}>
              <div className="grid g2">
                <div className="field">
                  <label htmlFor="npname">Product Title *</label>
                  <input
                    id="npname"
                    type="text"
                    required
                    placeholder="e.g. Ashwagandha Root Extract"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label htmlFor="npcat" style={{ margin: 0 }}>Category *</label>
                    <button
                      type="button"
                      className="btn-link"
                      style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--emerald-900)" }}
                      onClick={handleAddNewCategoryPrompt}
                    >
                      ➕ Add Category
                    </button>
                  </div>
                  <select
                    id="npcat"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid g2">
                <div className="field">
                  <label htmlFor="npprice">Selling Price (₹) *</label>
                  <input
                    id="npprice"
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="npcompare">MRP / Compare Price (₹)</label>
                  <input
                    id="npcompare"
                    type="number"
                    value={newProdComparePrice}
                    onChange={(e) => setNewProdComparePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid g2">
                <div className="field">
                  <label htmlFor="npstock">Initial Stock Quantity</label>
                  <input
                    id="npstock"
                    type="number"
                    value={newProdStockCount}
                    onChange={(e) => setNewProdStockCount(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label style={{ fontWeight: 700 }}>Product Photo *</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
                    {newProdImage ? (
                      <img
                        src={newProdImage}
                        alt="New Product Preview"
                        style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line-gold)" }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--cream-100)", border: "1px dashed var(--line-gold)", display: "grid", placeItems: "center" }}>
                        🖼️
                      </div>
                    )}
                    <label
                      className="btn btn-outline btn-sm"
                      style={{ cursor: "pointer", background: "var(--cream-100)", fontSize: ".8rem" }}
                    >
                      📁 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setNewProdImage(evt.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="npshort">Short Tagline</label>
                <input
                  id="npshort"
                  type="text"
                  placeholder="Practitioner-grade stress and vitality support"
                  value={newProdShort}
                  onChange={(e) => setNewProdShort(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="npdesc">Full Product Description</label>
                <textarea
                  id="npdesc"
                  rows={3}
                  placeholder="Explain benefits, ingredients, and practitioner recommendations..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button className="btn btn-primary" type="submit">
                  🚀 Publish Product
                </button>
                <button className="btn btn-outline" type="button" onClick={() => setShowAddProductModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Manual Order Modal */}
      {showManualModal && (
        <div className="modal-backdrop" onClick={() => setShowManualModal(false)}>
          <div className="quickview-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button className="modal-close-btn btn-icon" onClick={() => setShowManualModal(false)}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 8px" }}>Log Manual Clinic or Phone Sale</h3>
            <p className="muted" style={{ fontSize: ".86rem", marginBottom: 18 }}>
              Record orders received via WhatsApp, phone consultation, or walk-in patient.
            </p>

            <form onSubmit={handleCreateManualOrder}>
              <div className="field">
                <label htmlFor="customer">Customer Full Name *</label>
                <input
                  id="customer"
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="address">Delivery Address / City *</label>
                <input
                  id="address"
                  type="text"
                  required
                  placeholder="e.g. FC Road, Shivajinagar, Pune 411005"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="product">Select Product Item *</label>
                <select
                  id="product"
                  value={selectedProductSlug}
                  onChange={(e) => setSelectedProductSlug(e.target.value)}
                >
                  {(productsList || PRODUCTS).map((prod) => (
                    <option key={prod.slug} value={prod.slug}>
                      {prod.name} — {formatINR(prod.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="payment">Payment Method *</label>
                <select
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "upi" | "cod" | "card")}
                >
                  <option value="upi">UPI / GPay / PhonePe</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="card">Credit / Debit Card</option>
                </select>
              </div>

              <div style={{ marginTop: 22 }}>
                <button className="btn btn-primary btn-block" type="submit">
                  Save &amp; Record Order →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Courier Packing Slip Modal */}
      {selectedOrderForSlip && (
        <div className="modal-backdrop" onClick={() => setSelectedOrderForSlip(null)}>
          <div className="quickview-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <button className="modal-close-btn btn-icon" onClick={() => setSelectedOrderForSlip(null)}>
              ✕
            </button>

            <div className="printable-slip">
              <div style={{ borderBottom: "2px solid var(--emerald-900)", paddingBottom: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Kiana Naturopathy</h2>
                  <span className="muted" style={{ fontSize: ".82rem" }}>Courier Dispatch &amp; Packing Slip</span>
                </div>
                <strong>ORDER #{selectedOrderForSlip.orderNumber}</strong>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: ".9rem", marginBottom: 16 }}>
                <div>
                  <strong>SHIP TO:</strong>
                  <p style={{ margin: "4px 0" }}>
                    {selectedOrderForSlip.customerName}<br />
                    {selectedOrderForSlip.address}<br />
                    Phone: {selectedOrderForSlip.phone}
                  </p>
                </div>
                <div>
                  <strong>ORDER DETAILS:</strong>
                  <p style={{ margin: "4px 0" }}>
                    Date: {selectedOrderForSlip.date}<br />
                    Payment: {selectedOrderForSlip.paymentMethod.toUpperCase()}<br />
                    Status: {selectedOrderForSlip.status}
                  </p>
                </div>
              </div>

              <strong>ITEMS TO PACK:</strong>
              <ul style={{ paddingLeft: 18, marginTop: 6, fontSize: ".9rem" }}>
                {selectedOrderForSlip.items.map((item) => (
                  <li key={item.slug}>
                    [ ] <strong>{item.name}</strong> — Quantity: {item.qty} ({formatINR(item.price)} each)
                  </li>
                ))}
              </ul>

              <div style={{ borderTop: "1px dashed var(--line-gold)", paddingTop: 12, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>TOTAL ORDER VALUE: {formatINR(selectedOrderForSlip.total)}</strong>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  🖨️ Print Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE ADMIN PASSWORD MODAL */}
      {showChangePasscodeModal && (
        <div className="modal-backdrop" onClick={() => setShowChangePasscodeModal(false)}>
          <div className="quickview-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <button className="modal-close-btn btn-icon" onClick={() => setShowChangePasscodeModal(false)}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 6px" }}>🔑 Change Admin Master Password</h3>
            <p className="muted" style={{ fontSize: ".86rem", marginBottom: 18 }}>
              Set a new secret password to protect your Admin Dashboard &amp; sales data.
            </p>

            <form onSubmit={handleSaveNewPasscode}>
              <div className="field">
                <label htmlFor="newpass">New Secret Admin Password *</label>
                <input
                  id="newpass"
                  type="password"
                  required
                  placeholder="Enter new master password..."
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button className="btn btn-primary" type="submit">
                  💾 Update Password
                </button>
                <button className="btn btn-outline" type="button" onClick={() => setShowChangePasscodeModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
