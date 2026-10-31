/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#080B10",
        steel: "#171E28",
        electric: "#287BFF",
        cyan: { stark: "#57DFFF" },
        crimson: "#C7353D",
        titanium: "#C5CBD2",
        snow: "#E8EDF2",
      },
      fontFamily: {
        display: ['"Chakra Petch"', "Rajdhani", "Arial Narrow", "sans-serif"],
        body: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
