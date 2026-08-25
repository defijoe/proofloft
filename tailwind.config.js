/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — warm editorial. Ember is the one CTA color (white text on it).
        cta: { DEFAULT: "#b45309", hover: "#96430a" },
        // Dark surface color — deep navy (replaced near-black, Aug 2026).
        navy: { DEFAULT: "#1b2a4a", deep: "#131f38" },
        amber: "#e8960c",
        wheat: "#e9d8a8",
        cream: "#f7f0de",
        ink: { DEFAULT: "#1a1611", 2: "#57503f", 3: "#6d685b" },
        line: "#e8e2d6",
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Segoe UI"', "-apple-system", "sans-serif"],
        sans: ['"Inter"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: { card: "28px", btn: "14px" },
      boxShadow: {
        card: "0 2px 6px rgba(26,22,17,.04), 0 18px 44px rgba(26,22,17,.07)",
        cta: "0 8px 24px rgba(180,83,9,.35)",
      },
    },
  },
  // Existing hand-rolled design system stays untouched; Tailwind only styles
  // what uses its classes. Preflight off so it can't reset the rest of the app.
  corePlugins: { preflight: false },
  plugins: [],
};
