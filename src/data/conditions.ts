export type Condition = {
  slug: string; title: string; lead: string; description: string;
  cards: { title: string; items: string[] }[];
};

export const conditions: Condition[] = [
  {
    "slug": "arthritis",
    "title": "Arthritis & Joint Pain",
    "lead": "Anti-inflammatory eating, mobility work and thermal therapies that may help manage stiffness and discomfort.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Joint stiffness, worse in the morning",
          "Swelling and warmth",
          "Reduced range of motion",
          "Pain on movement"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Age-related cartilage wear",
          "Autoimmune activity",
          "Excess body weight loading joints",
          "Past injury",
          "Inflammatory diet patterns"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Anti-inflammatory diet planning rich in omega-3s and colourful vegetables",
          "Hot and cold fomentation and mud packs for local comfort",
          "Therapeutic massage and gentle joint mobilisation",
          "Water-based movement to reduce joint loading"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Keep joints moving daily within comfort",
          "Maintain a healthy weight",
          "Use warm compresses on stiff mornings",
          "Avoid prolonged immobility"
        ]
      }
    ],
    "description": "Anti-inflammatory eating, mobility work and thermal therapies that may help manage stiffness and discomfort."
  },
  {
    "slug": "back-pain",
    "title": "Back Pain",
    "lead": "Posture correction, targeted strengthening and thermal therapies for everyday spinal comfort.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Dull or sharp lower back pain",
          "Stiffness after sitting",
          "Pain radiating to the leg",
          "Reduced flexibility"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Prolonged sitting and poor ergonomics",
          "Weak core muscles",
          "Improper lifting",
          "Excess weight",
          "Old injuries"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Therapeutic yoga for core and spinal support",
          "Massage therapy and hot fomentation",
          "Mud packs and hydrotherapy for local relief",
          "Ergonomic and posture coaching for work setups"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Stand and stretch every 30 minutes",
          "Lumbar-supported seating",
          "Daily core work",
          "Lift with the legs, not the back"
        ]
      }
    ],
    "description": "Posture correction, targeted strengthening and thermal therapies for everyday spinal comfort."
  },
  {
    "slug": "diabetes",
    "title": "Diabetes (Supportive Care)",
    "lead": "Supportive naturopathic care alongside your doctor's treatment plan, focused on diet quality, movement and stress.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Frequent urination",
          "Increased thirst and hunger",
          "Unexplained fatigue",
          "Slow-healing wounds",
          "Blurred vision"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Insulin resistance",
          "Sedentary routine and excess weight",
          "Highly refined carbohydrate intake",
          "Family history",
          "Chronic stress and poor sleep"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Structured low-glycaemic diet planning with an emphasis on fibre and whole grains",
          "Guided yoga and walking routines that may help support healthy weight and insulin sensitivity",
          "Stress-reduction practices such as pranayama and yoga nidra",
          "Herbal support may be suggested as a complement, never as a replacement for prescribed medication"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Eat at consistent times, avoid long gaps",
          "30–45 minutes of daily brisk walking",
          "Prioritise 7–8 hours of sleep",
          "Track readings with your doctor"
        ]
      }
    ],
    "description": "Supportive naturopathic care alongside your doctor's treatment plan, focused on diet quality, movement and stress."
  },
  {
    "slug": "digestive-disorders",
    "title": "Digestive Disorders",
    "lead": "For acidity, bloating, IBS-type discomfort and irregularity — rebuilding routine, fibre and gut calm.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Bloating and gas",
          "Acidity or reflux",
          "Irregular bowel habits",
          "Abdominal cramping",
          "Heaviness after meals"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Irregular meal timing",
          "Low fibre and low water intake",
          "Stress and rushed eating",
          "Food intolerances",
          "Overuse of stimulants"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Elimination and reintroduction diet planning to identify trigger foods",
          "Abdominal packs, enemas and hydrotherapy where clinically appropriate",
          "Yoga postures and breathing that may help support gut motility",
          "Guided fasting or fruit-diet days for digestive rest"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Eat slowly and chew thoroughly",
          "Fixed meal times",
          "2.5–3 litres of water daily",
          "Walk 10 minutes after dinner"
        ]
      }
    ],
    "description": "For acidity, bloating, IBS-type discomfort and irregularity — rebuilding routine, fibre and gut calm."
  },
  {
    "slug": "high-blood-pressure",
    "title": "High Blood Pressure",
    "lead": "A calm-nervous-system approach: sodium-aware eating, breath work, hydrotherapy and restorative sleep.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Often silent",
          "Headaches at the back of the head",
          "Dizziness",
          "Palpitations",
          "Disturbed sleep"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "High salt and processed food intake",
          "Chronic stress",
          "Excess weight",
          "Low physical activity",
          "Alcohol and tobacco use"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Sodium-aware, potassium-rich diet planning",
          "Slow breathing and meditation practices that may help manage stress responses",
          "Hydrotherapy such as cold foot baths and spinal sprays for relaxation",
          "Gentle, progressive movement programmes"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Limit added salt and packaged foods",
          "Practise 10 minutes of slow breathing daily",
          "Keep a home BP log",
          "Reduce caffeine late in the day"
        ]
      }
    ],
    "description": "A calm-nervous-system approach: sodium-aware eating, breath work, hydrotherapy and restorative sleep."
  },
  {
    "slug": "insomnia",
    "title": "Insomnia & Sleep Trouble",
    "lead": "Rebuilding sleep pressure and wind-down rituals with natural, non-habit-forming methods.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Difficulty falling asleep",
          "Frequent waking",
          "Early morning waking",
          "Daytime fatigue",
          "Low mood"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Irregular sleep timing",
          "Evening screen exposure",
          "Late caffeine and heavy dinners",
          "Anxiety",
          "Napping too late"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Sleep-hygiene coaching and a personalised wind-down routine",
          "Warm foot baths and hydrotherapy before bed",
          "Yoga nidra and guided relaxation",
          "Evening-friendly herbal teas as part of a routine"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Same bed and wake time daily",
          "No screens 60 minutes before bed",
          "Light dinner by 8 pm",
          "Keep the room cool and dark"
        ]
      }
    ],
    "description": "Rebuilding sleep pressure and wind-down rituals with natural, non-habit-forming methods."
  },
  {
    "slug": "migraine",
    "title": "Migraine & Headaches",
    "lead": "Trigger mapping plus nervous-system calming practices that may help reduce the impact of episodes.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Throbbing one-sided head pain",
          "Nausea",
          "Light and sound sensitivity",
          "Visual aura",
          "Post-episode exhaustion"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Skipped meals and dehydration",
          "Sleep disruption",
          "Screen strain",
          "Certain foods and aromas",
          "Hormonal cycles and stress"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Trigger diary and diet review to identify personal patterns",
          "Cold compresses and spinal hydrotherapy for comfort",
          "Neck and shoulder massage therapy",
          "Yoga nidra and structured relaxation practice"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Never skip meals",
          "Fixed sleep and wake times",
          "Screen breaks every 30 minutes",
          "Steady hydration through the day"
        ]
      }
    ],
    "description": "Trigger mapping plus nervous-system calming practices that may help reduce the impact of episodes."
  },
  {
    "slug": "obesity",
    "title": "Obesity & Weight Management",
    "lead": "Sustainable weight support built on real food, daily movement and habit change rather than crash dieting.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Breathlessness on exertion",
          "Joint discomfort",
          "Low stamina",
          "Daytime drowsiness"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Calorie-dense, low-fibre diets",
          "Sedentary work",
          "Hormonal factors including thyroid and PCOS",
          "Emotional eating",
          "Insufficient sleep"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Personalised diet therapy with portion and meal-timing guidance",
          "Yoga therapy and progressive activity plans",
          "Supervised fasting or mono-diet days where medically appropriate",
          "Behavioural coaching to address emotional eating triggers"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Front-load meals earlier in the day",
          "Strength work twice a week",
          "Hydrate before meals",
          "Weigh in weekly, not daily"
        ]
      }
    ],
    "description": "Sustainable weight support built on real food, daily movement and habit change rather than crash dieting."
  },
  {
    "slug": "pcos",
    "title": "PCOS",
    "lead": "Cycle-aware nutrition, insulin-friendly eating and movement that may help support hormonal balance.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Irregular cycles",
          "Acne",
          "Excess hair growth",
          "Weight gain around the middle",
          "Fatigue"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Insulin resistance",
          "Hormonal imbalance",
          "Genetic predisposition",
          "Sedentary routine",
          "Chronic inflammation"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Low-glycaemic, protein-forward diet planning",
          "Strength and yoga programming for insulin sensitivity",
          "Stress and sleep restoration protocols",
          "Herbal support as a complement to gynaecological care"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Prioritise protein at breakfast",
          "Move daily, including resistance work",
          "Track cycles",
          "Limit ultra-processed foods"
        ]
      }
    ],
    "description": "Cycle-aware nutrition, insulin-friendly eating and movement that may help support hormonal balance."
  },
  {
    "slug": "skin-problems",
    "title": "Skin Problems",
    "lead": "Acne, eczema and dullness approached from the inside out — digestion, hydration, sleep and topical naturals.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Breakouts and congestion",
          "Itching or dryness",
          "Redness and flaking",
          "Dull, uneven tone"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Poor gut health",
          "Hormonal fluctuations",
          "Dehydration",
          "High sugar and dairy intake for some people",
          "Stress and sleep debt"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Gut-first diet planning and hydration goals",
          "Mud therapy and herbal packs for cooling and cleansing",
          "Steam and detox routines to support elimination",
          "Natural topical care with clay, neem and aloe"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Consistent sleep schedule",
          "Reduce refined sugar",
          "Gentle, fragrance-free cleansing",
          "Sun protection daily"
        ]
      }
    ],
    "description": "Acne, eczema and dullness approached from the inside out — digestion, hydration, sleep and topical naturals."
  },
  {
    "slug": "stress-anxiety",
    "title": "Stress & Anxiety",
    "lead": "Breath, rhythm and nourishment — practical daily tools for a calmer nervous system.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Racing thoughts",
          "Chest tightness",
          "Irritability",
          "Poor concentration",
          "Digestive upset"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Work and life pressure",
          "Irregular routine",
          "Stimulant overuse",
          "Poor sleep",
          "Low physical activity"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Pranayama, meditation and yoga nidra practice",
          "Relaxation massage and hydrotherapy sessions",
          "Nutrition planning that supports steady energy through the day",
          "Digital and caffeine boundaries built into a daily plan"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "10 minutes of morning breath work",
          "Daylight exposure early in the day",
          "Caffeine cut-off by 2 pm",
          "Journal before bed"
        ]
      }
    ],
    "description": "Breath, rhythm and nourishment — practical daily tools for a calmer nervous system."
  },
  {
    "slug": "thyroid-disorders",
    "title": "Thyroid Disorders",
    "lead": "Supportive care alongside endocrinology — nutrition, stress and movement, with medication continued as prescribed.",
    "cards": [
      {
        "title": "Common symptoms",
        "items": [
          "Fatigue",
          "Weight change",
          "Hair thinning",
          "Cold or heat intolerance",
          "Mood changes"
        ]
      },
      {
        "title": "Likely contributing causes",
        "items": [
          "Autoimmune thyroiditis",
          "Nutrient insufficiencies such as iodine or selenium",
          "Chronic stress",
          "Family history"
        ]
      },
      {
        "title": "How naturopathy may support you",
        "items": [
          "Nutrient-focused diet planning reviewed with your reports",
          "Neck-friendly yoga and breathing practices",
          "Stress management and sleep restoration",
          "Regular monitoring in coordination with your treating doctor"
        ]
      },
      {
        "title": "Daily lifestyle suggestions",
        "items": [
          "Take medication consistently as prescribed",
          "Balanced iodine intake",
          "Regular gentle exercise",
          "Periodic lab reviews"
        ]
      }
    ],
    "description": "Supportive care alongside endocrinology — nutrition, stress and movement, with medication continued as prescribed."
  }
];

export const getCondition = (slug: string) => conditions.find((c) => c.slug === slug);
