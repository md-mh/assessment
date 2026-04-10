import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f2ff",
          100: "#ede4ff",
          200: "#d9c6ff",
          300: "#bf9eff",
          400: "#9d69ff",
          500: "#7c3aed",
          600: "#6d30e6",
          700: "#5b23cf",
          800: "#4b1fac",
          900: "#211038"
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        }
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      boxShadow: {
        card: "0 14px 34px rgba(15, 23, 42, 0.08)",
        orb: "0 12px 25px rgba(124, 58, 237, 0.35)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #7c3aed 0%, #6d30e6 45%, #5b23cf 100%)"
      }
    }
  },
  plugins: [],
};

export default config;
