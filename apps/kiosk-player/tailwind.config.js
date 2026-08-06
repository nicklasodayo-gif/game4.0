/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include the shared UI package so its Tailwind classes aren't purged.
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Poppins'", 'sans-serif'],
        body: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
