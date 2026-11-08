# Arthanari S — Developer Portfolio & Cinematic Experience

A cinematic, minimal, and high-performance developer portfolio website built with **React 18, Vite, Tailwind CSS, GSAP (Timeline + ScrollTrigger), and Lenis smooth scroll**.

Features a clock intro sequence morphing into the hero, followed by a **scroll-driven cinematic experience across 7 full-screen scenes** controlled by the scroll wheel like a short film.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) synchronized with `gsap.ticker`
- **Animation Engine**: [GSAP 3](https://gsap.com/) (Timeline, ScrollTrigger, `scrub: 1`, pinned scenes)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with pure black `#050505`, ember-orange accent `#ff5a1f`, theatrical red in Scene 6, and pure white `#ffffff` in Scene 7
- **Canvas Systems**:
  - **Halftone Dotted Portrait**: High-DPI canvas sampling `/images/me-hero.png` with mouse repulsion
  - **Starfield & Space Warp**: Canvas particles moving toward camera on scroll with glowing neural core
- **Typography**: Anton, Bebas Neue, Syne, Inter, JetBrains Mono, and Playfair Display (editorial serif)
- **Performance**: 60fps locked, `will-change: transform`, pixel ratio capped at 2x, responsive for 1920×1080 down to mobile 390×844

---

## 🎬 Cinematic Structure

### Part 1: The Intro & Hero (`src/intro/IntroSequence.jsx`)
1. **0.0s – 0.8s**: Soft radial glow fades in at center; small white dot appears.
2. **0.8s – 1.6s**: Thin vertical white bar grows upward from the dot like a clock hand.
3. **1.6s – 4.0s**: Clock hand sweeps clockwise 360°, unveiling the letters of **ARTHANARI**.
4. **4.0s – 4.8s**: Anamorphic liquid chrome shine sweeps across the name.
5. **4.8s – 6.0s**: Matrix-style text scramble morphs ARTHANARI into **PORTFOLIO** (SVG-fit, auto-scaled to viewport).
6. **6.0s – 7.5s**: Halftone dotted portrait assembles behind the typography, navbar fades in, and interactive cursor enables.

---

### Part 2: Scroll Experience — 7 Scenes (`src/scenes/ScrollExperience.jsx`)

Each scene is pinned for ~200–300vh and driven by smooth scroll wheel scrub:

| # | Scene | Component | Description |
|---|-------|-----------|-------------|
| **1** | **3D Card Carousel** | `Scene1Carousel.jsx` | Netflix-style 3D horizontal row of 5 poster cards. As you scroll, the center PORTFOLIO card expands and zooms full-screen. |
| **2** | **Cinematic Poster** | `Scene2Poster.jsx` | Giant glowing ember sun (`#ff5a1f`) rises behind full-body portrait, multi-layered ground fog drifts with parallax, camera pushes forward. |
| **3** | **Interactive Tools Arc** | `Scene3ToolsArc.jsx` | Semicircle arc of 12 glass tool cards (Python, PyTorch, React, etc.) floating above the head with floating physics, cursor parallax, and hover category pills. |
| **4** | **3D Warp Space** | `Scene4ParticleSpace.jsx` | Canvas particle field (~1,500 particles) rushing toward camera, glowing neural crystal core in center, with 4 floating glass skill panels orbiting. |
| **5** | **Fragmented Face Mosaic** | `Scene5FaceCollage.jsx` | 6 polygon shard face tiles (`face-tiles/1.jpg` to `6.jpg`) tumble and assemble into a cohesive mirror portrait with an anamorphic diagonal light sweep. |
| **6** | **Editorial Red** | `Scene6EditorialRed.jsx` | Theatrical crimson light beam sweeping from corner, Playfair Display editorial headline with line-by-line mask reveal, dual circular portraits, and 3 pinned horizontal project cards. |
| **7** | **Minimal White Finish** | `Scene7Finish.jsx` | Clean high-contrast white background switch (`#ffffff`), big minimal black display typography, monochrome portrait rising with slow parallax, interactive 3D project cards, one-click email copying, phone calling, resume download, and "Back to Top" button. |

---

## 🚀 Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ✏️ How to Customize Text, Photos & Tools

Everything in this portfolio is controlled by a **single configuration file**:
👉 **`src/data/content.js`**

### 1. Changing Your Personal Info
```javascript
export const personalData = {
  name: "Arthanari S",
  role: "AI & ML Engineer",
  tagline: "Engineering intelligent systems with data, vision, and scale.",
  email: "arthanaris007@gmail.com",
  phone: "+91 6379001272",
  github: "https://github.com/arthanaris24am-wq",
  leetcode: "https://leetcode.com/u/ArthanariS/",
  linkedin: "https://www.linkedin.com/in/arthanari-s-1ab90a338/",
};
```

### 2. Changing Photos
Save your images in the `public/images/` directory and update the paths in `src/data/content.js`:
- Hero halftone photo: `public/images/me-hero.png`
- Standing cutout (Scene 2 & 3): `public/images/scenes/standing-cutout.png`
- Face closeup (Scene 5 & 6): `public/images/scenes/face-closeup.jpg`
- Light portrait (Scene 7): `public/images/scenes/light-portrait.jpg`
- Face tiles (Scene 5): `public/images/scenes/face-tiles/1.jpg` ... `6.jpg`

> **Note**: Every image component has built-in graceful fallbacks if an asset is missing or loading.

### 3. Adding or Editing Projects
Edit `projectsList` in `src/data/content.js`:
```javascript
export const projectsList = [
  {
    id: "ai-expense-tracker",
    title: "AI Expense Tracker",
    tagline: "Intelligent Transaction Classification & Spending Analysis",
    description: "End-to-end intelligent financial management system featuring automated ML transaction classification...",
    tags: ["Python", "Machine Learning", "Scikit-Learn", "Streamlit", "Pandas"],
    github: "https://github.com/arthanaris24am-wq",
    live: "https://github.com/arthanaris24am-wq",
    image: "/images/projects/expense-tracker.svg",
    number: "01"
  },
  // Add more projects here...
];
```

### 4. Updating Tech Stack (Tools Arc)
Edit `toolsList` in `src/data/content.js`:
```javascript
export const toolsList = [
  {
    name: "Python",
    category: "Language",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">...</svg>`
  },
  // Add up to 12 tools...
];
```

---

## 🛠️ How to Add a New Scene

1. **Create the scene component** in `src/scenes/Scene8YourScene.jsx`:
```jsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Scene8YourScene() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
      }
    })
    .fromTo(contentRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#050505] text-[#ededed]">
      <div ref={contentRef} className="flex items-center justify-center h-full">
        <h2 className="text-4xl font-display">New Scene</h2>
      </div>
    </section>
  );
}
```

2. **Mount it in `src/scenes/ScrollExperience.jsx`**:
```jsx
import Scene8YourScene from './Scene8YourScene';

// Inside ScrollExperience return:
<Scene8YourScene />
```

3. Update the total count in `ScrollExperience.jsx` from `07` to `08`.

---

## 📁 Project Structure

```
portfolio/
├── index.html                               # Fonts & preloads
├── package.json                             # Dependencies (React, GSAP, Lenis, Tailwind)
├── vite.config.js
├── tailwind.config.js
├── public/
│   ├── favicon.svg
│   ├── resume.pdf                           # Downloadable CV
│   └── images/
│       ├── me-hero.png                      # Hero halftone portrait
│       ├── projects/                        # Project showcase vectors
│       └── scenes/                          # Scene cutouts & face tiles
│           ├── standing-cutout.png
│           ├── face-closeup.jpg
│           ├── light-portrait.jpg
│           └── face-tiles/ (1.jpg - 6.jpg)
└── src/
    ├── main.jsx
    ├── App.jsx                              # Mounts IntroSequence & ScrollExperience
    ├── index.css                            # Metallic gradients, grain, 3D helpers
    ├── data/
    │   └── content.js                       # 🌟 SINGLE SOURCE OF TRUTH
    ├── components/
    │   ├── CustomCursor.jsx                 # Dual-ring magnetic cursor
    │   ├── CanvasStars.jsx                  # Twinkling starfield background
    │   └── TastefulImage.jsx                # Graceful image fallback wrapper
    ├── intro/
    │   ├── IntroSequence.jsx                # Clock intro & centered PORTFOLIO hero
    │   └── HalftonePortraitCanvas.jsx       # Interactive dotted portrait canvas
    └── scenes/
        ├── ScrollExperience.jsx             # Lenis + ScrollTrigger orchestrator & HUD
        ├── Scene1Carousel.jsx               # Netflix 3D poster card carousel
        ├── Scene2Poster.jsx                 # Rising ember sun & ground fog poster
        ├── Scene3ToolsArc.jsx               # Semicircle 12-tool glass arc
        ├── Scene4ParticleSpace.jsx          # 3D warp space & neural crystal
        ├── Scene5FaceCollage.jsx            # 6-shard face mosaic assembly
        ├── Scene6EditorialRed.jsx           # Crimson spotlight & horizontal projects
        └── Scene7Finish.jsx                 # Pure white finish & contact block
```

---

## 📄 License
MIT © [Arthanari S](https://github.com/arthanaris24am-wq)
