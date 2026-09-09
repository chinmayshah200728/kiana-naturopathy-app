const REGISTERED_USERS_KEY = "kiana-registered-users-v1";

interface RegisteredUser {
  name: string;
  email: string;
  phone: string;
  address?: string;
  password?: string;
}

function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(user: RegisteredUser) {
  try {
    const existing = getRegisteredUsers();
    const filtered = existing.filter(
      (u) => u.email.toLowerCase() !== user.email.toLowerCase() && u.phone !== user.phone
    );
    const updated = [user, ...filtered];
    window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
}

function AccountPage() {
  const { ordersHistory, bookings, customerUser, loginCustomer, logoutCustomer } = useECommerce();
  const [activeTab, setActiveTab] = useState<"orders" | "consultations" | "profile">("orders");

  // Auth screen mode: "login" vs "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Sign In form state
  const [loginIdentity, setLoginIdentity] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Create Account form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");

  // Profile editing state for logged-in user
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Sync profile state when customerUser is logged in
  useEffect(() => {
    if (customerUser) {
      setProfileName(customerUser.name || "");
      setProfilePhone(customerUser.phone || "");
      setProfileEmail(customerUser.email || "");
      setProfileAddress(customerUser.address || "");
    }
  }, [customerUser]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const identity = loginIdentity.trim();
    const pwd = loginPassword.trim();

    if (!identity || !pwd) {
      setLoginError("Please fill in both email/phone and password.");
      return;
    }

    const registeredList = getRegisteredUsers();
    const foundUser = registeredList.find(
      (u) =>
        u.email.toLowerCase() === identity.toLowerCase() ||
        u.phone.replace(/\D/g, "") === identity.replace(/\D/g, "")
    );

    if (foundUser) {
      if (foundUser.password && foundUser.password !== pwd) {
        setLoginError("Incorrect password. Please try again or create a new account.");
        return;
      }
      loginCustomer({
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        address: foundUser.address || "",
      });
      return;
    }

    // If no existing user found in registered list, create user session with identity details
    const derivedName = identity.includes("@") ? identity.split("@")[0] : `Customer (${identity})`;
    const isEmail = identity.includes("@");
    const newUser: RegisteredUser = {
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: isEmail ? identity : `${identity.replace(/\D/g, "")}@kianacustomer.com`,
      phone: isEmail ? "+91 98765 43210" : identity,
      password: pwd,
    };
    saveRegisteredUser(newUser);
    loginCustomer({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: "",
    });
  };

  // Handle Create Account submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError("Please complete all required fields (*).");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match. Please check and try again.");
      return;
    }

    if (regPassword.length < 4) {
      setRegError("Password must be at least 4 characters long.");
      return;
    }

    const newUser: RegisteredUser = {
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      address: regAddress.trim(),
      password: regPassword.trim(),
    };

    saveRegisteredUser(newUser);
    loginCustomer({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerUser) return;
    const updatedUser = {
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      address: profileAddress.trim(),
    };
    loginCustomer(updatedUser);
    saveRegisteredUser(updatedUser);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3500);
  };

  // Filter orders matching logged-in user's email or phone number
  const myOrders = customerUser
    ? ordersHistory.filter(
        (o) =>
          (o.phone && customerUser.phone && o.phone.replace(/\D/g, "") === customerUser.phone.replace(/\D/g, "")) ||
          (o.customerName && customerUser.name && o.customerName.toLowerCase().includes(customerUser.name.toLowerCase()))
      )
    : [];

  const displayedOrders = myOrders.length > 0 ? myOrders : ordersHistory;

  // Unauthenticated Customer Screen (Sign In / Create Account Switcher)
  if (!customerUser) {
    return (
      <>
        <PageHead
          eyebrow="Customer Portal"
          title={authMode === "login" ? "🔑 Log In into Your Account" : "✨ Create Customer Account"}
          lead="Access your personalized health orders history, live shipment tracking, and doctor consultations."
        />

        <section style={{ padding: "40px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: 540 }}>
            {/* 2-Tab Navigation Switcher */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "var(--bg-card, #f4f6f4)",
                padding: 6,
                borderRadius: 14,
                marginBottom: 24,
                border: "1px solid var(--line-gold, #e2e8f0)",
              }}
            >
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  cursor: "pointer",
                  background: authMode === "login" ? "var(--emerald-900, #064e3b)" : "transparent",
                  color: authMode === "login" ? "#ffffff" : "var(--emerald-900, #064e3b)",
                  boxShadow: authMode === "login" ? "0 4px 12px rgba(6,78,59,0.2)" : "none",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>🔑</span> Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  cursor: "pointer",
                  background: authMode === "register" ? "var(--emerald-900, #064e3b)" : "transparent",
                  color: authMode === "register" ? "#ffffff" : "var(--emerald-900, #064e3b)",
                  boxShadow: authMode === "register" ? "0 4px 12px rgba(6,78,59,0.2)" : "none",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>✨</span> Create Account
              </button>
            </div>

            {/* TAB 1: LOGIN INTO YOUR ACCOUNT */}
            {authMode === "login" && (
              <div className="card" style={{ padding: 36, border: "2px solid var(--line-gold)", boxShadow: "var(--shadow-md)" }}>
                <div className="center" style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 6 }}>🌿</div>
                  <h2 style={{ margin: "0 0 6px", color: "var(--emerald-900)" }}>Log In into Your Account</h2>
                  <p className="muted" style={{ fontSize: ".88rem", margin: 0 }}>
                    Enter your registered email address or mobile phone number to access your account.
                  </p>
                </div>

                {loginError && (
                  <div
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FCA5A5",
                      color: "#991B1B",
                      padding: "10px 14px",
                      borderRadius: 8,
                      marginBottom: 18,
                      fontSize: ".9rem",
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="field">
                    <label htmlFor="login-identity">Email Address or Phone Number *</label>
                    <input
                      id="login-identity"
                      type="text"
                      required
                      placeholder="e.g. radhika@example.com or +91 98765 43210"
                      value={loginIdentity}
                      onChange={(e) => setLoginIdentity(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="login-pwd">Account Password *</label>
                    <input
                      id="login-pwd"
                      type="password"
                      required
                      placeholder="Enter your account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: 16 }}>
                    🔑 Sign In to My Account →
                  </button>
                </form>

                <div className="center" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px dashed var(--line-gold)" }}>
                  <span className="muted" style={{ fontSize: ".88rem" }}>
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--emerald-900)",
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                      onClick={() => setAuthMode("register")}
                    >
                      Create Account here
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: CREATE ACCOUNT */}
            {authMode === "register" && (
              <div className="card" style={{ padding: 36, border: "2px solid var(--line-gold)", boxShadow: "var(--shadow-md)" }}>
                <div className="center" style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 6 }}>✨</div>
                  <h2 style={{ margin: "0 0 6px", color: "var(--emerald-900)" }}>Create New Account</h2>
                  <p className="muted" style={{ fontSize: ".88rem", margin: 0 }}>
                    Register for a free Kiana Naturopathy account for fast checkout, order tracking, and consultations.
                  </p>
                </div>

                {regError && (
                  <div
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FCA5A5",
                      color: "#991B1B",
                      padding: "10px 14px",
                      borderRadius: 8,
                      marginBottom: 18,
                      fontSize: ".9rem",
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {regError}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  <div className="field">
                    <label htmlFor="reg-name">Full Name *</label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="row2">
                    <div className="field">
                      <label htmlFor="reg-email">Email Address *</label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="radhika@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="reg-phone">Mobile Phone *</label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="reg-address">Default Delivery Address</label>
                    <input
                      id="reg-address"
                      type="text"
                      placeholder="Flat / House No, Street, Landmark, Pune..."
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                    />
                  </div>

                  <div className="row2">
                    <div className="field">
                      <label htmlFor="reg-pwd">Create Password *</label>
                      <input
                        id="reg-pwd"
                        type="password"
                        required
                        placeholder="Choose password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="reg-cpwd">Confirm Password *</label>
                      <input
                        id="reg-cpwd"
                        type="password"
                        required
                        placeholder="Confirm password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: 16 }}>
                    ✨ Create Account &amp; Sign In →
                  </button>
                </form>

                <div className="center" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px dashed var(--line-gold)" }}>
                  <span className="muted" style={{ fontSize: ".88rem" }}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--emerald-900)",
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                      onClick={() => setAuthMode("login")}
                    >
                      Log in to your account
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  // Authenticated Customer Dashboard
  return (
    <>
      <PageHead
        eyebrow="Customer Portal"
        title={`Welcome Back, ${customerUser.name}`}
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
                  <strong style={{ fontSize: "1.05rem" }}>{customerUser.name}</strong>
                  <span className="muted" style={{ fontSize: ".84rem", display: "block" }}>
                    ✉️ {customerUser.email}
                  </span>
                  <span className="muted" style={{ fontSize: ".82rem", display: "block" }}>
                    📞 {customerUser.phone}
                  </span>
                </div>
              </div>

              <nav className="account-nav-list">
                <button
                  className={`account-nav-item ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  📦 My Orders ({displayedOrders.length})
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

                <button
                  className="account-nav-item"
                  style={{ color: "#DC2626", marginTop: 12, fontWeight: 700 }}
                  onClick={() => {
                    logoutCustomer();
                  }}
                >
                  🚪 Sign Out
                </button>
              </nav>
            </aside>

            {/* Tab Contents */}
            <main className="account-main-content">
              {activeTab === "orders" && (
                <div>
                  <h2>Order History ({displayedOrders.length})</h2>
                  {displayedOrders.length === 0 ? (
                    <div className="card center" style={{ padding: "40px 20px" }}>
                      <span style={{ fontSize: "2.5rem" }}>📦</span>
                      <h3>No Orders Placed Yet</h3>
                      <p className="muted">
                        When you place an order in the wellness shop, it will appear here with live tracking updates!
                      </p>
                      <Link className="btn btn-primary" to="/shop" style={{ marginTop: 14 }}>
                        Browse Shop &amp; Place Order
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {displayedOrders.map((order) => (
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
