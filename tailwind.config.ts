import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy:        '#732C3F',
        'burgundy-deep': '#5A1F2E',
        'burgundy-rich': '#8A3349',
        'dusty-rose':    '#C57C8A',
        'pale-pink':     '#F7E8EC',
        gold:            '#EDC967',
        'near-black':    '#1A0B12',
      },
      fontFamily: {
        // CSS variable injected by next/font — must use var() not the literal name
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
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
