import { Suspense } from "react";
import RegisterPage from "@/app/ui/register/client-page";

export default function Page() {
  return (
    <Suspense>
      <RegisterPage> </RegisterPage>
    </Suspense>
  );
}