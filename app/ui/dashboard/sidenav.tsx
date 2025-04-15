"use client";

import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import SignOutButton from '@/app/ui/login/sign-out';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex justify-center w-32 text-white md:w-40">
        <Logo />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <SignOutButton />
      </div>
    </div>
  );
}
