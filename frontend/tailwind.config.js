/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // blue-600
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          DEFAULT: '#7C3AED', // purple-600
          600: '#7C3AED',
          700: '#6D28D9'
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        surface: '#FFFFFF',
        muted: '#6B7280',
        soft: '#F8FAFC'
      },
      borderRadius: {
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)',
        soft: '0 1px 3px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
