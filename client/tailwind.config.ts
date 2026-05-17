import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF9F5",
        "bg-soft": "#F1EFE7",
        "bg-tint": "#FDFCF8",
        ink: "#0A0F1F",
        "ink-soft": "#1F2937",
        muted: "#6B7280",
        "muted-soft": "#9CA3AF",
        line: "#E5E7EB",
        "line-soft": "#F0F0EC",
        red: "#DC2626",
        "red-dark": "#991B1B",
        "red-soft": "#FEE2E2",
        blue: "#1E3A8A",
        "blue-mid": "#1E40AF",
        "blue-soft": "#DBEAFE",
        green: "#16A34A",
        "green-dark": "#15803D",
        "green-soft": "#DCFCE7",
      },
      fontFamily: {
        display: ['"Instrument Serif"', '"Times New Roman"', "serif"],
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "18px",
      },
      maxWidth: {
        container: "1320px",
      },
    },
  },
  plugins: [],
} satisfies Config;
