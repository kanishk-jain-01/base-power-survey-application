/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // PRIMARY COLORS (from brand guidelines)
        grounded: {
          DEFAULT: '#084D41', // Primary dark green
          50: '#E8F5F3',
          100: '#D1EBE7',
          200: '#A3D7CF',
          300: '#75C3B7',
          400: '#47AF9F',
          500: '#199B87',
          600: '#147C6C',
          700: '#0F5D51',
          800: '#0A3E36',
          900: '#084D41', // Brand color
        },
        livewire: {
          DEFAULT: '#D0F585', // Primary light green
          50: '#F8FEF0',
          100: '#F1FDE1',
          200: '#E8FCC8',
          300: '#DFFAAF',
          400: '#D6F896',
          500: '#D0F585', // Brand color
          600: '#C4F26B',
          700: '#B8EF51',
          800: '#ACEC37',
          900: '#A0E91D',
        },
        aluminum: {
          DEFAULT: '#EDEFF0', // Light gray
          50: '#FDFDFD',
          100: '#FAFBFB',
          200: '#F7F8F8',
          300: '#F4F5F6',
          400: '#F1F2F3',
          500: '#EDEFF0', // Brand color
          600: '#E5E7E8',
          700: '#DDDFE0',
          800: '#D5D7D8',
          900: '#CDCFD0',
        },
        // GRAYSCALE PALETTE
        gray: {
          5: '#F0EEEB',
          20: '#D8D7D5',
          40: '#AAAAA7',
          60: '#7F7D7A',
          80: '#54524F',
          100: '#2A2926',
        },
        // GREENS PALETTE
        green: {
          5: '#F0F6F5',
          10: '#D9F0E8',
          40: '#7FB59E',
          80: '#4F7369',
          90: '#084D41',
        },
        // ORANGES PALETTE
        orange: {
          5: '#FFF2F0',
          20: '#FFB5A4',
          40: '#E3703F',
          90: '#773600',
        },
        // REDS PALETTE
        red: {
          5: '#FFEAEA',
          20: '#FF9C80',
          40: '#DF4903',
          80: '#A63500',
        },
        // BLUES PALETTE
        blue: {
          5: '#F0F8FB',
          10: '#B8E5F2',
          40: '#1B8BAC',
          90: '#0E4656',
        },
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'], // Using Inter until PP Neue Montreal is loaded
        fallback: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography hierarchy based on brand guidelines
        'heading-1': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-2': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-3': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-4': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-5': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-6': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-xlarge': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-large': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'body-xsmall': ['10px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
      },
      spacing: {
        // Additional spacing utilities for consistency
        18: '4.5rem',
        88: '22rem',
      },
      height: {
        // Dynamic viewport height for mobile-first responsive design
        dvh: '100dvh',
      },
      minHeight: {
        // Dynamic viewport height for mobile-first responsive design
        dvh: '100dvh',
      },
      borderRadius: {
        base: '8px',
        'base-lg': '12px',
      },
      boxShadow: {
        base: '0 2px 8px rgba(8, 77, 65, 0.1)',
        'base-lg': '0 4px 16px rgba(8, 77, 65, 0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
