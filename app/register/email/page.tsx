import RegisterWithEmailForm from "@/app/ui/register/form-email";
import Logo from "@/app/ui/logo";
import { Suspense } from "react";

export default function RegisterWithEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      <Logo />
      <h1 className="text-3xl md:text-4xl font-bold mt-6">Registrar</h1>
      <p className="mt-2 text-base md:text-lg max-w-xl font-secondary">
        Insira seus dados.
      </p>
      <Suspense>
        <RegisterWithEmailForm />
      </Suspense>
    </div>
  );
}
