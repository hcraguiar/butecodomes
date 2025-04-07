'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/ui/button';
import Logo from '@/app/ui/logo';


export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      {/* Logo com alternância de tema */}
      <Logo />
      
      {/* Mensagem de Boas-Vindas */}
      <h1 className="text-4xl font-bold text-brown dark:text-gold md:text-5xl font-primary">Bem-vindo ao Buteco do Mês!</h1>
      <p className="mt-4 text-lg text-darkBrown dark:text-beige max-w-xl font-secondary">
        Obrigado por fazer parte da nossa comunidade. Vamos brindar a novas descobertas! 🍻
      </p>

      {/* Botão de Entrar */}
      <Link href="/login" className='mt-6'>
        <Button
          variant="primary"
        >
          Entrar
        </Button>
      </Link>
      
      {/* Imagem de Destaque */}
      <div className="relative w-full max-w-md mt-6">
        <Image 
          src="/bar-image.png" 
          alt="Imagem de um bar aconchegante"
          width={600} 
          height={400} 
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}
