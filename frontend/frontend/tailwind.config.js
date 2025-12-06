/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5A70", // Caremom Pink
        secondary: "#FFE8EC", 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"], // Force light mode for government look
  },
}