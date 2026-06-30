/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#151515',
          muted: '#6b7280',
          accent: '#1717e5',
          cta: '#c2410c',
          'cta-hover': '#9a3412',
          surface: '#f8f9fa',
          border: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '300',
        medium: '300',
        semibold: '700',
        bold: '700',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(23, 23, 229, 0.25)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
