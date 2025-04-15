import { Suspense } from "react";
import LoginPage from "@/app/ui/login/client-page";

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}