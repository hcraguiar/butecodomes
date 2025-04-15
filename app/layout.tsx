"use client";

import '@/app/ui/global.css';
import { Inter, Pacifico } from 'next/font/google';
import { useState, useEffect } from 'react';
import Button from '@/app/ui/button';
import { Providers } from '@/app/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <html lang="pt-br" className={`${darkMode ? 'dark' : ''} font-primary ${inter.variable} ${pacifico.variable}`}>
      <body className='flex flex-col min-h-screen bg-beige dark:bg-darkBrown text-darkBrown dark:text-beige font-secondary transition-all relative'>
        {/* Botão de alternância de tema */}
        <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
          <Button onClick={() => setDarkMode(!darkMode)} variant="toggle">
            <span className="md:hidden">{darkMode ? '🌙' : '☀️'}</span>
            <span className="hidden md:inline">{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
          </Button>
        </div>

        <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
