# Base Power Survey App - Design Overview

This document outlines the key design principles and visual guidelines for the Base Power Company Site Survey Application, ensuring a consistent, user-friendly, and on-brand experience.

## 1. Design Philosophy

The design of the Base Power Survey App prioritizes:

* **Clarity & Simplicity:** A clean and intuitive interface that guides users efficiently through the survey process.

* **Mobile-First Responsiveness:** Optimized for seamless usage on mobile devices, adapting gracefully to different screen sizes and orientations.

* **Accessibility:** Ensuring the application is usable by individuals with diverse needs, adhering to accessibility best practices.

* **Brand Consistency:** Aligning with Base Power's brand guidelines, particularly concerning color palette and typography.

* **Efficiency:** Minimizing user effort and cognitive load during data capture.

## 2. Branding & Visuals

### Color Palette

The application utilizes a specific blue palette to maintain brand consistency:

* **Blue 5:** `#F0F8FB` (Lightest Blue)

* **Blue 10:** `#B8E5F2`

* **Blue 40:** `#1B8BAC` (Primary Brand Blue)

* **Blue 90:** `#0E4656` (Darkest Blue)

### Typography

A clear typography hierarchy is established for readability and visual structure:

* **Primary Font Family:** 'PP Neue Montreal' (with 'Inter' and 'system-ui' as fallbacks)

* **Fallback Font Family:** 'Inter' (with 'system-ui', 'sans-serif' as fallbacks)

**Font Sizes (Examples):**

* `heading-1`: 48px (lineHeight: 1.2, fontWeight: 600)

* `heading-2`: 40px (lineHeight: 1.2, fontWeight: 600)

* `heading-3`: 32px (lineHeight: 1.3, fontWeight: 600)

* `heading-4`: 24px (lineHeight: 1.3, fontWeight: 600)

* `heading-5`: 20px (lineHeight: 1.4, fontWeight: 600)

* `heading-6`: 18px (lineHeight: 1.4, fontWeight: 600)

* `body-xlarge`: 18px (lineHeight: 1.5, fontWeight: 400)

* `body-large`: 16px (lineHeight: 1.5, fontWeight: 400)

* `body-medium`: 14px (lineHeight: 1.5, fontWeight: 400)

## 3. UI Components

The application leverages `shadcn/ui` components, which are built on Radix UI and styled with TailwindCSS. This provides a robust foundation for accessible and customizable UI elements, accelerating development while maintaining design consistency.

## 4. Tailwind CSS Configuration

Below is the proposed `tailwind.config.js` file, incorporating the specified color palette and typography settings.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
}