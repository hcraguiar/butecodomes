import Logo from "@/app/ui/logo";
import FormPassword from "@/app/ui/register/form-password";
import { Suspense } from "react";

export default function RegisterPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      <Logo />
      <p className="mt-2 text-base md:text-lg max-w-xl font-secondary">
        Crie uma senha.
      </p>
      <Suspense>
        <FormPassword />
      </Suspense>
    </div>
  );
}
