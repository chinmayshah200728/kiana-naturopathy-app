import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account & Orders — Kiana Naturopathy" },
      { name: "description", content: "View past orders, track shipments, and manage health consultation appointments." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { ordersHistory, bookings, customerUser, loginCustomer, logoutCustomer } = useECommerce();
  const [activeTab, setActiveTab] = useState<"orders" | "consultations" | "profile">("orders");

  // Dynamic user profile fields
  const [profileName, setProfileName] = useState(() => customerUser?.name || ordersHistory[0]?.customerName || "");
  const [profilePhone, setProfilePhone] = useState(() => customerUser?.phone || ordersHistory[0]?.phone || "");
  const [profileEmail, setProfileEmail] = useState(() => customerUser?.email || "");
  const [profileAddress, setProfileAddress] = useState(() => customerUser?.address || ordersHistory[0]?.address || "");
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Sync state if customerUser changes
  useEffect(() => {
    if (customerUser) {
      if (customerUser.name) setProfileName(customerUser.name);
      if (customerUser.phone) setProfilePhone(customerUser.phone);
      if (customerUser.email) setProfileEmail(customerUser.email);
      if (customerUser.address) setProfileAddress(customerUser.address);
    } else if (ordersHistory.length > 0) {
      const latest = ordersHistory[0];
      if (latest.customerName) setProfileName(latest.customerName);
      if (latest.phone) setProfilePhone(latest.phone);
      if (latest.address) setProfileAddress(latest.address);
    }
  }, [customerUser, ordersHistory]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustomer({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      address: profileAddress.trim(),
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3500);
  };

  return (
    <>
      <PageHead
        eyebrow="Customer Portal"
        title="My Account & Orders"
        lead="Track your orders, view past invoices, and manage your naturopathic doctor appointments."
      />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          <div className="account-layout-grid">
            {/* Sidebar Tabs */}
            <aside className="account-sidebar card">
              <div className="user-profile-header">
                <div className="avatar-circle">🌿</div>
                <div>
                  <strong>{customerUser?.name || ordersHistory[0]?.customerName || "Valued Client"}</strong>
                  <span className="muted" style={{ fontSize: ".84rem", display: "block" }}>
                    {customerUser?.email || (ordersHistory[0] ? `Phone: ${ordersHistory[0].phone}` : "guest@kianaturopathy.com")}
                  </span>
                </div>
              </div>

              <nav className="account-nav-list">
                <button
                  className={`account-nav-item ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  📦 My Orders ({ordersHistory.length})
                </button>

                <button
                  className={`account-nav-item ${activeTab === "consultations" ? "active" : ""}`}
                  onClick={() => setActiveTab("consultations")}
                >
                  🩺 Doctor Appointments ({bookings.length})
                </button>

                <button
                  className={`account-nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  👤 Personal Profile
                </button>

                <Link to="/wishlist" className="account-nav-item">
                  🤍 Saved Wishlist
                </Link>

                {customerUser && (
                  <button
                    className="account-nav-item"
                    style={{ color: "#DC2626", marginTop: 12 }}
                    onClick={() => {
                      logoutCustomer();
                      alert("You have been signed out of your customer account.");
                    }}
                  >
                    🚪 Sign Out
                  </button>
                )}
              </nav>
            </aside>

            {/* Tab Contents */}
            <main className="account-main-content">
              {activeTab === "orders" && (
                <div>
                  <h2>Order History ({ordersHistory.length})</h2>
                  {ordersHistory.length === 0 ? (
                    <div className="card center" style={{ padding: "40px 20px" }}>
                      <span style={{ fontSize: "2.5rem" }}>📦</span>
                      <h3>No Orders Placed Yet</h3>
                      <p className="muted">
                        When you place an order in the wellness shop, it will appear here with live tracking updates!
                      </p>
                      <Link className="btn btn-primary" to="/shop" style={{ marginTop: 14 }}>
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {ordersHistory.map((order) => (
                        <div className="card order-card" key={order.id}>
                          <div className="order-header-row">
                            <div>
                              <strong>Order #{order.orderNumber}</strong>
                              <span className="muted" style={{ fontSize: ".84rem", display: "block" }}>
                                Placed on {order.date}
                              </span>
                            </div>
                            <span className="badge badge-green">{order.status}</span>
                          </div>

                          <div className="order-items-preview">
                            {order.items.map((item) => (
                              <div className="order-item-row" key={item.slug}>
                                <img src={item.image} alt={item.name} className="order-item-thumb" />
                                <div style={{ flex: 1 }}>
                                  <strong>{item.name}</strong>
                                  <span className="muted" style={{ fontSize: ".85rem", display: "block" }}>
                                    {formatINR(item.price)} × {item.qty}
                                  </span>
                                </div>
                                <span className="price">{formatINR(item.price * item.qty)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Order Tracking Bar */}
                          <div className="tracking-progress-box">
                            <span className="muted" style={{ fontSize: ".82rem", fontWeight: 700 }}>
                              Shipment Status Timeline:
                            </span>
                            <div className="tracking-steps">
                              <div className={`track-step ${["Order Placed", "Packed", "Out for Delivery", "Delivered"].includes(order.status) ? "active" : ""}`}>
                                <span className="dot" />
                                <span>Order Placed</span>
                              </div>
                              <div className={`track-step ${["Packed", "Out for Delivery", "Delivered"].includes(order.status) ? "active" : ""}`}>
                                <span className="dot" />
                                <span>Packed</span>
                              </div>
                              <div className={`track-step ${["Out for Delivery", "Delivered"].includes(order.status) ? "active" : ""}`}>
                                <span className="dot" />
                                <span>In Transit</span>
                              </div>
                              <div className={`track-step ${order.status === "Delivered" ? "active" : ""}`}>
                                <span className="dot" />
                                <span>Delivered</span>
                              </div>
                            </div>
                          </div>

                          <div className="order-footer-row">
                            <div>
                              <span className="muted" style={{ fontSize: ".84rem" }}>
                                Payment: {order.paymentMethod.toUpperCase()} · Total:
                              </span>{" "}
                              <strong className="price">{formatINR(order.total)}</strong>
                            </div>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => window.print()}
                            >
                              📄 Download Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "consultations" && (
                <div>
                  <h2>Doctor Appointments ({bookings.length})</h2>

                  {bookings.length === 0 ? (
                    <div className="card center" style={{ padding: "40px 20px" }}>
                      <span style={{ fontSize: "2.5rem" }}>🩺</span>
                      <h3>No Appointments Booked</h3>
                      <p className="muted">
                        Book a 45-minute virtual or in-clinic naturopathic assessment with our doctors!
                      </p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {bookings.map((b) => (
                        <div className="card" key={b.id} style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span className="badge badge-gold">{b.type}</span>
                              <h3 style={{ margin: "6px 0 2px" }}>{b.doctor}</h3>
                              <p className="muted" style={{ fontSize: ".88rem", margin: 0 }}>
                                Service: {b.service}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <strong className="price" style={{ fontSize: "1.1rem" }}>{b.date}</strong>
                              <span className="muted" style={{ display: "block", fontSize: ".84rem" }}>{b.timeSlot}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="card">
                  <h2>Personal Profile</h2>
                  <p className="muted" style={{ fontSize: ".88rem", marginBottom: 18 }}>
                    Update your account details and default shipping address below.
                  </p>

                  {profileSavedMsg && (
                    <div
                      style={{
                        background: "#ECFDF5",
                        border: "1px solid #10B981",
                        color: "#065F46",
                        padding: "10px 14px",
                        borderRadius: 8,
                        marginBottom: 16,
                        fontWeight: 700,
                      }}
                    >
                      ✓ Profile details updated successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile}>
                    <div className="row2">
                      <div className="field">
                        <label htmlFor="pname">Full Name *</label>
                        <input
                          id="pname"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="pphone">Phone Number *</label>
                        <input
                          id="pphone"
                          required
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="pemail">Email Address *</label>
                      <input
                        id="pemail"
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="paddress">Default Shipping Address</label>
                      <textarea
                        id="paddress"
                        rows={3}
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        placeholder="Enter your full shipping address for fast checkout"
                      />
                    </div>

                    <button className="btn btn-primary" type="submit">
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
