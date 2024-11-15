/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "linear-gradient(90deg, rgba(2,10,0,0.8) 0%, rgba(2,10,0,0.7) 90%)"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}