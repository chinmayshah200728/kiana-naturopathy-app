import type { Product } from "./products";

export type CustomComboItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export type CustomCombo = {
  id: string;
  title: string;
  items: CustomComboItem[];
  createdAt: string;
};

const SAVED_COMBOS_KEY = "kiana-custom-combos-v1";

/**
 * Calculates dynamic tier discount based on selected item count:
 * - 2 items: 15% OFF
 * - 3 items: 20% OFF
 * - 4+ items: 25% OFF
 */
export function calculateComboDiscount(itemsCount: number, subtotal: number) {
  let discountPercent = 0;
  if (itemsCount >= 4) {
    discountPercent = 25;
  } else if (itemsCount === 3) {
    discountPercent = 20;
  } else if (itemsCount === 2) {
    discountPercent = 15;
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalPrice = Math.max(0, subtotal - discountAmount);

  return {
    discountPercent,
    discountAmount,
    finalPrice,
  };
}

export function getNextTierBonus(itemsCount: number): { itemsNeeded: number; nextDiscountPercent: number } | null {
  if (itemsCount < 2) {
    return { itemsNeeded: 2 - itemsCount, nextDiscountPercent: 15 };
  }
  if (itemsCount === 2) {
    return { itemsNeeded: 1, nextDiscountPercent: 20 };
  }
  if (itemsCount === 3) {
    return { itemsNeeded: 1, nextDiscountPercent: 25 };
  }
  return null; // Max discount reached!
}

export function loadSavedCustomCombos(): CustomCombo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_COMBOS_KEY);
    return raw ? (JSON.parse(raw) as CustomCombo[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomComboToStorage(combo: CustomCombo): CustomCombo[] {
  if (typeof window === "undefined") return [];
  const current = loadSavedCustomCombos();
  const updated = [combo, ...current.filter((c) => c.id !== combo.id)];
  try {
    window.localStorage.setItem(SAVED_COMBOS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore storage errors */
  }
  return updated;
}

export function deleteCustomComboFromStorage(comboId: string): CustomCombo[] {
  if (typeof window === "undefined") return [];
  const current = loadSavedCustomCombos();
  const updated = current.filter((c) => c.id !== comboId);
  try {
    window.localStorage.setItem(SAVED_COMBOS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore storage errors */
  }
  return updated;
}
