/**
 * ====================================================================
 * PORTFOLIO CONTENT & INTRO CONFIGURATION
 * ====================================================================
 * Single source of truth for the cinematic intro and future sections.
 * Easily customize text, colors, and asset paths here.
 */

export const introConfig = {
  // ONE word, uppercase, exactly 9 letters matching "PORTFOLIO" for perfect morphing
  introName: "ARTHANARI",
  finalWord: "PORTFOLIO",
  roleSubtitle: "AI & ML Engineer / Full-Stack Developer",
  
  // Theme Accent
  accentColor: "#ff5a1f", // Ember Orange
  accentColorGlow: "rgba(255, 90, 31, 0.4)",

  // Photo paths
  heroPhoto: "/images/me-hero.png",     // Original full camera photo inside rectangular halftone box
  aboutPhoto: "/images/me-about.png",   // Profile photo for the About section

  // Timeline durations (total ~7.5 seconds)
  durations: {
    glowAndDot: 0.8,     // 0.0 - 0.8s
    barGrow: 0.8,        // 0.8 - 1.6s
    clockSweep: 2.4,     // 1.6 - 4.0s
    nameHoldAndShine: 0.8, // 4.0 - 4.8s
    morphToPortfolio: 1.2, // 4.8 - 6.0s
    assemblePortrait: 1.5, // 6.0 - 7.5s
  },

  // Navbar items shown in the final hero state
  navItems: [
    { label: "ABOUT", href: "#about" },
    { label: "SKILLS", href: "#skills" },
    { label: "PROJECTS", href: "#projects" },
    { label: "PROFILES", href: "#profiles" },
    { label: "CONTACT", href: "#contact" },
  ]
};

export const personalData = {
  name: "Arthanari S",
  shortName: "ARTHANARI",
  role: "AI & ML Engineer",
  subRole: "Computer Vision & Intelligent Systems",
  tagline: "Engineering intelligent systems with data, vision, and scale.",
  email: "arthanaris007@gmail.com",
  phone: "+91 6379001272",
  location: "Tamil Nadu, India",
  github: "https://github.com/arthanaris24am-wq",
  leetcode: "https://leetcode.com/u/ArthanariS/",
  linkedin: "https://www.linkedin.com/in/arthanari-s-1ab90a338/",
  heroPhoto: "/images/me-hero.png",
  aboutPhoto: "/images/me-about.png",
  resumeUrl: "/resume.pdf",
};
