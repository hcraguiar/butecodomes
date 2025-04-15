"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <>
    <Link href='/'>
      <div className="flex justify-center">
        <Image 
          src="/logo.png" 
          alt="Buteco do Mês" 
          width={200} 
          height={100} 
          className="dark:hidden"
          />
        <Image 
          src="/logo-dark.png" 
          alt="Buteco do Mês" 
          width={200} 
          height={100} 
          className="hidden dark:block"
          />
      </div>
    </Link>
    </>
  );
}
