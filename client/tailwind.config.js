/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode using class strategy
  theme: {
    extend: {
      colors: {
        // Add any custom colors here
      },
    },
  },
  plugins: [],
}

