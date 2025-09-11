/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'thai': ['SukhumvitSet', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        'english': ['MontserratCustom', 'Montserrat', 'system-ui', 'sans-serif'],
        'sukhumvit': ['SukhumvitSet', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        'montserrat': ['MontserratCustom', 'Montserrat', 'system-ui', 'sans-serif'],
        'sans': ['SukhumvitSet', 'MontserratCustom', 'Montserrat', 'system-ui', 'sans-serif']
      },
      textShadow: {
        sm: "rgba(255, 255, 255, 0.35) 1px 1px 12px",
      },
      colors: {
        // Limited palette: black, blue, white/gray
        black: '#000000',
        white: '#ffffff',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      )
    },
  ],
}