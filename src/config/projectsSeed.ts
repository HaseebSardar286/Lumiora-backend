import Project from "../models/Project";

export const initialProjects = [
  {
    slug: "tradetracker-ai",
    title: "TradeTracker AI",
    category: "Enterprise AI Chatbot",
    status: "Live",
    desc: "Intelligent merchandising and business reporting assistant capable of generating real-time graphs, trends, tabular reports, and business analytics.",
    longDesc: "TradeTracker AI is an advanced enterprise analytics conversational agent powered by the Gemini API for natural language intent clarification and smart formatting. It empowers business users to query and analyze product availability, shop productivity, and out-of-stock (OOS) rates. The system leverages Gemini to classify user intent, generate optimized database queries to retrieve live metrics from transactional databases, and formats the output into interactive Plotly charts, searchable data grids, and Excel/CSV download reports on demand.",
    tags: ["Generative AI", "Gemini API", "React", "Python", "Data Analytics"],
    metrics: "Interactive Reports & Trends",
    image: "/images/projects/tradetracker-ai/screen1.png",
    screenshots: [
      "/images/projects/tradetracker-ai/screen2.png",
      "/images/projects/tradetracker-ai/screen3.png",
      "/images/projects/tradetracker-ai/screen4.png"
    ],
    features: [
      "Leverages Gemini API to clarify user intent and formulate structured business responses",
      "Generates optimized database queries to fetch live metrics from transactional databases",
      "Ask for business reports and critical merchandising KPIs in natural language",
      "Generate interactive Plotly charts, trends, and comparison graphs",
      "Retrieve sortable and searchable tabular datasets with Excel/CSV download support"
    ],
    techStack: ["React", "Python", "Gemini API", "FastAPI", "Plotly", "PostgreSQL / SQL", "Scikit-Learn"]
  },
  {
    slug: "denbury-bright-smiles",
    title: "Denbury Bright Smiles",
    category: "Next.js Medical Web App",
    status: "Live",
    desc: "Highly responsive web application for a premier dental clinic, engineered to enhance patient acquisition with integrated lead generation.",
    longDesc: "A high-performance medical clinic website built to maximize local search presence and patient conversions. Features custom booking forms, interactive service pages, dynamic Google Maps integration, and lead capture systems optimized for local SEO.",
    tags: ["Next.js", "TypeScript", "Bootstrap 5", "Framer Motion"],
    metrics: "Marketing ROI Tracker",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070",
    liveUrl: "https://dental-clinic-inky.vercel.app/",
    screenshots: [
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070"
    ],
    features: [
      "Interactive dental services listing & details",
      "Integrated contact and lead generation forms",
      "Fully responsive fluid layouts",
      "Optimized Core Web Vitals for maximum search visibility",
      "Seamless animations using Framer Motion"
    ],
    techStack: ["Next.js", "TypeScript", "Bootstrap 5", "Framer Motion", "Vercel"]
  },
  {
    slug: "assetloop-rental-platform",
    title: "AssetLoop — Rental Platform",
    category: "Full-Stack Web App",
    status: "Live",
    desc: "End-to-end rental platform supporting full booking workflows, handling 100+ concurrent user interactions, with JWT-secured role-based access control.",
    longDesc: "AssetLoop is a high-performance rental asset management platform. It allows equipment owners to lease assets and renters to browse and reserve bookings. Built with a modern Angular front-end and a robust Node.js/Express backend, integrated with Supabase storage and MongoDB tracking.",
    tags: ["Angular", "Node.js", "MongoDB", "JWT"],
    metrics: "↓ 20% API Latency",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
    liveUrl: "https://assetloop-rental-platform.vercel.app/",
    screenshots: [
      "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=2070",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070"
    ],
    features: [
      "Role-based user dashboard (Owner vs. Renter)",
      "Real-time reservation calendar and availability tracking",
      "Secure JWT token authentication and session management",
      "Dynamic search filters for equipment categories",
      "Image-based asset condition verification upload system"
    ],
    techStack: ["Angular", "Node.js", "Express.js", "MongoDB", "Mongoose", "Supabase", "Tailwind CSS"]
  },
  {
    slug: "cry-care-baby-classification",
    title: "Cry-Care Baby Classification",
    category: "ML / AI Mobile App",
    status: "Live",
    desc: "Baby cry audio classification system achieving 88% accuracy. Balances 900+ records via SMOTE/ADASYN.",
    longDesc: "A machine learning powered audio classification system that records and analyzes infant cries to classify their needs (hunger, pain, sleepiness, etc.). Features audio preprocessing pipelines, Mel-Frequency Cepstral Coefficients (MFCC) feature extraction, and optimized XGBoost/SVM classifiers.",
    tags: ["Python", "XGBoost", "SVM", "Scikit-Learn"],
    metrics: "88% Model Accuracy",
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=1974",
    screenshots: [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070",
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038"
    ],
    features: [
      "Real-time audio recording and wave processing",
      "MFCC spectrogram feature extraction from audio buffers",
      "SMOTE & ADASYN data balancing over 900+ data instances",
      "Highly accurate XGBoost classification engine",
      "React Native mobile prototype interface"
    ],
    techStack: ["Python", "Scikit-Learn", "Librosa (Audio processing)", "XGBoost", "React Native", "Flask"]
  },
  {
    slug: "marketing-crm-analytics",
    title: "DentalCRM Marketing System",
    category: "Full-Stack Dental CRM",
    status: "Live",
    desc: "SaaS marketing dashboard for dental billing and clinics, managing patient leads, tracking campaign performance, and displaying real-time traffic statistics.",
    longDesc: "DentalCRM is a specialized marketing analytics dashboard built for dental clinics and dental billing agencies. It monitors daily visitors and conversions, tracks campaign performance (Google Ads, Facebook Ads), manages incoming dental leads, and facilitates direct patient contact scheduling and history tracking in real time.",
    tags: ["Next.js", "Node.js", "Firebase", "Analytics"],
    metrics: "Real-time Traffic Tracking",
    image: "/images/projects/dental-crm/screen1.png",
    liveUrl: "https://dental-billing-team.vercel.app/",
    screenshots: [
      "/images/projects/dental-crm/screen2.png",
      "/images/projects/dental-crm/screen3.png"
    ],
    features: [
      "Interactive admin panel monitoring daily visitors and conversions",
      "Detailed Leads Management grid with service type filters (Implant, Whitening, Cleaning)",
      "Activity history logging and custom patient notes management",
      "Campaign performance indicators monitoring ROI by marketing source",
      "Traffic volume analytics breakdown (Google Ads, Facebook, Instagram)"
    ],
    techStack: ["Next.js", "Node.js", "Firebase", "Chart.js", "Tailwind CSS", "Vercel"]
  },
  {
    slug: "mlb-ai-predictor-analytics",
    title: "MLB AI Predictor & Analytics",
    category: "ML / AI Platform",
    status: "Live",
    desc: "Predicts MLB game outcomes and player props, calculating betting edges against real-time bookmakers.",
    longDesc: "A specialized sports analytics and machine learning pipeline that aggregates historical Major League Baseball data, extracts player/team statistics, and outputs predictive probabilities for game winners and player outcomes.",
    tags: ["Python", "Pandas", "Scikit-Learn", "LightGBM"],
    metrics: "Calculated Edge Betting",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070",
    screenshots: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
      "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070"
    ],
    features: [
      "Historical game data scraper with automated schedules",
      "Feature engineering pipelines (rolling averages, matchup modifiers)",
      "Predictive LightGBM model tracking over 10,000 game records",
      "Bookmaker odds parser & value edge finder dashboard"
    ],
    techStack: ["Python", "Pandas", "Scikit-Learn", "LightGBM", "Flask", "Tailwind CSS"]
  },
  {
    slug: "svm-engine-failure-detection",
    title: "SVM Engine Failure Detection",
    category: "Machine Learning",
    status: "Live",
    desc: "SVM model detecting engine failures with 90% accuracy on 1000+ records. Includes EDA and training in Jupyter.",
    longDesc: "An industrial predictive maintenance machine learning system. It classifies engine health status based on sensor readings like temperature, vibration, and noise, helping prevent catastrophic mechanical failures.",
    tags: ["Python", "Scikit-Learn", "Jupyter", "Matplotlib"],
    metrics: "90% Predictive Accuracy",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2070",
    screenshots: [
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2070",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070"
    ],
    features: [
      "Sensor feature correlation analysis & Exploratory Data Analysis (EDA)",
      "Support Vector Classifier hyperparameter tuning (GridSearchCV)",
      "Interactive classification reports and confusion matrices",
      "Feature importance ranking visualization"
    ],
    techStack: ["Python", "Scikit-Learn", "Seaborn", "Matplotlib", "Jupyter Notebook"]
  },
  {
    slug: "enterprise-web-modules",
    title: "Enterprise Web Modules",
    category: "Enterprise Web",
    status: "Live",
    desc: "Production Angular + Java modules at ConcaveTech, boosting page speeds by ~25% using modular designs.",
    longDesc: "A series of high-performance micro-frontends and reusable modules deployed in an enterprise setting. Focuses on modular routing, state caching, and lazy loading strategies to decrease browser render times.",
    tags: ["Angular", "Java", "Spring Boot", "Micro-frontends"],
    metrics: "↑ 25% Page Render Speed",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070"
    ],
    features: [
      "Modular routing design optimized for lazy loading",
      "Optimized backend REST endpoints built with Spring Boot",
      "Lazy-loaded UI components with Angular core optimization",
      "State caching & prefetching mechanisms reducing API calls"
    ],
    techStack: ["Angular", "TypeScript", "Java", "Spring Boot", "Docker", "Redux (NgRx)"]
  },
  {
    slug: "babybee-toddler-ecommerce",
    title: "BabyBee Toddler E-commerce",
    category: "E-commerce Web App",
    status: "Offline",
    desc: "Premium e-commerce platform for toddlers offering size charts, product collections, and organic cotton clothing.",
    longDesc: "BabyBee is a modern e-commerce web platform specializing in organic cotton clothing for infants and toddlers. It features custom product collection routes, interactive sizes charts, fluid layout navigation, shopping cart workflows, and high-performance frontend optimizations. The system is designed to provide parents with a premium, seamless shopping experience for delicate baby garments.",
    tags: ["React", "Next.js", "Tailwind CSS", "E-commerce"],
    metrics: "GOTS Certified Apparel Store",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2070",
    screenshots: [
      "/images/projects/babybee/screen1.png",
      "/images/projects/babybee/screen2.png"
    ],
    features: [
      "Organic GOTS-certified baby & toddler apparel filters",
      "Interactive size charts and detailed baby clothing category indices",
      "Smooth responsive navigation and shopping cart checkout flows",
      "Dynamic collection routing (Rompers, 2-Piece Sets, Sleepwear, Jumpsuits)",
      "Integrated search, wishlist, and customer account dashboard modules"
    ],
    techStack: ["React", "Next.js", "Tailwind CSS", "Vercel", "Stripe"]
  }
];

export async function seedProjects() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(initialProjects);
      console.log("✅ Seeded default portfolio projects details.");
    }
  } catch (error) {
    console.error("⚠️ Failed to seed portfolio projects:", error);
  }
}
