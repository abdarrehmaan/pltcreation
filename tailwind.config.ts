import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette: Deep Crimson
        brand: {
          50:  '#fff0f2',
          100: '#ffd6db',
          200: '#ffadb8',
          300: '#ff7a8a',
          400: '#ff3d52',
          500: '#e0001b',
          600: '#b80016', // mid crimson
          700: '#8f0011',
          800: '#66000c',
          900: '#590016', // PRIMARY — deep crimson
          950: '#3a000e',
        },
        gold: {
          50:  '#fefaeb',
          100: '#fdf0c7',
          200: '#fce08e',
          300: '#fac94e',
          400: '#f8b324',
          500: '#c9a84c', // primary gold
          600: '#b8892a',
          700: '#9a6a1d',
          800: '#7d521c',
          900: '#68441c',
        },
        ivory: {
          50:  '#fdfcf9',
          100: '#f9f5ed',
          200: '#f5f0e8', // primary ivory
          300: '#ede3d2',
          400: '#ddd0b8',
          500: '#c8b89a',
          600: '#ae9877',
          700: '#917a5b',
          800: '#77634c',
          900: '#625141',
        },
        crimson: {
          deep: '#590016',
          medium: '#b80016',
          light: '#ff7a8a',
          pale: '#fff0f2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #590016 0%, #b80016 50%, #c9a84c 100%)',
        'gradient-hero': 'linear-gradient(to right, rgba(89,0,22,0.92) 0%, rgba(89,0,22,0.5) 60%, transparent 100%)',
        'gradient-card': 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a84c 0%, #f8b324 50%, #c9a84c 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 25s ease-in-out infinite',
        'shimmer-gold': 'shimmerGold 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shimmerGold: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(5%, 10%) scale(1.05)' },
          '50%': { transform: 'translate(0, 15%) scale(1)' },
          '75%': { transform: 'translate(-5%, 5%) scale(0.95)' },
        },
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(89, 0, 22, 0.4)',
        'brand-lg': '0 8px 40px rgba(89, 0, 22, 0.5)',
        'gold': '0 4px 24px rgba(201, 168, 76, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.1)',
        'nav': '0 4px 32px rgba(0, 0, 0, 0.04)',
        'neumorph': '10px 10px 20px #e6dfd6, -10px -10px 20px #ffffff',
        'neumorph-inner': 'inset 5px 5px 10px #e6dfd6, inset -5px -5px 10px #ffffff',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring-gentle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
