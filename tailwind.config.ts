import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fondo oscuro
        bg: {
          primary: '#08080f',
          secondary: '#0f0f1a',
          card: '#12121f',
          hover: '#1a1a2e',
          border: '#1e1e35',
        },
        // Neón principal (púrpura)
        neon: {
          purple: '#a855f7',
          'purple-dim': '#7c3aed',
          'purple-glow': '#c084fc',
          cyan: '#22d3ee',
          'cyan-dim': '#0891b2',
          pink: '#f472b6',
          green: '#4ade80',
          yellow: '#facc15',
        },
        // Texto
        text: {
          primary: '#f1f0ff',
          secondary: '#a09dbd',
          muted: '#64607a',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.4)',
        'neon-purple-sm': '0 0 8px rgba(168, 85, 247, 0.3)',
        'neon-cyan': '0 0 15px rgba(34, 211, 238, 0.4)',
        'neon-pink': '0 0 15px rgba(244, 114, 182, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(168, 85, 247, 0.15)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)',
        'gradient-dark': 'linear-gradient(180deg, #08080f 0%, #0f0f1a 100%)',
        'gradient-card': 'linear-gradient(145deg, #12121f 0%, #0f0f1a 100%)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
