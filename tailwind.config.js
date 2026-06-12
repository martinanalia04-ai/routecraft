/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ESTA LÍNEA DEBE ESTAR AHÍ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}