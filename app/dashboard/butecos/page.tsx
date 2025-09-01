import Button from "@/app/ui/button"
import Link from "next/link";
import ButecoListWrapper from "./components/ButecoListWrapper";
import { Suspense } from "react";

// app/batecos/page.tsx
export default function ButecosPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Butecos</h1>
      <div className="flex justify-end">
        <Link href={'/dashboard/butecos/new'}>
          <Button size="sm" className="mb-4">
            Adicionar
          </Button>
        </Link>
      </div>
        <Suspense fallback={<p className="text-sm text-muted">Carregando...</p>}>
          <ButecoListWrapper />
        </Suspense>
    </div>
  );
}

