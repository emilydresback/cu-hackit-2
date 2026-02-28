// src/topics.ts

// Back-end source identifiers your Lambda will eventually understand.
// You can start by only supporting a few of these.
export type SourceKey =
  | "doj"             // Department of Justice press releases
  | "federal_register"// Federal Register rules/docs
  | "usaspending"     // USAspending.gov awards
  | "cdc_news"        // CDC content / newsroom
  | "bls"             // Bureau of Labor Statistics
  | "census"          // U.S. Census data
  | "openweather"     // OpenWeatherMap or similar weather API
  | "newsapi"         // General news (NewsAPI, GNews, etc.)
  | "gbooks"          // Google Books API
  | "nasa"            // NASA APIs
  | "fred"            // Federal Reserve economic data (FRED)
  | "usda_food"       // USDA FoodData or nutrition API
  | "tmdb";           // TMDB / media API

export type TopicId =
  | "justice"
  | "rules-and-regs"
  | "federal-spending"
  | "public-health"
  | "career-and-jobs"
  | "city-and-cost-of-living"
  | "climate-and-weather"
  | "digital-privacy-and-security"
  | "news-and-worldview"
  | "books-and-learning"
  | "money-and-economy"
  | "food-and-nutrition"
  | "media-and-culture"
  | "space-and-science";

export interface TopicApiConfig {
  /** ID passed to the Lambda as ?topic=... */
  topicId: TopicId;
  /** Which APIs the backend should use for this topic */
  sources: SourceKey[];
  /** Fallback search query if the user doesn't give one */
  defaultQuery: string;
  /** Optional notes for you/devs (not required for UI) */
  notes?: string;
}

export interface TopicConfig {
  id: TopicId;
  title: string;
  subtitle: string;
  description: string;
  reflectivePrompt: string;
  exampleStarter: string;
  api: TopicApiConfig;
}

export const TOPICS: TopicConfig[] = [
  // 1. Justice & Civil Rights (DOJ)
  {
    id: "justice",
    title: "Justice, Courts & Civil Rights",
    subtitle: "Cases, investigations, and fairness under the law",
    description:
      "Explore how federal justice and civil rights cases connect to your experiences with fairness, safety, and institutions.",
    reflectivePrompt:
      "Have you ever worried about being treated unfairly by an employer, school, landlord, or online platform? What situation comes to mind for you personally?",
    exampleStarter:
      'Example starter: “I’m worried about discrimination in hiring in tech. What recent DOJ cases or civil rights enforcement actions relate to that kind of issue?”',
    api: {
      topicId: "justice",
      sources: ["doj"],
      defaultQuery: "civil rights",
      notes: "Use DOJ press_release API; filter by title/summary.",
    },
  },

  // 2. Rules & Regulations (Federal Register)
  {
    id: "rules-and-regs",
    title: "Rules, Regulations & Policy Changes",
    subtitle: "The fine print that quietly changes everyday life",
    description:
      "See proposed and final rules that might affect your loans, privacy, housing, work, and more.",
    reflectivePrompt:
      "In your life right now, what feels confusing or fragile because of changing rules—student loans, online privacy, housing, healthcare, or something else?",
    exampleStarter:
      'Example starter: “I’m a college student with loans and I keep hearing about new repayment plans. What recent federal rules might change how I repay my debt?”',
    api: {
      topicId: "rules-and-regs",
      sources: ["federal_register"],
      defaultQuery: "student loans",
      notes: "Use Federal Register documents API with conditions[term].",
    },
  },

  // 3. Federal Spending (USAspending) not working
  {
    id: "federal-spending",
    title: "Where Federal Money Actually Goes",
    subtitle: "Contracts, grants, and who gets funded",
    description:
      "Look at which companies, universities, and organizations are receiving federal money in areas you care about.",
    reflectivePrompt:
      "Think of one issue you care about—like climate, AI, housing, or healthcare. Who do you imagine is actually getting federal money in that space where you live?",
    exampleStarter:
      'Example starter: “I care about climate tech and live near a big city. Which companies around me have gotten recent federal contracts related to clean energy?”',
    api: {
      topicId: "federal-spending",
      sources: ["usaspending"],
      defaultQuery: "education",
      notes: "Use USAspending search/spending_by_award endpoint.",
    },
  },

  // 4. Public Health (CDC)
  {
    id: "public-health",
    title: "Health & Public Safety",
    subtitle: "Outbreaks, risks, and everyday health guidance",
    description:
      "Explore official health news and guidance about issues that might touch your daily life or your community.",
    reflectivePrompt:
      "What health habit or risk feels closest to you right now—stress, sleep, vaping, alcohol, STIs, COVID, or chronic illness? How does it show up in your routines?",
    exampleStarter:
      'Example starter: “I’m in college and vaping is super common around me. What recent federal health guidance says about long-term risks for people my age?”',
    api: {
      topicId: "public-health",
      sources: ["cdc_news"],
      defaultQuery: "college",
      notes: "Use CDC content/newsroom API; search health topics.",
    },
  },

  // 5. Career & Jobs (BLS)
  {
    id: "career-and-jobs",
    title: "Career Paths & Job Outlook",
    subtitle: "Your plans vs. real job market data",
    description:
      "Connect your major, skills, and goals with real occupational data: pay, growth, and job outlook.",
    reflectivePrompt:
      "What job or field are you hoping to work in after school, and what about it excites or scares you the most—salary, stability, competition, or automation?",
    exampleStarter:
      'Example starter: “I’m studying computer science and thinking about data science or AI. Based on BLS data, what does the job outlook look like for someone with that path?”',
    api: {
      topicId: "career-and-jobs",
      sources: ["bls"],
      defaultQuery: "software developers",
      notes: "Use BLS API or OOH data to fetch occupation info.",
    },
  },

  // 6. City & Cost of Living (Census)
  {
    id: "city-and-cost-of-living",
    title: "Your City & Cost of Living",
    subtitle: "Income, housing, and local realities",
    description:
      "Use demographic and economic data to understand how where you live compares to other places.",
    reflectivePrompt:
      "Where do you live now (city or ZIP), and what feels hardest about living there—rent, wages, commute, social life, or something else?",
    exampleStarter:
      'Example starter: “I’m living in a college town and rent is super high compared to student wages. What does Census data say about income and housing costs in my ZIP code?”',
    api: {
      topicId: "city-and-cost-of-living",
      sources: ["census"],
      defaultQuery: "median income",
      notes: "Use Census API by ZIP/county to pull income/housing stats.",
    },
  },

  // 7. Climate & Weather (OpenWeather or similar)
  {
    id: "climate-and-weather",
    title: "Climate & Weather Where You Live",
    subtitle: "Heat waves, storms, and daily life",
    description:
      "Connect your daily experience of weather to larger climate patterns and local conditions.",
    reflectivePrompt:
      "Think about the last year of weather where you live. Did anything feel extreme—heat waves, storms, flooding, wildfire smoke? How did it affect you personally?",
    exampleStarter:
      'Example starter: “I live in a city that’s getting hotter every summer. How do current temperature trends and forecasts look for my area over the next week or month?”',
    api: {
      topicId: "climate-and-weather",
      sources: ["openweather"],
      defaultQuery: "current weather",
      notes: "Use OpenWeatherMap or a similar weather API (requires city/lat-lon).",
    },
  },

  // 8. Digital Privacy & Security (news + maybe DOJ)
  {
    id: "digital-privacy-and-security",
    title: "Your Digital Life, Privacy & Security",
    subtitle: "Tracking, breaches, and feeling watched online",
    description:
      "Look at news and enforcement actions around data breaches, tracking, and online surveillance.",
    reflectivePrompt:
      "How much of your life lives online—social media, banking, location sharing, smart devices? What’s one thing about that that makes you nervous?",
    exampleStarter:
      'Example starter: “I use the same few passwords everywhere and have all my cards saved online. What recent news or enforcement actions highlight the risks of that?”',
    api: {
      topicId: "digital-privacy-and-security",
      sources: ["newsapi", "doj"],
      defaultQuery: "data breach",
      notes: "Use a general news API plus DOJ for relevant enforcement cases.",
    },
  },

  // 9. News & Your Worldview (general news)
  {
    id: "news-and-worldview",
    title: "News & Your Worldview",
    subtitle: "How headlines shape what you worry about",
    description:
      "Explore recent news in areas you care about and reflect on how they influence your emotions and decisions.",
    reflectivePrompt:
      "When you scroll the news or social media, what kinds of stories stick in your head—war, climate, tech, celebrity stuff, markets, politics?",
    exampleStarter:
      'Example starter: “I keep seeing headlines about AI replacing jobs and it stresses me out. What recent news coverage actually says about AI and employment?”',
    api: {
      topicId: "news-and-worldview",
      sources: ["newsapi"],
      defaultQuery: "artificial intelligence jobs",
      notes: "Use NewsAPI, GNews, etc. Filter by topic & recency.",
    },
  },

  // 10. Books & Learning (Google Books)
  {
    id: "books-and-learning",
    title: "Books & Learning Paths",
    subtitle: "Finding resources that match who you are",
    description:
      "Use book search to discover resources that match your learning style, identity, and interests.",
    reflectivePrompt:
      "When you try to learn something new, what usually works best for you—textbooks, videos, podcasts, short blog posts, or hands-on projects?",
    exampleStarter:
      'Example starter: “I have trouble focusing on dense textbooks, but I like narrative-style books. What books about personal finance or careers might fit that style?”',
    api: {
      topicId: "books-and-learning",
      sources: ["gbooks"],
      defaultQuery: "career advice for students",
      notes: "Use Google Books API with q=<query> and filters.",
    },
  },

  // 11. Money & Economy (FRED)
  {
    id: "money-and-economy",
    title: "Money, Inflation & the Economy",
    subtitle: "How macro stuff shows up in your bank account",
    description:
      "Connect big-picture economic data with your own experience of prices, wages, and savings.",
    reflectivePrompt:
      "In the last year, what’s felt more expensive or stressful financially—rent, groceries, gas, tuition, or something else?",
    exampleStarter:
      'Example starter: “Groceries feel way more expensive than a few years ago. What do inflation and wage data actually look like for the last few years?”',
    api: {
      topicId: "money-and-economy",
      sources: ["fred"],
      defaultQuery: "CPI",
      notes: "Use FRED API to pull CPI, unemployment, etc.",
    },
  },

  // 12. Food & Nutrition (USDA / nutrition API)
  {
    id: "food-and-nutrition",
    title: "Food, Nutrition & Your Habits",
    subtitle: "What you eat vs. what your body needs",
    description:
      "Explore nutrition data about the foods you actually eat and how they align with your goals.",
    reflectivePrompt:
      "What does a realistic day of eating look like for you—not your ideal day, but a normal one? Is there anything about it you’re curious or uneasy about?",
    exampleStarter:
      'Example starter: “I drink a lot of sugary coffee drinks and grab fast food after late classes. What does nutrition data say about those habits over time?”',
    api: {
      topicId: "food-and-nutrition",
      sources: ["usda_food"],
      defaultQuery: "coffee",
      notes: "Use USDA FoodData Central or another nutrition API.",
    },
  },

  // 13. Media & Culture (TMDB or similar)
  {
    id: "media-and-culture",
    title: "Media, Fandoms & Culture",
    subtitle: "What you watch and what it reflects about you",
    description:
      "Use movie/TV metadata to explore the themes and characters you’re drawn to and why.",
    reflectivePrompt:
      "What show, movie, or character have you felt strangely ‘seen’ by recently? What about them feels close to your own life?",
    exampleStarter:
      'Example starter: “I love comfort shows that are about found family and low-stress drama. What other shows or movies have similar themes I might connect with?”',
    api: {
      topicId: "media-and-culture",
      sources: ["tmdb"],
      defaultQuery: "found family",
      notes: "Use TMDB API to search movies/TV with keywords/genres.",
    },
  },

  // 14. Space & Science (NASA)
  {
    id: "space-and-science",
    title: "Space, Curiosity & Big Questions",
    subtitle: "Looking up when life feels small",
    description:
      "Explore images, missions, and discoveries that might connect to your sense of curiosity or perspective.",
    reflectivePrompt:
      "When life feels overwhelming, do you ever feel better thinking about space, science, or how small we are in the universe? Why do you think that is?",
    exampleStarter:
      'Example starter: “I love space photos, they calm me down. What recent NASA images or missions could I explore that might inspire that same feeling?”',
    api: {
      topicId: "space-and-science",
      sources: ["nasa"],
      defaultQuery: "nebula",
      notes: "Use NASA image/search API or APOD endpoint.",
    },
  },
];

export function getTopicById(id: string | undefined): TopicConfig | undefined {
  return TOPICS.find((t) => t.id === id);
}