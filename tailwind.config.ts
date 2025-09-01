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
        // Paleta de cores (Cores definidas em '/ui/global.css')
        background: "rgb(var(--background) / <alpha-value>)",
        session: "rgb(var(--session) / <alpha-value>)",
        'session-accent': "rgb(var(--session-accent) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        
        // Texto padrão
        'foreground-heading': "rgb(var(--foreground-heading) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        'foreground-on-accent': "rgb(var(--foreground-on-accent) / <alpha-value>)",
        
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
