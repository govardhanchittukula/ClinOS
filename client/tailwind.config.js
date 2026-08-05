/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#060913',
          900: '#0b0f19',
          850: '#111726',
          800: '#1e293b',
          750: '#283548',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          900: '#164e63',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-scroll': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
