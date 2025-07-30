/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Base Power brand colors
        blue: {
          5: '#F0F8FB',
          10: '#B8E5F2',
          40: '#1B8BAC',
          90: '#0E4656',
        },
      },
      fontFamily: {
        'primary': ['PP Neue Montreal', 'Inter', 'system-ui', 'sans-serif'],
        'fallback': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-2': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-3': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-4': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-5': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-6': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-xlarge': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-large': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
