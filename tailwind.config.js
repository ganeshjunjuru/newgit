/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eeff',
          100: '#ccdeff',
          200: '#99bdff',
          300: '#669cff',
          400: '#337bff',
          500: '#005aff',
          600: '#0048cc',
          700: '#003699',
          800: '#002466',
          900: '#ffffff', // Primary dark blue
        },
        secondary: {
          50: '#fdf6ed',
          100: '#faedda',
          200: '#f5dbb6',
          300: '#f0c992',
          400: '#ebb76d',
          500: '#E6AA68', // Gold accent
          600: '#b88853',
          700: '#8a663e',
          800: '#5c442a',
          900: '#2e2215',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this path includes your PopupsPage.tsx
  ],
  theme: {
    extend: {
      colors: {
        // Professional, clean color palette
        'primary-blue': '#2563EB', // A strong, clean blue for main actions/branding
        'primary-dark': '#1F2937', // Dark text/background elements
        'light-gray': '#F9FAFB',   // Very light background
        'medium-gray': '#E5E7EB',  // Borders, subtle backgrounds
        'dark-gray': '#6B7280',    // Secondary text
        'accent-green': '#10B981', // Success
        'accent-red': '#EF4444',   // Error
        'accent-yellow': '#F59E0B',// Warning/Deactivate
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideInDown: 'slideInDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideInDown: {
          'from': { transform: 'translateY(-50px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Recommended for better default form styling
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'var(--tw-scroll-thumb) var(--tw-scroll-track)',
        },
        '.scrollbar-thumb-blue': {
          '--tw-scroll-thumb': '#2563EB', // primary-blue
        },
        '.scrollbar-track-gray': {
          '--tw-scroll-track': '#E5E7EB', // medium-gray
        },
      }, ['responsive']);
    }
  ],
}