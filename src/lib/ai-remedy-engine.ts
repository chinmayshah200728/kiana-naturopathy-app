import type { Product } from "@/data/products";

export type AIRecommendationResult = {
  replyText: string;
  matchedProducts: Product[];
  healthTopic: string;
};

// Health Condition Keyword Mappings
const CONDITION_PATTERNS: { topic: string; keywords: string[]; defaultCategory: string }[] = [
  {
    topic: "Digestion & Acidity",
    keywords: ["digest", "acid", "bloat", "gas", "stomach", "gut", "constipation", "triphala", "reflux", "food"],
    defaultCategory: "Detox Kits",
  },
  {
    topic: "Stress & Sleep",
    keywords: ["sleep", "stress", "insomnia", "anxiety", "relax", "calm", "unwind", "ashwagandha", "lavender", "night"],
    defaultCategory: "Herbal Supplements",
  },
  {
    topic: "Skin Clarity & Glow",
    keywords: ["skin", "acne", "glow", "face", "clay", "neem", "pimple", "complexion", "skincare", "purify"],
    defaultCategory: "Skin Care",
  },
  {
    topic: "Immunity & Energy",
    keywords: ["immunit", "amla", "vitamin", "cold", "flu", "energy", "vitality", "stamina", "honey", "tulsi", "tea"],
    defaultCategory: "Natural Juices",
  },
  {
    topic: "Hair & Scalp Care",
    keywords: ["hair", "scalp", "dandruff", "hairfall", "follicle", "growth", "oil"],
    defaultCategory: "Herbal Oils",
  },
  {
    topic: "Detox & Internal Reset",
    keywords: ["detox", "cleanse", "reset", "toxin", "liver", "kidney", "pune", "sachet"],
    defaultCategory: "Detox Kits",
  },
];

/**
 * AI Engine: Dynamically analyzes every product in productsList
 * and matches user health query to relevant remedies with practitioner advice.
 */
export function processAIRemedyQuery(
  userQuery: string,
  catalog: Product[]
): AIRecommendationResult {
  const queryLower = userQuery.toLowerCase().trim();

  // Find matching health topic
  let detectedTopic = "General Wellness & Natural Remedies";
  for (const pattern of CONDITION_PATTERNS) {
    if (pattern.keywords.some((kw) => queryLower.includes(kw))) {
      detectedTopic = pattern.topic;
      break;
    }
  }

  // Score each product in the catalog based on query relevance
  const scoredProducts = catalog.map((product) => {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const shortLower = product.short.toLowerCase();
    const descLower = product.description.toLowerCase();
    const catLower = product.category.toLowerCase();
    const benefitsText = product.benefits.join(" ").toLowerCase();
    const ingredientsText = product.ingredients.join(" ").toLowerCase();
    const tagsText = product.tags.join(" ").toLowerCase();

    // Direct product name match
    if (nameLower.includes(queryLower)) score += 30;

    // Direct keyword matches across product fields
    const words = queryLower.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (nameLower.includes(word)) score += 10;
      if (catLower.includes(word)) score += 8;
      if (tagsText.includes(word)) score += 7;
      if (benefitsText.includes(word)) score += 5;
      if (ingredientsText.includes(word)) score += 5;
      if (shortLower.includes(word)) score += 4;
      if (descLower.includes(word)) score += 2;
    }

    // Boost bestsellers and featured items slightly
    if (product.bestseller) score += 2;
    if (product.featured) score += 1;

    return { product, score };
  });

  // Sort products by score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  // Pick top 1 to 3 relevant products
  let topMatches = scoredProducts.filter((sp) => sp.score > 0).map((sp) => sp.product);

  // Fallback if query didn't match any specific keywords
  if (topMatches.length === 0) {
    topMatches = catalog.filter((p) => p.featured || p.bestseller).slice(0, 3);
  } else {
    topMatches = topMatches.slice(0, 3);
  }

  // Generate Practitioner AI Response Text
  const primaryProduct = topMatches[0];
  let adviceText = "";

  if (detectedTopic.includes("Digestion")) {
    adviceText = `In naturopathy, digestive discomfort like bloating, acidity, or sluggish transit stems from an imbalance in digestive fire (Agni). To reset your gut naturally, sip warm water with lemon in the morning, avoid heavy raw foods after sunset, and use practitioner-guided herbal formulations. Here are our top recommended natural remedies for digestive clarity:`;
  } else if (detectedTopic.includes("Stress") || detectedTopic.includes("Sleep")) {
    adviceText = `Restorative sleep and nervous system balance are foundational to body healing. In naturopathy, chronic stress elevates cortisol and disrupts natural sleep architecture. We recommend adaptogenic herbs like KSM-66 Ashwagandha paired with soothing lavender aroma and evening herbal infusions. Here are your practitioner-recommended stress remedies:`;
  } else if (detectedTopic.includes("Skin")) {
    adviceText = `True skin radiance comes from purifying the body both internally and topically. Synthetic chemicals can irritate skin barriers, whereas gentle French clays, virgin neem oil, and antioxidant-rich teas clear impurites naturally. Here are the top practitioner formulations for clear, glowing skin:`;
  } else if (detectedTopic.includes("Immunity")) {
    adviceText = `Strong immunity relies on bioavailable Vitamin C, natural antioxidants, and gut vitality. Wild cold-pressed amla juice and raw pure & natural honeys provide immediate phytonutrients to protect cellular health. Here are the best practitioner-selected immunity boosters:`;
  } else if (detectedTopic.includes("Hair")) {
    adviceText = `Hair vitality reflects internal nourishment and scalp circulation. Cold-pressed virgin herbal oils gently nourish hair follicles without synthetic silicones. Here are our recommended remedies:`;
  } else {
    adviceText = `Welcome to Kiana Naturopathy! Based on your query regarding "${userQuery}", our practitioner system has analyzed our live remedy catalog. Here are the best natural formulations tailored to your request:`;
  }

  return {
    replyText: adviceText,
    matchedProducts: topMatches,
    healthTopic: detectedTopic,
  };
}
