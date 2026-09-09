export type Post = {
  slug: string; category: string; title: string; lead: string; meta: string;
  description: string; paragraphs: string[];
};

export const posts: Post[] = [
  {
    "slug": "an-honest-guide-to-detox",
    "category": "Detox Guides",
    "title": "An Honest Guide to Detox",
    "lead": "What a detox programme can realistically do, what it cannot, and how to do one safely.",
    "meta": "Jun 04 2026 · 7 min read",
    "paragraphs": [
      "Your liver and kidneys already detoxify. No juice removes toxins that they do not. What a structured detox programme genuinely offers is a break from ultra-processed food, alcohol, late nights and grazing — and a week of practised routine.",
      "That reset is valuable. People finish the week sleeping better, eating more vegetables and drinking more water, and many keep some of those habits."
    ],
    "description": "What a detox programme can realistically do, what it cannot, and how to do one safely."
  },
  {
    "slug": "building-a-balanced-indian-plate",
    "category": "Healthy Diet",
    "title": "Building a Balanced Indian Plate",
    "lead": "How to structure dal, roti, sabzi and curd so a familiar plate supports steady energy instead of an afternoon crash.",
    "meta": "Jul 18 2026 · 6 min read",
    "paragraphs": [
      "A balanced plate does not require imported superfoods. It requires proportion. Half the plate should be vegetables in at least two colours, a quarter protein — dal, sprouts, paneer, eggs or fish — and a quarter whole grain such as jowar, bajra, hand-pounded rice or whole-wheat roti.",
      "Order matters as much as content. Starting a meal with salad or a vegetable, then protein, then the grain, slows the rise in blood sugar and leaves most people feeling satisfied on less food.",
      "Curd or buttermilk at lunch adds an easy source of fermented food. A spoon of ghee is not the enemy; the enemy is the packet of refined snacks at 5 pm because lunch was mostly rice."
    ],
    "description": "How to structure dal, roti, sabzi and curd so a familiar plate supports steady energy instead of an afternoon crash."
  },
  {
    "slug": "five-natural-remedies-for-seasonal-change",
    "category": "Natural Remedies",
    "title": "Five Natural Remedies for Seasonal Change",
    "lead": "Simple kitchen-shelf routines that may help support comfort when the weather turns.",
    "meta": "Jul 02 2026 · 5 min read",
    "paragraphs": [
      "Seasonal transitions ask more of the body. These five kitchen routines are gentle, inexpensive and easy to keep.",
      "1. Warm water with lemon on waking, to start the day hydrated. 2. A five-minute kadha of tulsi, ginger and mulethi in the evening. 3. Steam inhalation with two drops of eucalyptus oil when the air is dry. 4. A teaspoon of raw honey with warm water — never boiling. 5. An earlier, lighter dinner so sleep is not competing with digestion."
    ],
    "description": "Simple kitchen-shelf routines that may help support comfort when the weather turns."
  },
  {
    "slug": "herbs-worth-knowing",
    "category": "Herbal Medicine",
    "title": "Six Herbs Worth Knowing",
    "lead": "Tulsi, ashwagandha, amla, triphala, neem and turmeric — traditional uses and sensible cautions.",
    "meta": "May 16 2026 · 6 min read",
    "paragraphs": [
      "Herbs have a long traditional record and a growing, uneven evidence base. Treat them as complements to a good diet, not substitutes for prescribed treatment.",
      "Tulsi is a warming daily infusion. Ashwagandha is used as an adaptogen for periods of stress. Amla is a natural source of vitamin C. Triphala supports regularity. Neem is used topically for skin. Turmeric with black pepper is a kitchen staple with anti-inflammatory tradition."
    ],
    "description": "Tulsi, ashwagandha, amla, triphala, neem and turmeric — traditional uses and sensible cautions."
  },
  {
    "slug": "monsoon-wellness-checklist",
    "category": "Seasonal Wellness",
    "title": "The Monsoon Wellness Checklist",
    "lead": "Food safety, digestion and movement adjustments for the rainy months.",
    "meta": "Apr 28 2026 · 5 min read",
    "paragraphs": [
      "Monsoon slows digestion for many people and raises the risk of waterborne infection. Adjust rather than overhaul.",
      "Prefer cooked, warm food over raw salads. Boil or filter drinking water. Favour bitter and astringent vegetables. Keep ginger, ajwain and jeera in daily rotation."
    ],
    "description": "Food safety, digestion and movement adjustments for the rainy months."
  },
  {
    "slug": "ten-minute-morning-yoga",
    "category": "Yoga Tips",
    "title": "A Ten-Minute Morning Yoga Sequence",
    "lead": "A short, joint-friendly sequence you can hold to on the busiest weekday morning.",
    "meta": "Jun 20 2026 · 4 min read",
    "paragraphs": [
      "Consistency beats intensity. Ten honest minutes every morning outperform a ninety-minute class once a fortnight.",
      "Begin with two minutes of seated breathing, lengthening the exhale. Move into cat-cow for ten rounds, then a slow sun salutation cycle at half pace. Finish with a supine twist on each side and two minutes of stillness."
    ],
    "description": "A short, joint-friendly sequence you can hold to on the busiest weekday morning."
  }
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
