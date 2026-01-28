/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E94B3C",   // Orangish red
        vanilla: "#F5EDE2",   // Vanilla
        dark: "#121212",
        surface: "#1A1A1A",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

