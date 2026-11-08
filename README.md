# Arthanari S — Cinematic Intro Sequence

A cinematic, minimal, and high-performance developer intro animation built with **React, Vite, Tailwind CSS, and GSAP**.

Engineered as a self-contained component (`src/intro/IntroSequence.jsx`) designed to smoothly hand over to subsequent sections or any next page.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Animation Engine**: [GSAP](https://gsap.com/) (Timeline, transforms, text scrambling, 60fps)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with pure black `#050505` and metallic liquid chrome gradient
- **Canvas Systems**: 
  - **Dotted Halftone Portrait Canvas**: Dynamically samples `/images/me-hero.png`, assembles dots from scattered particles, and reacts to mouse cursor proximity with organic spring repulsion.
  - **Twinkling Starfield Canvas**: Ultra-lightweight 2D canvas stars and ember specks.
- **Micro-Interactions**: Custom magnetic dual-ring cursor (auto-disabled on mobile touch).

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
Open your browser and navigate to:
👉 **`http://localhost:5173`**

### 3. Build for Production
```bash
npm run build
```

---

## ✏️ How to Change Name, Photo, and Colour

Everything is configured in one single file:
📁 **`src/data/content.js`**

```javascript
export const introConfig = {
  // Intro Name (ONE word, uppercase)
  introName: "ARTHANARI",
  
  // Final word after text-scramble morph
  finalWord: "PORTFOLIO",
  
  // Subtitle appearing directly below the left edge of PORTFOLIO
  roleSubtitle: "AI & ML Engineer / Full-Stack Developer",
  
  // Accent color (Ember Orange)
  accentColor: "#ff5a1f",
  
  // Cutout Photo path (subject-only with transparent background)
  heroPhoto: "/images/me-hero-cutout.png",
};
```

### Swapping Your Photo
1. Save your transparent subject cutout as `/public/images/me-hero-cutout.png`.
2. The canvas samples only pixels with `alpha > 0.5` to construct the dotted halftone portrait without any background or rectangular edges.
3. The dots automatically scale to face brightness and react to mouse cursor proximity with spring repulsion.

---

## 🖥️ Screen Responsiveness & Auto-Fit Engine

The word size is dynamically computed using a `ResizeObserver` + Canvas measurement algorithm:
- **Desktop (>= 768px)**: Auto-fits word to **~86%** viewport width, capped at **28vh** height.
- **Mobile (< 768px)**: Auto-fits word to **~92%** viewport width, capped at **28vh** height.
- **Zero Horizontal Overflow**: Guaranteed fit across all screens (1920x1080, 1440x900, 1366x768, 390x844 mobile).
- **Subtitle Alignment**: Mathematically locked to the left margin of the first letter with a dark glass backing.

### Quick State Testing:
- Visit `http://localhost:5173/?skip=true` to view the final assembled hero state immediately.
- Visit `http://localhost:5173/?state=name` to view the initial intro name typography state.

---

## 🎬 Intro Timeline Breakdown (7.5 Seconds)

The timeline is orchestrated in `src/intro/IntroSequence.jsx` in clearly commented blocks:

| Time | Phase | Description |
| :--- | :--- | :--- |
| **0.0 – 0.8s** | **Origin** | A soft radial glow fades in at the center; a small white dot appears and glows. |
| **0.8 – 1.6s** | **Clock Hand** | A thin vertical white bar extends upward from the dot like a clock hand / exclamation mark `!`. Glow pulses once. |
| **1.6 – 4.0s** | **Sweep & Release** | The hand rotates clockwise around the dot. Each letter of `ARTHANARI` is thrown from the tip, flies with slight rotation/blur, and settles crisp into position. |
| **4.0 – 4.8s** | **Hold & Shine** | Clock hand and dot fade out. The assembled name holds as a metallic light-sweep shine glides across the letters. |
| **4.8 – 6.0s** | **Text-Scramble Morph** | Letters scramble through random glyphs and resolve into `PORTFOLIO`. Role subtitle fades in at bottom-left. |
| **6.0 – 7.5s** | **Halftone Assembly** | Starfield fades in; halftone portrait particles assemble behind the text. Mouse cursor near the portrait gently repels dots. Navbar slides in from top. |

> **Skip Button**: A minimal *"Skip Intro →"* button is always available at the bottom-right for instant transition to the final state.
> **Accessibility**: Honors `prefers-reduced-motion` by jumping directly to the final hero state without playing the timeline.

---

## 🧩 Where to Add Next Sections (Hand-Over)

The intro sequence is completely self-contained in `src/intro/IntroSequence.jsx`.

In `src/App.jsx`, listen to the `onComplete` callback:

```jsx
import { useState } from 'react';
import IntroSequence from './intro/IntroSequence';
// Import your future sections:
// import About from './sections/About';
// import Projects from './sections/Projects';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#ededed]">
      {/* 1. Cinematic Intro Sequence */}
      <IntroSequence onComplete={() => setIntroFinished(true)} />

      {/* 2. Future Sections can be mounted below once intro completes: */}
      {/* {introFinished && (
        <main>
          <About />
          <Projects />
          <Contact />
        </main>
      )} */}
    </div>
  );
}
```

---

## 📁 Project Structure

```
portfolio/
├── index.html                           # Font imports (Syne, Anton, Bebas Neue, Inter)
├── package.json                         # Dependencies & scripts
├── vite.config.js
├── tailwind.config.js
├── public/
│   ├── favicon.svg
│   ├── resume.pdf
│   └── images/
│       └── me-hero.png                  # Your photo for halftone particle portrait
└── src/
    ├── main.jsx
    ├── App.jsx                          # Main orchestrator & hand-over hook
    ├── index.css                        # Metallic text gradients & film grain
    ├── data/
    │   └── content.js                   # 🌟 Single source of truth (name, photo, colors)
    ├── components/
    │   ├── CustomCursor.jsx             # Magnetic dual-ring cursor
    │   └── CanvasStars.jsx              # Lightweight starfield canvas
    └── intro/
        ├── IntroSequence.jsx            # 🌟 Master 7.5s GSAP timeline
        └── HalftonePortraitCanvas.jsx   # 🌟 Interactive assembling halftone particle portrait
```

---

## 📄 License
MIT © [Arthanari S](https://github.com/arthanaris24am-wq)
