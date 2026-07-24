"use client";

import { RouterProvider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

export default function HeroUIProviderWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <RouterProvider
      navigate={(path) => router.push(path)}
      useHref={(path) => path}
    >
      {children}
    </RouterProvider>
  );
}
