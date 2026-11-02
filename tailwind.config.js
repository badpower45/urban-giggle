/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a2b3c",
          hover: "#243b50",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          foreground: "#ffffff",
        },
        tertiary: "#707781",
        neutral: "#f8f9fa",
        surface: "#ffffff",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#707781",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#1a2b3c",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#1a2b3c",
        background: "#ffffff",
        foreground: "#1a2b3c",
        finance: {
          fees: "#202124",
          paid: "#00552e",
          outstanding: "#6b7280",
          expenses: "#9b4444",
          net: "#00843d",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'IBM Plex Sans Arabic'", "sans-serif"],
        headline: ["'Manrope'", "'IBM Plex Sans Arabic'", "sans-serif"],
        mono: ["monospace"],
      },
      boxShadow: {
        floating: "0 12px 30px -10px rgba(26, 43, 60, 0.12)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};
