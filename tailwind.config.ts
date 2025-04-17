import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        // Paleta clara (modo light)
        primary: '#F5E1C9',
        secondary: '#B59F84',
        accent: '#775A38',
        info: '#678DA0',
        highlight: '#C9E6F5',
        contrast: '#173A4B',

        // Backgrounds e texto padrão
        background: '#F9FAFB',
        muted: "#F1F5F9",
        foreground: "#111827",
        'muted-foreground': "#6b7280",

        // Dark mode (usado com classes 'dark')
        'dark-primary': '#464039',       // versão escura do primary
        'dark-secondary': '#786C5F',     // versão escura do secondary
        'dark-accent': '#AB8A65',        // para botões em dark
        'dark-info': '#627A85',
        'dark-highlight': '384145',
        'dark-contrast': '#E5E7EB',
    
        'dark-background': '#111827',
        'dark-muted': '#1F2937',
        'dark-foreground': '#F9FAFB',
        'dark-muted-foreground': '#9CA3AF',
      },
      fontFamily: {
        primary: ['var(--font-pacifico)', 'cursive'],
        secondary: ['var(--font-inter)', 'sans-serif'],
        tertiary: ['var(--font-playfair)', 'serif'],
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
