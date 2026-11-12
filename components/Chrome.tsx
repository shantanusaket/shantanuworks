"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
/** Hides the public header/footer/chatbot inside /admin. */
export default function Chrome({ top, bottom, children }: { top: ReactNode; bottom: ReactNode; children: ReactNode }) {
  const admin = usePathname()?.startsWith("/admin");
  return (<>{!admin && top}{children}{!admin && bottom}</>);
}
