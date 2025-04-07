"use client";

import Image from "next/image";

export default function Logo() {
  return (
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
  );
}
