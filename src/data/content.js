/**
 * ====================================================================
 * PORTFOLIO CONTENT & CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * ====================================================================
 * Everything is configured here for easy beginner editing:
 * - Intro config (clock animation, words, timing)
 * - Personal details (name, email, phone, links)
 * - 12 tools for the Tools Arc
 * - 3 featured projects
 * - Scenes configuration and photo paths
 */

export const introConfig = {
  // ONE word, uppercase, exactly 9 letters matching "PORTFOLIO"
  introName: "ARTHANARI",
  finalWord: "PORTFOLIO",
  roleSubtitle: "AI & ML Engineer / Full-Stack Developer",
  
  // Theme Accent
  accentColor: "#ff5a1f", // Ember Orange
  accentColorGlow: "rgba(255, 90, 31, 0.4)",

  // Photo paths
  heroPhoto: "/images/me-hero.png",
  aboutPhoto: "/images/me-about.png",

  // Timeline durations
  durations: {
    glowAndDot: 0.8,
    barGrow: 0.8,
    clockSweep: 2.4,
    nameHoldAndShine: 0.8,
    morphToPortfolio: 1.2,
    assemblePortrait: 1.5,
  },

  // Navbar items (smooth-scrolls to corresponding scenes)
  navItems: [
    { label: "ABOUT", targetId: "scene-about" },
    { label: "SKILLS", targetId: "scene-skills" },
    { label: "PROJECTS", targetId: "scene-projects" },
    { label: "PROFILES", targetId: "scene-contact" },
    { label: "CONTACT", targetId: "scene-contact" },
  ]
};

export const personalData = {
  name: "Arthanari S",
  shortName: "ARTHANARI",
  role: "AI & ML Engineer",
  subRole: "Computer Vision & Intelligent Systems",
  tagline: "Engineering intelligent systems with data, vision, and scale.",
  aboutLines: [
    "Aspiring Artificial Intelligence & Machine Learning engineer passionate about practical AI solutions.",
    "Experienced in deep learning, medical image analysis, and end-to-end intelligent systems.",
    "Driven by building clean, high-performance software that solves real-world challenges."
  ],
  location: "Tamil Nadu, India",
  email: "arthanaris007@gmail.com",
  phone: "+91 6379001272",
  github: "https://github.com/arthanaris24am-wq",
  leetcode: "https://leetcode.com/u/ArthanariS/",
  linkedin: "https://www.linkedin.com/in/arthanari-s-1ab90a338/",
  heroPhoto: "/images/me-hero.png",
  aboutPhoto: "/images/me-about.png",
  resumeUrl: "/resume.pdf",
  // ID Card fields (Scene 2)
  idCardPhoto: "/images/scenes/id-card-photo.webp",
  idCardPhotoFocusX: "50%",
  idCardPhotoFocusY: "38%",
  idCardNumber: "001",
  idCardTechPills: ["Python", "PyTorch", "React", "SQL"],
  idCardDescription: "Aspiring AI & ML Engineer passionate about practical solutions in computer vision and intelligent systems.",
  idCardHeadline1: "AI & ML",
  idCardHeadline2: "Engineer",
  idCardAvailableLabel: "02 // AVAILABLE FOR WORK",
};

// Photos for the 7 Scroll Scenes (with graceful fallbacks)
export const scenePhotos = {
  standingCutout: "/images/scenes/standing-cutout.png",
  faceCloseup: "/images/scenes/face-closeup.jpg",
  lightPortrait: "/images/scenes/light-portrait.jpg",
  faceTiles: [
    "/images/scenes/face-tiles/1.jpg",
    "/images/scenes/face-tiles/2.jpg",
    "/images/scenes/face-tiles/3.jpg",
    "/images/scenes/face-tiles/4.jpg",
    "/images/scenes/face-tiles/5.jpg",
    "/images/scenes/face-tiles/6.jpg",
  ],
};

// 12 Tools with inline SVG simple icons (clean, no external network requests)
export const toolsList = [
  {
    name: "Python",
    category: "Language",
    description: "Core language for ML modeling, automated pipelines & backend logic.",
    isMain: true,
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.75h5.808v.825H3.86S0 5.787 0 11.904c0 6.12 3.37 5.908 3.37 5.908h2.012v-2.822s-.11-3.37 3.315-3.37h5.696s3.206.055 3.206-3.15V3.15S18.01 0 11.914 0zm-3.08 1.838a1.01 1.01 0 1 1 0 2.02 1.01 1.01 0 0 1 0-2.02zm1.26 12.08s-.055 3.15-3.206 3.15H6.192v.825h8.154s3.86.444 3.86-5.672c0-6.12-3.37-5.91-3.37-5.91h-2.012v2.824s.11 3.37-3.315 3.37H3.823s-3.206-.056-3.206 3.15v5.318s-.413 3.15 5.682 3.15c6.095 0 5.714-2.656 5.714-2.656l-.006-2.75h-5.81v-.825h8.155s3.86-.444 3.86 5.672c0 6.12-3.37 5.91-3.37 5.91h2.012v-2.824s-.11-3.37 3.315-3.37h5.696s3.206-.056 3.206 3.15v5.318s.413 3.15-5.682 3.15c-6.095 0-5.714-2.656-5.714-2.656v-2.75h-5.808v-.825h8.154s3.86.444 3.86-5.672c0-6.12-3.37-5.91-3.37-5.91h-2.012v2.824s.11 3.37-3.315 3.37z"/></svg>`
  },
  {
    name: "PyTorch",
    category: "Deep Learning",
    description: "Deep learning framework for building & training vision CNN architectures.",
    isMain: true,
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.783 0a11.996 11.996 0 0 0-4.043.693l1.57 1.57a9.774 9.774 0 0 1 2.473-.424c5.44 0 9.851 4.411 9.851 9.851 0 5.44-4.411 9.851-9.851 9.851-5.44 0-9.851-4.411-9.851-9.851 0-1.614.388-3.138 1.077-4.478L2.41 5.662A11.996 11.996 0 0 0 .783 11.69c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12zm3.324 4.54a1.764 1.764 0 1 0 0 3.528 1.764 1.764 0 0 0 0-3.528zm-4.99 2.502l-3.39 3.39a1.764 1.764 0 0 0 2.495 2.495l.895-.895v5.405a1.764 1.764 0 0 0 3.528 0V9.537l-.004-.005a1.763 1.763 0 0 0-3.524 0z"/></svg>`
  },
  {
    name: "OpenCV",
    category: "Computer Vision",
    description: "Real-time image filtering, video frame manipulation & spatial transformations.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.686 0 6 2.686 6 6c0 1.258.39 2.423 1.053 3.385L4.47 11.97A5.968 5.968 0 0 0 2 11.5c-3.314 0-6 2.686-6 6s2.686 6 6 6c3.314 0 6-2.686 6-6 0-1.258-.39-2.423-1.053-3.385l2.583-2.585A5.968 5.968 0 0 0 12 12c1.258 0 2.423-.39 3.385-1.053l2.585 2.583A5.968 5.968 0 0 0 17.5 14c3.314 0 6-2.686 6-6s-2.686-6-6-6c-1.258 0-2.423.39-3.385 1.053L11.53 4.47A5.968 5.968 0 0 0 12 0z"/></svg>`
  },
  {
    name: "Scikit-Learn",
    category: "Machine Learning",
    description: "Statistical regressions, clustering classifiers, and preprocessing.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.18 8.01a4.99 4.99 0 0 0-4.88-4 4.99 4.99 0 0 0-4.88 4 5 5 0 0 0-4.42 5 5 5 0 0 0 5 5h8.6a4.99 4.99 0 0 0 4.99-5 4.98 4.98 0 0 0-4.41-5zm-4.88-2a2.99 2.99 0 0 1 2.94 2.5.5.5 0 0 0 .44.41 3 3 0 0 1 2.62 3 3 3 0 0 1-3 3h-8.6a3 3 0 0 1-3-3 3 3 0 0 1 2.62-3 .5.5 0 0 0 .44-.41 3 3 0 0 1 2.94-2.5z"/></svg>`
  },
  {
    name: "Java",
    category: "Core Language",
    description: "High-concurrency systems, object-oriented design & data structures.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.85 16.32s-.9 1.13 1.02 1.62c2.47.62 4.1-.64 4.1-.64s-1.84 1.18-4.22.42c-1.83-.58-.9-1.4-.9-1.4zm-.42-3.1s-1.12.87.5 1.45c2.2.78 4.67-.17 4.67-.17s-2.22.86-4.42.17c-1.74-.53-.75-1.45-.75-1.45zm5.54-5.2s1.42 1.4-1.2 3.65c-3.18 2.73-1.07 4.3 0 5.4-2.73-.83-4.14-2.8-2.6-4.52 1.95-2.18 3.8-3.07 3.8-4.53zm-1.85-5.85s2.78 2.7-.9 5.86c-2.4 2.06-.9 3.2 0 4.17-2.16-.7-3.16-2.16-1.78-3.5 1.76-1.7 2.68-2.6 2.68-6.53z"/></svg>`
  },
  {
    name: "React",
    category: "Frontend",
    description: "Interactive reactive components, hooks, state machines & UI layers.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0-7.5c-4.48 0-8.8 1.48-11.23 3.92-2.36 2.36-2.36 6.18 0 8.54 2.43 2.44 6.75 3.92 11.23 3.92s8.8-1.48 11.23-3.92c2.36-2.36 2.36-6.18 0-8.54C20.8 3.48 16.48 2 12 2zm0 14.8c-4.2 0-8.15-1.37-10.37-3.6-1.8-1.8-1.8-4.6 0-6.4 2.22-2.23 6.17-3.6 10.37-3.6s8.15 1.37 10.37 3.6c1.8 1.8 1.8 4.6 0 6.4-2.22 2.23-6.17 3.6-10.37 3.6z"/></svg>`
  },
  {
    name: "JavaScript",
    category: "Frontend/Backend",
    description: "Async workflows, event loops, DOM control & algorithmic scripting.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.621-1.797-1.025-.12-.19-.14-.38-.075-.59.13-.39.73-.55 1.42-.45.47.07.94.28 1.25.56.24.22.42.23.63.1l1.24-.76c.21-.13.23-.29.09-.49-.66-.94-1.7-1.46-3.04-1.53-1.68-.09-2.92.74-3.23 1.95-.31 1.24.32 2.29 2.06 2.99 1.13.46 1.85.73 2.07 1.18.23.47.04.99-.67 1.2-.87.26-2.04.07-2.73-.61-.17-.17-.29-.21-.49-.09l-1.35.85c-.24.15-.22.36-.05.57.97 1.22 2.5 1.77 4.29 1.58 2.08-.22 3.23-1.44 3.39-2.84zm-9.05-7.66h-1.9v7.88c0 1.27-.67 1.84-1.73 1.84-.71 0-1.22-.26-1.55-.65-.17-.2-.29-.19-.48-.07l-1.25.77c-.2.12-.22.28-.08.48.86 1.24 2.07 1.73 3.68 1.73 2.45 0 3.31-1.35 3.31-3.69v-8.29z"/></svg>`
  },
  {
    name: "Node.js",
    category: "Backend",
    description: "Fast REST APIs, microservices & backend runtime services.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l10 5.8v11.4L12 24.5 2 18.7V7.3L12 1.5zm0 2.3L4 8.5v9.2l8 4.6 8-4.6V8.5l-8-4.7z"/></svg>`
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first design system and adaptive responsive layouts.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`
  },
  {
    name: "SQL & DBMS",
    category: "Database",
    description: "Relational query optimization, schema indexing & transactional integrity.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.2c1.94 1.12 4.82 1.8 8 1.8s6.06-.68 8-1.8V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.8c1.94 1.12 4.82 1.8 8 1.8s6.06-.68 8-1.8V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.8c1.94 1.12 4.82 1.8 8 1.8s6.06-.68 8-1.8V18z"/></svg>`
  },
  {
    name: "Git",
    category: "Version Control",
    description: "Version branch control, CI/CD integrations & team collaboration.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.546 10.93L13.067.452a1.5 1.5 0 0 0-2.126 0L8.808 2.585l2.83 2.829a2.5 2.5 0 0 1 3.167 3.167l2.723 2.723a2.5 2.5 0 1 1-1.06 1.06l-2.617-2.617a2.5 2.5 0 0 1-2.91-2.91L8.14 4.037.454 11.723a1.5 1.5 0 0 0 0 2.126l10.479 10.48a1.5 1.5 0 0 0 2.126 0l10.487-10.488a1.5 1.5 0 0 0 0-2.126l-.004-.005a2.5 2.5 0 0 1 .004-1.78z"/></svg>`
  },
  {
    name: "Docker",
    category: "DevOps",
    description: "Containerized model deployment environments and isolated runtime services.",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.894 2.714h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186H8.1a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.208a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185M23.79 11.23c-.347-.234-.96-.407-1.745-.303-.178-.71-.62-1.33-1.258-1.74-.085-.054-.18-.088-.278-.1-.1-.013-.2.008-.288.06-.723.42-1.155 1.135-1.255 1.944-.657.17-1.127.65-1.378 1.25H1.47c-.247 0-.472.1-.634.275a.94.94 0 0 0-.256.66c.148 2.37 1.05 4.54 2.54 6.13 1.63 1.74 3.79 2.7 6.07 2.7 7.03 0 12.85-5.26 14.59-10.92z"/></svg>`
  }
];

// Featured Projects for Scenes 1, 6 & 7
export const projectsList = [
  {
    id: "ai-expense-tracker",
    title: "AI Expense Tracker",
    tagline: "Intelligent Transaction Classification & Spending Analysis",
    description: "End-to-end intelligent financial management system featuring automated ML transaction classification, anomaly detection, and predictive spending analytics with interactive dashboards.",
    tags: ["Python", "Machine Learning", "Scikit-Learn", "Streamlit", "Pandas"],
    github: "https://github.com/arthanaris24am-wq",
    live: "https://github.com/arthanaris24am-wq",
    image: "/images/projects/expense-tracker.svg",
    number: "01"
  },
  {
    id: "polyp-identification",
    title: "Polyp Identification Vision",
    tagline: "Medical Image Analysis & Computer Vision Segmentation",
    description: "Deep learning framework engineered to detect and delineate polyps from colonoscopy endoscopy frames, assisting clinicians with automated feature highlighting and clinical assessment.",
    tags: ["Computer Vision", "PyTorch", "OpenCV", "CNN", "Medical AI"],
    github: "https://github.com/arthanaris24am-wq",
    live: "https://github.com/arthanaris24am-wq",
    image: "/images/projects/polyp-vision.svg",
    number: "02"
  },
  {
    id: "data-pipeline",
    title: "Real-Time Data Intelligence Pipeline",
    tagline: "High-Throughput Streaming & Event Aggregation",
    description: "Scalable data ingestion and event stream transformation architecture delivering low-latency metric computations, database persistence, and automated alerting.",
    tags: ["Python", "Java", "SQL / DBMS", "FastAPI", "Data Pipeline"],
    github: "https://github.com/arthanaris24am-wq",
    live: "https://github.com/arthanaris24am-wq",
    image: "/images/projects/data-pipeline.svg",
    number: "03"
  }
];

// Education & Certifications
export const certificationsList = [
  {
    title: "Bachelor of Technology — AI & Machine Learning",
    issuer: "Sri Shakthi Institute of Engineering & Technology",
    grade: "CGPA: 8.0 / 10.0",
    year: "2022 – 2026",
    badge: "B.Tech"
  },
  {
    title: "Computer Vision & Deep Learning Specialist",
    issuer: "Academic & Applied Projects",
    grade: "Medical Image Detection",
    year: "2024",
    badge: "CV"
  },
  {
    title: "Data Structures & Algorithmic Problem Solving",
    issuer: "LeetCode Active Profiler",
    grade: "Profile: ArthanariS",
    year: "2024 – Present",
    badge: "DSA"
  }
];

// Editorial text for Scene 6
export const editorialData = {
  sectionLabel: "06 // SELECTED WORK",
  headlineLine1: "Arthanari's",
  headlineLine2: "Portfolio in Motion",
  headlineLine3: "Engineering Intelligence",
  tagline: "From algorithmic models to computer vision systems that ship.",
  subtext: "Selected engineering milestones blending deep mathematical foundations with production-ready execution.",
  openToWorkText: "Open to work",
  skillsMarquee: [
    "COMPUTER VISION",
    "PYTORCH",
    "DEEP LEARNING",
    "MEDICAL IMAGE AI",
    "SYSTEM ARCHITECTURE",
    "DATA PIPELINES",
    "NEURAL NETWORKS",
    "ALGORITHMS",
    "FASTAPI",
    "REACT ARCHITECTURE"
  ],
  stats: [
    { value: 12, label: "TOOLS & LIBS", suffix: "+" },
    { value: 6, label: "AI MILESTONES", suffix: "" },
    { value: 300, label: "PROBLEMS SOLVED", suffix: "+" }
  ]
};

// Scene 1 Carousel Cards (5 poster cards)
export const carouselCards = [
  {
    id: "card-projects",
    num: "01",
    category: "FEATURED WORK",
    title: "PROJECTS",
    subtitle: "Computer Vision & AI",
    bgGradient: "from-neutral-900 via-neutral-950 to-black"
  },
  {
    id: "card-about",
    num: "02",
    category: "THE DEVELOPER",
    title: "ORIGIN",
    subtitle: "AI & ML Engineer",
    bgGradient: "from-zinc-900 via-neutral-950 to-black"
  },
  {
    id: "card-portfolio",
    num: "★",
    category: "FEATURED FILM",
    title: "PORTFOLIO",
    subtitle: "ARTHANARI S",
    isCenter: true,
    bgGradient: "from-[#ff5a1f]/20 via-neutral-950 to-black"
  },
  {
    id: "card-skills",
    num: "03",
    category: "CAPABILITIES",
    title: "TECH STACK",
    subtitle: "12 Core Technologies",
    bgGradient: "from-neutral-900 via-zinc-950 to-black"
  },
  {
    id: "card-contact",
    num: "04",
    category: "COMMUNICATION",
    title: "CONNECT",
    subtitle: "Tamil Nadu, India",
    bgGradient: "from-stone-900 via-neutral-950 to-black"
  }
];

// Timeline Journey for Scene 5 (A Journey Through Time)
export const journeyData = {
  titleParts: ["A", "JOURNEY", "THROUGH", "TIME"],
  sideLabels: ["IDEAS", "EXPERIENCES", "MILESTONES", "SYSTEMS", "RESEARCH", "PROJECTS"],
  entries: [
    {
      year: "2021",
      title: "First Lines of Code",
      desc: "Discovered the power of Python, algorithms, and core computer science fundamentals.",
      image: "/images/scenes/face-tiles/1.jpg"
    },
    {
      year: "2022",
      title: "Full-Stack Foundations",
      desc: "Built dynamic web architectures with React, Node.js, and SQL databases.",
      image: "/images/scenes/face-tiles/2.jpg"
    },
    {
      year: "2023",
      title: "Machine Learning Leap",
      desc: "Explored Scikit-Learn, data pipelines, predictive models, and classical AI theory.",
      image: "/images/scenes/face-tiles/3.jpg"
    },
    {
      year: "2024",
      title: "Deep Vision & PyTorch",
      desc: "Implemented convolutional neural networks, medical imaging classifiers, and OpenCV.",
      image: "/images/scenes/face-tiles/4.jpg"
    },
    {
      year: "2025",
      title: "End-to-End Intelligent Systems",
      desc: "Engineered scalable AI APIs, real-time computer vision inference, and cloud deployments.",
      image: "/images/scenes/face-tiles/5.jpg"
    },
    {
      year: "2026",
      title: "Frontiers & Next Chapter",
      desc: "Pioneering intelligent autonomous agents, multimodal AI, and high-performance engineering.",
      image: "/images/scenes/face-tiles/6.jpg"
    }
  ]
};

