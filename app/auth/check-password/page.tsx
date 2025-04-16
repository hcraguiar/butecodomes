import CheckPasswordPage from "@/app/ui/auth/check-password";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CheckPasswordPage />
    </Suspense>
  );
}