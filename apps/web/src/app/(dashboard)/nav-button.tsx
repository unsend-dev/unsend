"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const NavButton: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? " bg-secondary" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  );
};
