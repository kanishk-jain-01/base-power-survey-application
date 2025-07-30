# Base Power Company - Design Implementation Guide

## Overview
This document contains the complete design system for the Base Power Company Site Survey Application. All design tokens, colors, typography, and configurations are based on the official brand guidelines.

## Brand Identity

### Primary Colors
- **Grounded**: `#084D41` (Primary dark green)
- **Livewire**: `#D0F585` (Primary light green) 
- **Aluminum**: `#EDEFF0` (Light gray)

These colors should remain dominant throughout the Base experience. While not every element must use these specific tones, they should be consistently present across key design elements and provide the background for all Base-specific interactions.

### Typography
- **Primary Font**: PP Neue Montreal
- **Fallback Font**: Inter
- **System Fallback**: system-ui, sans-serif

If PP Neue Montreal is unavailable, use Inter as the preferred alternative. Inter is also the typeface used in iOS and Android applications.

## Complete Tailwind Configuration

Copy and paste this `tailwind.config.js` file exactly as shown:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY COLORS (from brand guidelines)
        'grounded': {
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
        'livewire': {
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
        'aluminum': {
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
        'primary': ['PP Neue Montreal', 'Inter', 'system-ui', 'sans-serif'],
        'fallback': ['Inter', 'system-ui', 'sans-serif'],
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
        'regular': '400',
        'medium': '500',
        'semibold': '600',
      },
      spacing: {
        // Additional spacing utilities for consistency
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'base': '8px',
        'base-lg': '12px',
      },
      boxShadow: {
        'base': '0 2px 8px rgba(8, 77, 65, 0.1)',
        'base-lg': '0 4px 16px rgba(8, 77, 65, 0.15)',
      },
    },
  },
  plugins: [],
}
```

## Typography Hierarchy

### Headings
- **Heading 1**: 48px, Line Height 1.2, Font Weight 600
- **Heading 2**: 40px, Line Height 1.2, Font Weight 600  
- **Heading 3**: 32px, Line Height 1.3, Font Weight 600
- **Heading 4**: 24px, Line Height 1.3, Font Weight 600
- **Heading 5**: 20px, Line Height 1.4, Font Weight 600
- **Heading 6**: 18px, Line Height 1.4, Font Weight 600

### Body Copy
- **Body XLarge**: 18px, Line Height 1.5, Font Weight 400
- **Body Large**: 16px, Line Height 1.5, Font Weight 400
- **Body Medium**: 14px, Line Height 1.5, Font Weight 400
- **Body Small**: 12px, Line Height 1.4, Font Weight 400
- **Body XSmall**: 10px, Line Height 1.4, Font Weight 400

## Usage Examples

### CSS Classes for Typography
```css
/* Headings */
.text-heading-1 { font-size: 48px; line-height: 1.2; font-weight: 600; }
.text-heading-2 { font-size: 40px; line-height: 1.2; font-weight: 600; }
.text-heading-3 { font-size: 32px; line-height: 1.3; font-weight: 600; }
.text-heading-4 { font-size: 24px; line-height: 1.3; font-weight: 600; }
.text-heading-5 { font-size: 20px; line-height: 1.4; font-weight: 600; }
.text-heading-6 { font-size: 18px; line-height: 1.4; font-weight: 600; }

/* Body Text */
.text-body-xlarge { font-size: 18px; line-height: 1.5; font-weight: 400; }
.text-body-large { font-size: 16px; line-height: 1.5; font-weight: 400; }
.text-body-medium { font-size: 14px; line-height: 1.5; font-weight: 400; }
.text-body-small { font-size: 12px; line-height: 1.4; font-weight: 400; }
.text-body-xsmall { font-size: 10px; line-height: 1.4; font-weight: 400; }
```

### Color Usage Examples
```css
/* Primary Brand Colors */
.bg-grounded { background-color: #084D41; }
.text-grounded { color: #084D41; }
.bg-livewire { background-color: #D0F585; }
.text-livewire { color: #D0F585; }
.bg-aluminum { background-color: #EDEFF0; }
.text-aluminum { color: #EDEFF0; }

/* Semantic Colors */
.bg-green-90 { background-color: #084D41; }
.bg-orange-40 { background-color: #E3703F; }
.bg-red-40 { background-color: #DF4903; }
.bg-blue-40 { background-color: #1B8BAC; }
```

## Design Guidelines

### Color Applications
- Use **Grounded** (#084D41) for primary actions, headers, and key navigation elements
- Use **Livewire** (#D0F585) for accents, success states, and secondary actions
- Use **Aluminum** (#EDEFF0) for backgrounds, cards, and neutral elements
- Maintain accessibility standards with proper contrast ratios
- Use semantic colors (green, orange, red, blue) for status indicators and feedback

### Spacing and Layout
- Use the custom spacing utilities (`spacing.18` and `spacing.88`) for consistent layouts
- Apply `border-radius: base` (8px) for standard elements
- Apply `border-radius: base-lg` (12px) for larger components
- Use the defined box shadows for elevation and depth

### Mobile-First Approach
This is a mobile-first application. Ensure all designs work optimally on mobile devices before scaling up to larger screens.

## Implementation Notes

1. **Font Loading**: Ensure PP Neue Montreal is properly loaded before fallback fonts
2. **Accessibility**: All color combinations must meet WCAG 2.1 AA standards
3. **Consistency**: Use only the defined color palette and typography scale
4. **Testing**: Test designs across different devices and screen sizes
5. **Performance**: Optimize for mobile performance given the camera and AR features
