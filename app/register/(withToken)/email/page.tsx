import RegisterWithEmailForm from "@/app/ui/register/form-email";
import Logo from "@/app/ui/logo";
import { Suspense } from "react";

export default function RegisterWithEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      <Suspense>
        <RegisterWithEmailForm> </RegisterWithEmailForm>
      </Suspense>
    </div>
  );
}

