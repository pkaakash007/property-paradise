/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        porcelain: "#F7F5F0",
        ink: "#17212B",
        slate: "#53606C",
        mist: "#E7E5DF",
        "deep-ocean": "#123B5D",
        "ocean-light": "#DCEBF4",
        champagne: "#C7A76C",
        "champagne-soft": "#F2E9D8",
        sage: "#4F7A69",
        coral: "#C65A52",
        primary: "#123B5D",
        accent: "#C7A76C",
      },
    },
  },
  plugins: [],
}

