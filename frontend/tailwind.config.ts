import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3b82f6', foreground: '#fff' },
        muted: { DEFAULT: '#1e293b', foreground: '#94a3b8' },
        border: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
