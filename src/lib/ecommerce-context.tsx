import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { products as INITIAL_PRODUCTS, type Product } from "@/data/products";

export type OrderRecord = {
  id: string;
  orderNumber: string;
  date: string;
  items: { slug: string; name: string; price: number; qty: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "Order Placed" | "Packed" | "Out for Delivery" | "Delivered";
  paymentMethod: "upi" | "cod" | "card";
  address: string;
  customerName: string;
  phone: string;
};

export type BookingRecord = {
  id: string;
  doctor: string;
  service: string;
  date: string;
  timeSlot: string;
  type: "In-Clinic Pune" | "Online Video Consultation";
  patientName: string;
  phone: string;
};

export type CustomerUser = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
};

type ECommerceContextValue = {
  // Theme Mode (Light / Dark Luxury)
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Customer Account Authentication
  customerUser: CustomerUser | null;
  loginCustomer: (user: CustomerUser) => void;
  logoutCustomer: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  wishlistCount: number;

  // Products Catalog & Inventory Management
  productsList: Product[];
  updateProduct: (slug: string, fields: Partial<Product>) => void;
  toggleStockStatus: (slug: string) => void;
  addProduct: (newProduct: Product) => void;
  deleteProduct: (slug: string) => void;
  resetCatalogToDefault: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search Overlay
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Cart Drawer
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Booking Modal
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;

  // Coupons
  couponCode: string;
  appliedCoupon: { code: string; discountPercent: number; flatDiscount: number; freeShipping: boolean } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (slug: string) => void;

  // Order History for Account & Admin
  ordersHistory: OrderRecord[];
  addOrderToHistory: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderRecord["status"]) => void;
  reloadOrdersHistory: () => void;
  clearAllOrders: () => void;
};


const WISHLIST_KEY = "kiana-wishlist-v2";
const RECENT_KEY = "kiana-recent-v2";
const ORDERS_KEY = "kiana-orders-history-v2";
const BOOKINGS_KEY = "kiana-bookings-history-v2";
const THEME_KEY = "kiana-theme-mode";
const PRODUCTS_KEY = "kiana-products-catalog-v1";
const CUSTOMER_KEY = "kiana_customer_user_v1";

const ECommerceContext = createContext<ECommerceContextValue | null>(null);

const VALID_COUPONS: Record<
  string,
  { discountPercent: number; flatDiscount: number; freeShipping: boolean; minOrder?: number }
> = {
  KIANA10: { discountPercent: 10, flatDiscount: 0, freeShipping: false },
  FREESHIP: { discountPercent: 0, flatDiscount: 0, freeShipping: true },
  LUXE20: { discountPercent: 20, flatDiscount: 0, freeShipping: false, minOrder: 1499 },
  FIRST100: { discountPercent: 0, flatDiscount: 100, freeShipping: false, minOrder: 499 },
};

export function ECommerceProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    flatDiscount: number;
    freeShipping: boolean;
  } | null>(null);

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [ordersHistory, setOrdersHistory] = useState<OrderRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (savedTheme === "dark") setDarkMode(true);

      const savedCustomer = window.localStorage.getItem(CUSTOMER_KEY);
      if (savedCustomer) setCustomerUser(JSON.parse(savedCustomer));

      const savedWish = window.localStorage.getItem(WISHLIST_KEY);
      if (savedWish) setWishlist(JSON.parse(savedWish));

      const savedRecent = window.localStorage.getItem(RECENT_KEY);
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));

      const savedOrders = window.localStorage.getItem(ORDERS_KEY);
      if (savedOrders) setOrdersHistory(JSON.parse(savedOrders));

      const savedBookings = window.localStorage.getItem(BOOKINGS_KEY);
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedProducts = window.localStorage.getItem(PRODUCTS_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const loginCustomer = useCallback((user: CustomerUser) => {
    setCustomerUser(user);
    try {
      window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  }, []);

  const logoutCustomer = useCallback(() => {
    setCustomerUser(null);
    try {
      window.localStorage.removeItem(CUSTOMER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Save catalog changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsList));
    } catch {
      /* ignore */
    }
  }, [productsList]);

  // Update HTML body attribute for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem(THEME_KEY, "light");
    }
  }, [darkMode]);

  // Save wishlist
  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  // Save orders history
  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(ordersHistory));
    } catch {
      /* ignore */
    }
  }, [ordersHistory]);

  // Save bookings
  useEffect(() => {
    try {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      /* ignore */
    }
  }, [bookings]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Inventory & Product Catalog Management
  const updateProduct = useCallback((slug: string, fields: Partial<Product>) => {
    setProductsList((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, ...fields } : p))
    );
  }, []);

  const toggleStockStatus = useCallback((slug: string) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const nextStock = !p.inStock;
          return { ...p, inStock: nextStock, stockCount: nextStock ? (p.stockCount || 10) : 0 };
        }
        return p;
      })
    );
  }, []);

  const addProduct = useCallback((newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);
  }, []);

  const deleteProduct = useCallback((slug: string) => {
    setProductsList((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const resetCatalogToDefault = useCallback(() => {
    setProductsList(INITIAL_PRODUCTS);
    try {
      window.localStorage.removeItem(PRODUCTS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  }, []);

  const isInWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const applyCoupon = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: "Please enter a coupon code." };
    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) return { success: false, message: "Invalid promo code. Try KIANA10 or FREESHIP." };

    setCouponCode(cleanCode);
    setAppliedCoupon({
      code: cleanCode,
      discountPercent: coupon.discountPercent,
      flatDiscount: coupon.flatDiscount,
      freeShipping: coupon.freeShipping,
    });
    return { success: true, message: `Promo code ${cleanCode} applied!` };
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setAppliedCoupon(null);
  }, []);

  const addRecentlyViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      const next = [slug, ...filtered].slice(0, 8);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Listen for storage changes across browser tabs for real-time order syncing
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ORDERS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrdersHistory(parsed);
        } catch {
          /* ignore */
        }
      }
      if (e.key === PRODUCTS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProductsList(parsed);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addOrderToHistory = useCallback((order: OrderRecord) => {
    setOrdersHistory((prev) => {
      const filtered = prev.filter((o) => o.orderNumber !== order.orderNumber);
      const next = [order, ...filtered];
      try {
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderRecord["status"]) => {
    setOrdersHistory((prev) => {
      const next = prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o));
      try {
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reloadOrdersHistory = useCallback(() => {
    try {
      const savedOrders = window.localStorage.getItem(ORDERS_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrdersHistory(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const clearAllOrders = useCallback(() => {
    setOrdersHistory([]);
    try {
      window.localStorage.removeItem(ORDERS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const addBooking = useCallback((booking: BookingRecord) => {
    setBookings((prev) => [booking, ...prev]);
  }, []);

  return (
    <ECommerceContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        customerUser,
        loginCustomer,
        logoutCustomer,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        productsList,
        updateProduct,
        toggleStockStatus,
        addProduct,
        deleteProduct,
        resetCatalogToDefault,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isBookingOpen,
        setIsBookingOpen,
        bookings,
        addBooking,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        recentlyViewed,
        addRecentlyViewed,
        ordersHistory,
        addOrderToHistory,
        updateOrderStatus,
        reloadOrdersHistory,
        clearAllOrders,
      }}
    >
      {children}
    </ECommerceContext.Provider>
  );
}


export function useECommerce() {
  const context = useContext(ECommerceContext);
  if (!context) throw new Error("useECommerce must be used inside ECommerceProvider");
  return context;
}
