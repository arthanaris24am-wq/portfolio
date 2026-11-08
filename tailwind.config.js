/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: {
          DEFAULT: '#0a0a0c',
          card: '#0f0f13',
          elevated: '#15151a',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 90, 31, 0.3)',
        },
        accent: {
          DEFAULT: '#ff5a1f', // Ember Orange
          light: '#ff7842',
          dark: '#d64109',
          glow: 'rgba(255, 90, 31, 0.35)',
        },
        muted: {
          light: '#a1a1aa',
          DEFAULT: '#71717a',
          dark: '#3f3f46',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%)',
        'subtle-radial': 'radial-gradient(circle at 50% 0%, rgba(255, 90, 31, 0.12) 0%, transparent 65%)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        sweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'light-sweep': 'sweep 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

