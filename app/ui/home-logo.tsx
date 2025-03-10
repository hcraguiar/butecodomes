import Image from 'next/image';

export default function HomeLogo() {
  return (
    <div
      className={`flex flex-row items-center leading-none`}
    >
      <Image src={'/website-dark-logo-320x86.png'} width={320} height={86} alt="App Logo" className='hidden md:block'/>
      <Image src={'/logo-260x260.png'} width={48} height={48} alt="App Icon" className='block md:hidden'/>
    </div>
  );
}
