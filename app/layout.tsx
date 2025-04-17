"use client";

import '@/app/ui/global.css';
import { Inter, Pacifico, Playfair_Display } from 'next/font/google';
import { useState, useEffect } from 'react';
import Button from '@/app/ui/button';
import { Providers } from '@/app/providers';
import { Toaster } from 'react-hot-toast';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-playfair',
})

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
    <html lang="pt-br" className={`${darkMode ? 'dark' : ''} font-primary ${inter.variable} ${pacifico.variable} ${playfair.variable}`}>
      <body className='flex flex-col min-h-screen bg-primary dark:bg-dark-primary text-foreground dark:text-muted font-secondary transition-all relative'>
        {/* Botão de alternância de tema */}
        <div className={`absolute top-4 right-4 z-10 md:top-6 md:right-6`}>
          <Button onClick={() => setDarkMode(!darkMode)} variant="toggle" size='icon'>
            <span>{darkMode ? <MoonIcon className='h-5 w-5' /> : <SunIcon className='h-5 w-5' />}</span>
          </Button>
          <Toaster />
        </div>

        <main className="">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
