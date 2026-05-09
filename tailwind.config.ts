import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,md,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens (per spec)
        pale:     '#F7E8EC', // page backgrounds
        dark:     '#1A0B12', // primary text
        burgundy: '#732C3F', // accent, CTAs
        gold:     '#EDC967', // highlights
        rose:     '#C57C8A', // secondary
        cream:    '#FFFFFF',

        // Legacy aliases (kept so existing components keep working)
        'burgundy-deep': '#5A1F2E',
        'burgundy-rich': '#8A3349',
        'dusty-rose':    '#C57C8A',
        'pale-pink':     '#F7E8EC',
        'near-black':    '#1A0B12',
      },
      fontFamily: {
        // CSS variables injected by next/font (must use var() not literal name)
        serif:   ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'Georgia', 'serif'],
        sans:    ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        orbitGlowSpin: {
          to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        scrollLinePulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.8)' },
          '50%':      { opacity: '0.9', transform: 'scaleY(1)' },
        },
      },
      animation: {
        'orbit-glow':  'orbitGlowSpin 24s linear infinite',
        'scroll-line': 'scrollLinePulse 2s ease-in-out infinite',
      },
      backdropBlur: {
        nav: '12px',
      },
    },
  },
  plugins: [],
}

export default config
