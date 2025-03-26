import HomeLogo from './ui/home-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image'; 

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-neutral-300 p-4 md:h-32">
        <HomeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Bem-vindo ao Buteco do Mês.</strong><br />
            Obrigado por fazer parte da nossa comunidade. Vamos brindar a novas descobertas! 🍻
          </p>
        
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-amber-400 px-6 py-3 text-sm font-medium transition-colors hover:bg-amber-300 md:text-base"
          >
            <span>Entrar</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/home-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Home Image Desktop"  
          />
        </div>
      </div>
    </main>
  );
}
