/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',  // Your main primary color
          600: '#eb3c25ff',  // Hover state
          700: '#d8581dff',  // Active state
          800: '#1e40af',
          900: '#c20a0aff',
        }
      },
      // Optional: Extend spacing, borderRadius, etc.
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}