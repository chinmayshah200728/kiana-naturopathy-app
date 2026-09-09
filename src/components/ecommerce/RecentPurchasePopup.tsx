import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { Link } from "@tanstack/react-router";

const SAMPLE_PURCHASES = [
  { name: "Ananya D.", city: "Pune", item: "7-Day Gentle Detox Kit", time: "2 mins ago" },
  { name: "Dr. Farhan Q.", city: "Mumbai", item: "Ashwagandha Root Capsules", time: "5 mins ago" },
  { name: "Sneha K.", city: "Bengaluru", item: "Wild Multiflora Raw Forest Honey", time: "8 mins ago" },
  { name: "Rohan P.", city: "Nagpur", item: "Daily Immunity Kadha Mix", time: "12 mins ago" },
  { name: "Meera J.", city: "Ahmedabad", item: "Kashmir Lavender Essential Oil", time: "15 mins ago" },
];

export function RecentPurchasePopup() {
  const [purchaseIndex, setPurchaseIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first popup after 5s, then cycle every 18s
    const timer1 = setTimeout(() => {
      setPurchaseIndex(0);
      setVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPurchaseIndex((prev) => (prev === null ? 0 : (prev + 1) % SAMPLE_PURCHASES.length));
        setVisible(true);
      }, 800);
    }, 18000);

    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [visible, purchaseIndex]);

  if (purchaseIndex === null || !visible) return null;

  const current = SAMPLE_PURCHASES[purchaseIndex];
  const matchingProduct = products.find((p) => p.name === current.item) || products[0];

  return (
    <div className="recent-purchase-toast">
      <button className="toast-close" onClick={() => setVisible(false)} aria-label="Close">
        ✕
      </button>
      <img src={matchingProduct.image} alt={current.item} className="toast-thumb" />
      <div className="toast-content">
        <p className="toast-title">
          <strong>{current.name}</strong> from <span>{current.city}</span> bought
        </p>
        <Link
          to="/shop/$slug"
          params={{ slug: matchingProduct.slug }}
          className="toast-product-link"
        >
          {current.item}
        </Link>
        <span className="toast-time">{current.time} · Verified Purchase</span>
      </div>
    </div>
  );
}
