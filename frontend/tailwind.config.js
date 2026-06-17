/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        secondary: "#FF8C42",
        accent: "#FFC857",
        background: "#0F1115",
        surface: "#161A22",
        cardBg: "#1F2532",
        borderBg: "#2B3342",
        textPrimary: "#FFFFFF",
        textSecondary: "#A0AEC0",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 15px rgba(255, 107, 0, 0.3)'
      }
    },
  },
  plugins: [],
}
