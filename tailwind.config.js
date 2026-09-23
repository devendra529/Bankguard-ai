const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (values live in globals.css, light + dark)
        background: token("--background"),
        surface: token("--surface"),
        "surface-muted": token("--surface-muted"),
        border: token("--border"),
        foreground: token("--foreground"),
        muted: token("--muted"),
        sidebar: token("--sidebar"),
        primary: {
          DEFAULT: token("--primary"),
          foreground: token("--primary-foreground"),
        },
        // Fixed brand palette
        navy: {
          DEFAULT: "#0B1B3A",
          950: "#060F22",
          900: "#0B1B3A",
          800: "#12274F",
          700: "#1B3566",
        },
        brand: {
          DEFAULT: "#2F6BFF",
          soft: "#5C8DFF",
        },
        // Risk semantics (LOW / MEDIUM / HIGH)
        "risk-low": "#10B981",
        "risk-medium": "#F59E0B",
        "risk-high": "#EF4444",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgb(11 27 58 / 0.04), 0 4px 16px rgb(11 27 58 / 0.05)",
        float: "0 24px 60px -12px rgb(2 8 23 / 0.55)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gauge-in": {
          from: { "stroke-dashoffset": "var(--gauge-circumference)" },
        },
      },
      animation: {
        "gauge-in": "gauge-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
