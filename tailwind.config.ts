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
        background: '#F5DFC7',
        session: '#EDD8C1',
        primary: '#D38C3C',
        secondary: '#9FE486',
        accent: '#69DD82',
        
        
        // Dark mode (usado com classes 'dark')
        'dark-background': '#130F0A',
        'dark-session': '#1A1712',
        'dark-primary': '#DBC19E',       
        'dark-secondary': '#1E5943',     
        'dark-accent': '#56A1C0',        
        
        
        // Texto padrão
        foreground: "#080502",
        muted: "#63605C",
        'dark-foreground': '#F6EFE7',
        'dark-muted': '#9E9992',
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
