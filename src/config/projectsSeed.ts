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
    title: "AssetLoop",
    category: "Rental Marketplace / Web Platform",
    status: "Live",
    desc: "A peer-to-peer asset rental platform connecting asset owners and renters through a centralized marketplace.",
    longDesc: "AssetLoop is a peer-to-peer asset rental platform that connects asset owners and renters through a centralized marketplace. The platform supports owner and renter workflows, asset listings, search, messaging, wallet/payment functionality with Stripe, storage, and admin tools.",
    tags: ["Angular", "Node.js", "MongoDB", "Stripe"],
    metrics: "Marketplace Platform",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
    liveUrl: "https://assetloop-rental-platform.vercel.app/",
    screenshots: [
      "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=2070",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070"
    ],
    features: [
      "User authentication",
      "Owner and renter workflows",
      "Asset listings and search",
      "Messaging",
      "Wallet / payment functionality with Stripe",
      "Storage and admin functionality"
    ],
    techStack: ["Angular", "Node.js", "Express", "MongoDB", "Supabase", "Stripe", "Vercel"],
    problem:
      "Asset owners and renters lacked a centralized platform to list, discover, and manage peer-to-peer asset rentals with clear workflows for both sides.",
    solution:
      "A peer-to-peer asset rental marketplace with authentication, owner/renter workflows, listings, search, messaging, payments via Stripe, storage, and admin tools.",
    contribution:
      "8BitField designed and built the web platform end to end — Angular frontend, Node.js/Express backend, MongoDB data layer, Supabase storage, and Stripe payment integration.",
    outcome:
      "A live rental marketplace platform connecting owners and renters through a single product."
  },
  {
    slug: "cry-care-baby-classification",
    title: "CryCare",
    category: "AI / Machine Learning",
    status: "Live",
    desc: "An intelligent baby-cry recognition system that classifies cries into categories such as hungry, tired, discomfort, burping, and belly pain.",
    longDesc: "CryCare is an intelligent baby-cry recognition system designed to classify baby cries into different categories using machine-learning techniques. 8BitField's contribution focused on the machine-learning component: audio feature extraction and model development for classifying cries into categories such as hungry, tired, discomfort, burping, and belly pain.",
    tags: ["Python", "Machine Learning", "Scikit-learn"],
    metrics: "ML Classification",
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=1974",
    screenshots: [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070",
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038"
    ],
    features: [
      "Audio feature extraction for cry classification",
      "Machine-learning models for cry category prediction",
      "Categories: Hungry, Tired, Discomfort, Burping, Belly pain",
      "ML API for inference"
    ],
    techStack: ["Python", "Machine Learning", "Audio feature extraction", "Scikit-learn", "ML API"],
    problem:
      "Caregivers often struggle to interpret infant cries quickly and consistently across common needs such as hunger, tiredness, or discomfort.",
    solution:
      "A machine-learning system that extracts audio features from baby cry recordings and classifies them into practical categories for caregiver support.",
    contribution:
      "8BitField's contribution was the machine-learning component — audio feature extraction, model development, and an ML API for inference. The broader mobile application was not developed entirely by 8BitField.",
    outcome:
      "A working cry-classification ML pipeline that can categorize cries into hungry, tired, discomfort, burping, and belly pain."
  },
  {
    slug: "marketing-crm-analytics",
    title: "Dental Billing Platform",
    category: "CRM / Business Analytics",
    status: "Live",
    desc: "A business management and marketing analytics platform for a dental billing practice.",
    longDesc: "A business management and marketing analytics platform built for a dental billing practice. It supports lead management, contact form integration, visitor attribution, UTM tracking, lead status management, notes, call/email actions, analytics dashboards, and conversion tracking.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    metrics: "CRM & Analytics",
    image: "/images/projects/dental-crm/screen1.png",
    liveUrl: "https://dental-billing-team.vercel.app/",
    screenshots: [
      "/images/projects/dental-crm/screen2.png",
      "/images/projects/dental-crm/screen3.png"
    ],
    features: [
      "Lead management",
      "Contact form integration",
      "Visitor attribution and UTM tracking",
      "Lead status management and notes",
      "Call / email actions",
      "Analytics dashboard and conversion tracking"
    ],
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "Database"],
    problem:
      "A dental billing practice needed a clearer way to manage inbound leads, attribute marketing traffic, and track follow-up activity in one place.",
    solution:
      "A business management and marketing analytics platform with lead management, UTM/visitor attribution, status tracking, notes, call/email actions, and conversion dashboards.",
    contribution:
      "8BitField built the web application and analytics workflows using Next.js, React, TypeScript, and Node.js around the practice's lead and marketing operations.",
    outcome:
      "A live CRM and analytics platform used to manage leads and track marketing performance for the dental billing practice."
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

export async function seedProjects(forceUpdate = false) {
  try {
    const count = await Project.countDocuments();

    if (forceUpdate) {
      let updated = 0;
      for (const project of initialProjects) {
        await Project.findOneAndUpdate(
          { slug: project.slug },
          { $set: project },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        updated += 1;
      }
      console.log(`✅ Upserted ${updated} portfolio projects (was ${count}).`);
      return;
    }

    if (count === 0) {
      await Project.insertMany(initialProjects);
      console.log("✅ Seeded default portfolio projects details.");
    }
  } catch (error) {
    console.error("⚠️ Failed to seed portfolio projects:", error);
  }
}
