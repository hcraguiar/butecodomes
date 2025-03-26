import HomeLogo from "@/app/ui/home-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import GoogleSignInButton from "@/app/ui/sign-in";

export default async function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-neutral-300 p-3 md:h-36">
          <div className="w-32 md:w-36">
            <HomeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />  
        </Suspense>
        <Suspense>
          <GoogleSignInButton />
        </Suspense>
      </div>
    </main>
  )
}
