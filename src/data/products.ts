export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  short: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  usage?: string;
  price: number;
  comparePrice: number | null;
  image: string;
  rating: number;
  reviewsCount: number;
  reviewsList?: Review[];
  inStock: boolean;
  stockCount?: number;
  featured: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  organic?: boolean;
  tags: string[];
};

export const products: Product[] = [
  {
    slug: "7-day-detox-kit",
    name: "7-Day Gentle Detox Kit",
    category: "Detox Kits",
    short: "A complete practitioner-guided week of herbal sachets, green superfoods, and daily routine plan.",
    description:
      "Everything needed for a gentle 7-day digestive and energy reset. Designed by senior naturopaths in Mumbai, this kit combines morning wheatgrass-moringa greens powder, evening herbal sachets, and a step-by-step daily diet guide built around everyday Indian meals.",
    benefits: [
      "Structured 7-day program to reset digestion and eating habits",
      "Supports natural hepatic and renal elimination pathways",
      "Includes daily hydration timetable and regional meal suggestions",
      "Free from harsh chemical laxatives or artificial stimulants"
    ],
    ingredients: [
      "Pure & Natural Wheatgrass & Moringa Leaf Powder",
      "Senna-Free Triphala & Licorice Infusion Sachets",
      "Lemon-Ginger-Tulsi Herbal Tea Bags"
    ],
    usage: "Mix 1 scoop of greens powder in warm water at sunrise. Sip 1 herbal infusion bag after dinner.",
    price: 1499,
    comparePrice: 1899,
    image: "/assets/img/p-detox.jpg",
    rating: 4.8,
    reviewsCount: 63,
    inStock: true,
    stockCount: 14,
    featured: true,
    bestseller: true,
    isNew: false,
    organic: true,
    tags: ["Detox", "Pure & Natural", "Digestive Health", "Best Seller"],
    reviewsList: [
      {
        id: "r1",
        author: "Pooja Sharma",
        rating: 5,
        date: "2 weeks ago",
        comment: "Felt significantly lighter by day 4! The recipe booklet makes it so easy to follow without starving.",
        verified: true
      },
      {
        id: "r2",
        author: "Dr. K. V. Raman",
        rating: 5,
        date: "1 month ago",
        comment: "Very well-balanced kit. Clean ingredients and gentle on stomach. Recommended to my clinic patients.",
        verified: true
      }
    ]
  },
  {
    slug: "amla-immunity-juice",
    name: "Pure Cold-Pressed Amla Juice",
    category: "Natural Juices",
    short: "100% wild Indian gooseberry juice with zero added water or refined sugar.",
    description:
      "Directly pressed from fresh, wild-harvested Indian gooseberries (Amla). Unfiltered to preserve natural pulp, Vitamin C, and antioxidants that support immune defense, healthy skin, and hair vitality.",
    benefits: [
      "Exceptionally rich in bioavailable Vitamin C",
      "Promotes skin radiance and collagen synthesis",
      "Helps balance stomach acidity and digestive fire (Agni)",
      "Zero added sugar, artificial colours, or diluted water"
    ],
    ingredients: [
      "100% Cold-Pressed Wild Emblica Officinalis (Amla) Extract",
      "Natural acidity regulator (Citric Acid)"
    ],
    usage: "Dilute 30ml in 150ml warm water on an empty stomach every morning.",
    price: 459,
    comparePrice: 549,
    image: "/assets/img/p-detox.jpg",
    rating: 4.6,
    reviewsCount: 88,
    inStock: true,
    stockCount: 28,
    featured: false,
    bestseller: true,
    organic: true,
    tags: ["Immunity", "Vitamin C", "Pure & Natural", "Juice"],
    reviewsList: [
      {
        id: "r3",
        author: "Anil Kulkarni",
        rating: 5,
        date: "3 weeks ago",
        comment: "Tangy and pure! You can taste the real amla. My morning energy has improved noticeably.",
        verified: true
      }
    ]
  },
  {
    slug: "ashwagandha-capsules",
    name: "KSM-66 Ashwagandha Root Capsules",
    category: "Herbal Supplements",
    short: "High-potency pure and natural adaptogen for stress relief, calm energy, and deep sleep.",
    description:
      "Formulated with full-spectrum KSM-66 Ashwagandha root extract. Recognized in traditional Indian wellness for mitigating cortisol levels, enhancing stamina, and fostering restorative night sleep.",
    benefits: [
      "Supports healthy cortisol balance and daily stress resilience",
      "Fosters calm focus and mental clarity without drowsiness",
      "Encourages restorative sleep patterns and muscle recovery",
      "100% Vegetarian HPMC capsules with zero fillers"
    ],
    ingredients: [
      "Standardized KSM-66 Ashwagandha (Withania Somnifera) Root Extract (500mg)",
      "Plant Cellulose Capsule Shell"
    ],
    usage: "Take 1 capsule twice daily after meals with warm water or warm milk.",
    price: 649,
    comparePrice: 799,
    image: "/assets/img/p-supplements.jpg",
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockCount: 8,
    featured: true,
    bestseller: true,
    organic: true,
    tags: ["Stress", "Adaptogen", "Sleep", "Best Seller"],
    reviewsList: [
      {
        id: "r4",
        author: "Meera Joshi",
        rating: 5,
        date: "5 days ago",
        comment: "Transformed my sleep quality within 10 days. I wake up refreshed instead of groggy.",
        verified: true
      }
    ]
  },
  {
    slug: "immunity-kadha",
    name: "Traditional Daily Immunity Kadha Mix",
    category: "Immunity Boosters",
    short: "Authentic brew of 12 Ayurvedic herbs & spices for throat comfort and seasonal defense.",
    description:
      "A comforting herbal decoction blend passed down through generations. Features course-ground Tulsi, Mulethi, Dry Ginger, Black Pepper, Cinnamon, and Cloves to shield your throat and lungs during seasonal changes.",
    benefits: [
      "Soothes tickly throat, nasal congestion, and mild cough",
      "Warming daily ritual for monsoon and winter mornings",
      "Fights free radicals with powerful kitchen spices",
      "No artificial preservatives or added sugars"
    ],
    ingredients: [
      "Krishna Tulsi",
      "Mulethi (Licorice Root)",
      "Dry Ginger (Sonth)",
      "Clove (Laung)",
      "Black Pepper (Kali Mirch)",
      "Cinnamon (Dalchini)",
      "Giloy (Guduchi)"
    ],
    usage: "Simmer 1 tsp in 200ml water for 5 mins. Strain, add raw honey if desired, and sip hot.",
    price: 379,
    comparePrice: 449,
    image: "/assets/img/p-supplements.jpg",
    rating: 4.7,
    reviewsCount: 110,
    inStock: true,
    stockCount: 35,
    featured: false,
    bestseller: false,
    organic: true,
    tags: ["Immunity", "Kadha", "Seasonal", "Ayurvedic"],
    reviewsList: [
      {
        id: "r5",
        author: "Rohan Patil",
        rating: 5,
        date: "2 weeks ago",
        comment: "Must-have for rainy season! Clears throat instantly.",
        verified: true
      }
    ]
  },
  {
    slug: "eucalyptus-oil",
    name: "Pure Nilgiri Eucalyptus Essential Oil",
    category: "Essential Oils",
    short: "100% Steam-distilled pure oil for steam inhalation, diffusion & chest rub blends.",
    description:
      "Sourced from the pristine Nilgiri hills. High in natural eucalyptol content, making it ideal for clearing respiratory passages, relieving headache tightness, and refreshing indoor air.",
    benefits: [
      "Clears blocked sinuses during steam inhalation",
      "Revitalizing woody fragrance for ultrasonic diffusers",
      "Relieves tight shoulder and neck muscles when blended with carrier oil",
      "Packed in light-blocking amber glass bottle"
    ],
    ingredients: ["100% Pure Eucalyptus Globulus Leaf Oil"],
    usage: "Add 3-4 drops to a hot water steam bowl or 5 drops in a diffuser.",
    price: 449,
    comparePrice: 549,
    image: "/assets/img/p-oils.jpg",
    rating: 4.8,
    reviewsCount: 97,
    inStock: true,
    stockCount: 19,
    featured: true,
    bestseller: false,
    organic: true,
    tags: ["Essential Oil", "Respiratory", "Nilgiri", "Aromatherapy"],
    reviewsList: [
      {
        id: "r6",
        author: "Sunita Rao",
        rating: 5,
        date: "1 month ago",
        comment: "Incredible fragrance! Just 2 drops in steam brings immediate relief.",
        verified: true
      }
    ]
  },
  {
    slug: "green-clay-face-mask",
    name: "French Green Clay & Neem Purifying Mask",
    category: "Skin Care",
    short: "Deep pore cleansing clay mask to absorb oil, calm breakouts, and refine skin texture.",
    description:
      "A therapeutic botanical clay treatment combining mineral-rich French green clay with pure and natural Neem leaf powder and cooling Aloe Vera. Gently pulls out impurities and unclogs pores without stripping moisture.",
    benefits: [
      "Absorbs excessive sebum and shrinks visible pores",
      "Calms active acne redness and skin irritation",
      "Leaves skin feeling velvety soft, clear, and rejuvenated",
      "Formulated without parabens, sulfates, or synthetic fragrance"
    ],
    ingredients: [
      "French Montmorillonite Green Clay",
      "Pure & Natural Neem Leaf Powder",
      "Cold-Extracted Aloe Vera Gel",
      "Vetiver Hydrosol"
    ],
    usage: "Mix 1 tbsp with rose water or curd to form paste. Apply thin layer, leave for 10 mins, rinse.",
    price: 549,
    comparePrice: 649,
    image: "/assets/img/p-skincare.jpg",
    rating: 4.7,
    reviewsCount: 89,
    inStock: true,
    stockCount: 12,
    featured: true,
    isNew: true,
    organic: true,
    tags: ["Skincare", "Acne", "Clay Mask", "Neem"],
    reviewsList: [
      {
        id: "r7",
        author: "Kavya N.",
        rating: 5,
        date: "3 weeks ago",
        comment: "My oily T-zone feels so clean after using this twice a week. Doesn't dry out skin!",
        verified: true
      }
    ]
  },
  {
    slug: "hibiscus-detox-tea",
    name: "Wild Hibiscus & Mint Detox Tea",
    category: "Herbal Teas",
    short: "Caffeine-free ruby-red botanical infusion for hydration and heart health.",
    description:
      "A vibrant tart floral brew rich in bioflavonoids and antioxidants. Hand-blended sun-dried Hibiscus calyces, spearmint, fennel seeds, and Damask rose petals for a refreshing hot or iced tea.",
    benefits: [
      "Caffeine-free antioxidant drink for fluid balance",
      "Supports healthy blood pressure levels naturally",
      "Cooling digestant after heavy afternoon meals",
      "Delicious hot or served chilled over ice with lemon"
    ],
    ingredients: [
      "Sun-Dried Hibiscus Sabdariffa Flowers",
      "Spearmint Leaves",
      "Sweet Fennel Seeds",
      "Dried Damask Rose Petals"
    ],
    usage: "Steep 1 tsp loose leaf in boiled water for 5 minutes. Enjoy warm or chilled.",
    price: 299,
    comparePrice: 349,
    image: "/assets/img/p-tea.jpg",
    rating: 4.5,
    reviewsCount: 54,
    inStock: true,
    stockCount: 22,
    featured: false,
    bestseller: false,
    organic: true,
    tags: ["Tea", "Caffeine-Free", "Hibiscus", "Hydration"],
    reviewsList: []
  },
  {
    slug: "lavender-oil",
    name: "Kashmir Lavender Essential Oil",
    category: "Essential Oils",
    short: "Pure Kashmir altitude lavender oil for evening relaxation, anxiety reduction & pillow spray.",
    description:
      "Distilled from lavender grown in high altitude Kashmir valleys. Naturally rich in linalool, providing a soothing floral fragrance ideal for winding down after stressful work days.",
    benefits: [
      "Promotes deep muscle relaxation and nervous system calm",
      "Excellent bedtime diffuser companion for insomnia relief",
      "Soothes minor skin bites and scalding when diluted",
      "100% Undiluted pure Kashmir essential oil"
    ],
    ingredients: ["100% Pure Kashmir Lavandula Angustifolia Oil"],
    usage: "Rub 2 drops between palms and inhale deep, or put 3 drops on pillow corners before sleep.",
    price: 549,
    comparePrice: 649,
    image: "/assets/img/p-oils.jpg",
    rating: 4.9,
    reviewsCount: 143,
    inStock: true,
    stockCount: 16,
    featured: false,
    bestseller: true,
    organic: true,
    tags: ["Lavender", "Essential Oil", "Sleep", "Kashmir"],
    reviewsList: []
  },
  {
    slug: "raw-forest-honey",
    name: "Wild Multiflora Raw Forest Honey",
    category: "Pure & Natural Honey",
    short: "Raw, unpasteurized honey harvested from wild forest beehives. Zero added sugar syrup.",
    description:
      "Collected by tribal bee-gatherers in dense forest reserves. Never heated above hive temperature or fine-filtered, retaining live beneficial enzymes, wild pollen, and mineral richness.",
    benefits: [
      "Natural low-GI alternative to refined sugar",
      "Soothes coughs and throat inflammation instantly",
      "Contains living enzymes and wild flower pollen",
      "100% Raw, unfiltered, and lab-tested pure"
    ],
    ingredients: ["100% Raw Wild Multiflora Bee Honey"],
    usage: "Take 1 spoon daily with warm (not boiling) lemon water, or over oats and fruit.",
    price: 699,
    comparePrice: 849,
    image: "/assets/img/p-honey.jpg",
    rating: 5.0,
    reviewsCount: 312,
    inStock: true,
    stockCount: 40,
    featured: true,
    bestseller: true,
    organic: true,
    tags: ["Honey", "Raw", "Wild", "Best Seller"],
    reviewsList: [
      {
        id: "r8",
        author: "Vikram R.",
        rating: 5,
        date: "1 week ago",
        comment: "This is genuine forest honey. You can see slight crystallization which proves it is unheated. Taste is rich!",
        verified: true
      }
    ]
  },
  {
    slug: "triphala-powder",
    name: "Pure & Natural Triphala Churna Powder",
    category: "Health Powders",
    short: "Classic 3-fruit digestion & bowel regularity formula milled from pure and natural fruits.",
    description:
      "Formulated with equal ratios of Amla, Haritaki, and Bibhitaki. Takes care of daily bowel regularity, gently cleanses colon residues, and aids nutrient assimilation.",
    benefits: [
      "Supports smooth, painless morning bowel elimination",
      "Gently cleanses digestive tract without creating dependency",
      "Rich in natural vitamin C and polyphenol antioxidants",
      "Pure & natural certified raw fruit powder"
    ],
    ingredients: [
      "Equal parts pure & natural Amla (Emblica Officinalis)",
      "Haritaki (Terminalia Chebula)",
      "Bibhitaki (Terminalia Bellirica)"
    ],
    usage: "Mix 1 tsp in lukewarm water before bedtime.",
    price: 399,
    comparePrice: 499,
    image: "/assets/img/p-supplements.jpg",
    rating: 4.7,
    reviewsCount: 86,
    inStock: true,
    stockCount: 30,
    featured: false,
    bestseller: true,
    organic: true,
    tags: ["Triphala", "Digestion", "Colon Cleanse", "Pure & Natural"],
    reviewsList: []
  },
  {
    slug: "tulsi-green-tea",
    name: "Holy Basil Tulsi Ginger Green Tea",
    category: "Herbal Teas",
    short: "Whole-leaf pure & natural green tea paired with spicy ginger & fragrant Krishna Tulsi.",
    description:
      "Whole-leaf Assam green tea hand-blended with pure & natural Krishna Tulsi leaves, dried ginger bits, and fragrant lemongrass. Clean antioxidant energy without jittery caffeine crashes.",
    benefits: [
      "Boosts metabolism and supports fat oxidation",
      "Soothes digestive heaviness after meals",
      "Clean, calm alertness for work hours",
      "Biodegradable pyramid teabags"
    ],
    ingredients: [
      "Pure & Natural Whole Green Tea Leaves",
      "Krishna Tulsi Leaves",
      "Dried Ginger Root Bits",
      "Lemongrass"
    ],
    usage: "Steep 1 pyramid bag in 85°C hot water for 3 minutes.",
    price: 329,
    comparePrice: 399,
    image: "/assets/img/p-tea.jpg",
    rating: 4.8,
    reviewsCount: 201,
    inStock: true,
    stockCount: 25,
    featured: true,
    bestseller: true,
    organic: true,
    tags: ["Green Tea", "Tulsi", "Metabolism", "Pure & Natural"],
    reviewsList: []
  },
  {
    slug: "neem-oil-skin",
    name: "Cold-Pressed Virgin Neem Oil",
    category: "Skin Care",
    short: "100% Pure unrefined neem seed oil for acne control, scalp care & skin relief.",
    description:
      "Extracted from pure & natural neem seeds using traditional cold-pressing. Natural antimicrobial and anti-fungal properties help soothe scalp dandruff, acne blemishes, and dry skin patches.",
    benefits: [
      "Natural antibacterial treatment for acne spots",
      "Nourishes scalp and helps prevent dandruff flakes",
      "Calms itchy skin conditions and eczema irritation",
      "100% Pure, unrefined, zero chemical solvent extraction"
    ],
    ingredients: ["100% Cold-Pressed Azadirachta Indica (Neem) Seed Oil"],
    usage: "Dilute 1:1 with sesame or coconut oil for scalp massage, or apply 1 drop to acne spot.",
    price: 389,
    comparePrice: 459,
    image: "/assets/img/p-skincare.jpg",
    rating: 4.6,
    reviewsCount: 47,
    inStock: true,
    stockCount: 15,
    featured: false,
    isNew: true,
    organic: true,
    tags: ["Neem", "Acne", "Scalp Care", "Pure & Natural"],
    reviewsList: []
  },
  {
    slug: "shatavari-hormone-support",
    name: "Shatavari Pure & Natural Root Extract",
    category: "Herbal Supplements",
    short: "Traditional women's tonic for hormonal balance, cycle rhythm & vitality.",
    description:
      "Pure Shatavari (Asparagus Racemosus) root extract. Known as the 'Queen of Herbs' in Ayurveda, supporting female reproductive health, cycle comfort, and stamina across all life stages.",
    benefits: [
      "Supports healthy female hormonal equilibrium",
      "Promotes smooth menstrual cycles and relieves PMS discomfort",
      "Nourishes reproductive tissues and vitality",
      "100% Pure & Natural certified vegetarian capsules"
    ],
    ingredients: ["Pure & Natural Shatavari Root Extract (500mg)", "Plant Cellulose Capsule"],
    usage: "Take 1 capsule twice daily with warm milk or water.",
    price: 699,
    comparePrice: 849,
    image: "/assets/img/p-supplements.jpg",
    rating: 4.9,
    reviewsCount: 76,
    inStock: true,
    stockCount: 11,
    featured: true,
    isNew: true,
    organic: true,
    tags: ["Women Wellness", "PCOS", "Hormonal Health", "Pure & Natural"],
    reviewsList: []
  },
  {
    slug: "joint-care-herbal-oil",
    name: "Maha Narayan Joint Relief Oil",
    category: "Essential Oils",
    short: "Traditional Ayurvedic warm infusion of 32 herbs for joint stiffness & muscle aching.",
    description:
      "Authentic Maha Narayan taila prepared with sesame oil base infused with 32 anti-inflammatory herbs including Ashwagandha, Bala, Shatavari, and Camphor. Rapid relief for knees, lower back, and shoulders.",
    benefits: [
      "Warming relief for stiff morning joints and muscles",
      "Enhances local circulation and flexibility",
      "Deeply penetrating sesame oil herbal blend",
      "Ideal post-workout or age-related joint care"
    ],
    ingredients: [
      "Sesamum Indicum Oil",
      "Withania Somnifera",
      "Sida Cordifolia",
      "Natural Camphor",
      "Eucalyptus Oil"
    ],
    usage: "Warm slightly, massage gently over affected joints for 10 minutes. Follow with hot compress.",
    price: 599,
    comparePrice: 729,
    image: "/assets/img/p-oils.jpg",
    rating: 4.8,
    reviewsCount: 92,
    inStock: true,
    stockCount: 18,
    featured: false,
    bestseller: true,
    organic: true,
    tags: ["Joint Relief", "Arthritis", "Massage Oil", "Ayurvedic"],
    reviewsList: []
  }
];

export const categories = Array.from(new Set(products.map((p) => p.category)));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
