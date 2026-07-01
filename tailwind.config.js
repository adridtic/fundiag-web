/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./main.js"],
  theme: {
    extend: {
      colors: {
        primary: "#00478d",
        "primary-container": "#005eb8",
        secondary: "#006e2a",
        "secondary-container": "#5cfd80",
        "on-secondary-container": "#00732c",
        tertiary: "#004c71",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        background: "#f9f9ff",
        surface: "#f9f9ff",
        "on-surface": "#191c21",
        "on-surface-variant": "#424752",
        outline: "#727783",
        "outline-variant": "#c2c6d4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3fb",
        "surface-container": "#ecedf6",
        "surface-container-high": "#e7e8f0",
        "surface-container-highest": "#e1e2ea",
      },
      maxWidth: {
        container: "1280px",
      },
      fontFamily: {
        heading: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em" }],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
