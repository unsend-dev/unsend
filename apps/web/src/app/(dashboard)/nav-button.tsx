"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const NavButton: React.FC<{
  href: string;
  children: React.ReactNode;
  comingSoon?: boolean;
}> = ({ href, children, comingSoon }) => {
  const pathname = usePathname();

  const isActive = pathname?.startsWith(href);

  if (comingSoon) {
    return (
      <div className="flex items-center justify-between hover:text-primary cursor-not-allowed mt-1">
        <div
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary cursor-not-allowed ${isActive ? " bg-secondary" : "text-muted-foreground"}`}
        >
          {children}
        </div>
        <div className="text-muted-foreground px-4 py-0.5 text-xs bg-muted rounded-full">
          soon
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center mt-1 gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? " bg-secondary" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  );
};

export const LogoutButton: React.FC = () => {
  return (
    <button
      className={` w-full justify-start flex items-center gap-2 rounded-lg py-2 transition-all hover:text-primary text-muted-foreground`}
      onClick={() => signOut()}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
};
