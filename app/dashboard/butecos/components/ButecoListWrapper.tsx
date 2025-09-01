// components/ButecoListWrapper.tsx
"use client"

import { useSearchParams } from "next/navigation"
import ButecoList from "./buteco-list"

export default function ButecoListWrapper() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return <ButecoList query={query} />
}
