export interface HealthBundle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  image: string;
  discountPercent: number;
  items: {
    slug: string;
    name: string;
    price: number;
    image: string;
  }[];
}

export const HEALTH_BUNDLES: HealthBundle[] = [
  {
    id: "bundle-detox-trio",
    slug: "full-body-detox-immunity-trio",
    title: "Full Body Detox & Immunity Trio",
    tagline: "Complete 3-step internal reset: Gentle Detox Kit + Organic Triphala + Cold-Pressed Amla Juice",
    category: "Detox Kits",
    image: "/assets/img/p-detox.jpg",
    discountPercent: 20,
    items: [
      {
        slug: "7-day-detox-kit",
        name: "7-Day Gentle Detox Kit",
        price: 1499,
        image: "/assets/img/p-detox.jpg",
      },
      {
        slug: "triphala-powder",
        name: "Organic Triphala Churna Powder",
        price: 399,
        image: "/assets/img/p-supplements.jpg",
      },
      {
        slug: "amla-immunity-juice",
        name: "Pure Cold-Pressed Amla Juice",
        price: 459,
        image: "/assets/img/p-detox.jpg",
      },
    ],
  },
  {
    id: "bundle-stress-sleep",
    slug: "stress-free-restorative-sleep-combo",
    title: "Stress-Free Restorative Sleep Combo",
    tagline: "Unwind your nervous system: KSM-66 Ashwagandha + Kashmir Lavender Oil + Hibiscus Tea",
    category: "Herbal Supplements",
    image: "/assets/img/p-supplements.jpg",
    discountPercent: 20,
    items: [
      {
        slug: "ashwagandha-capsules",
        name: "KSM-66 Ashwagandha Root Capsules",
        price: 649,
        image: "/assets/img/p-supplements.jpg",
      },
      {
        slug: "lavender-oil",
        name: "Kashmir Lavender Essential Oil",
        price: 549,
        image: "/assets/img/p-oils.jpg",
      },
      {
        slug: "hibiscus-detox-tea",
        name: "Wild Hibiscus & Mint Detox Tea",
        price: 299,
        image: "/assets/img/p-tea.jpg",
      },
    ],
  },
  {
    id: "bundle-skin-glow",
    slug: "radiant-skin-glow-purifying-combo",
    title: "Radiant Skin Glow & Purifying Combo",
    tagline: "Natural skin clarity from inside & out: French Green Clay Mask + Cold-Pressed Virgin Neem Oil + Tulsi Green Tea",
    category: "Skin Care",
    image: "/assets/img/p-skincare.jpg",
    discountPercent: 20,
    items: [
      {
        slug: "green-clay-face-mask",
        name: "French Green Clay & Neem Purifying Mask",
        price: 549,
        image: "/assets/img/p-skincare.jpg",
      },
      {
        slug: "neem-oil-skin",
        name: "Cold-Pressed Virgin Neem Oil",
        price: 389,
        image: "/assets/img/p-skincare.jpg",
      },
      {
        slug: "tulsi-green-tea",
        name: "Holy Basil Tulsi Ginger Green Tea",
        price: 329,
        image: "/assets/img/p-tea.jpg",
      },
    ],
  },
];
