import React from "react";
import { Link } from "jsx-email";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function EmailButton({ 
  href, 
  children, 
  variant = "primary" 
}: EmailButtonProps) {
  return (
    <Link
      href={href}
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        border: "1px solid #000000",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "500",
        padding: "12px 24px",
        textDecoration: "none",
        display: "inline-block",
        textAlign: "left" as const,
        minWidth: "120px",
        boxSizing: "border-box" as const,
      }}
    >
      {children}
    </Link>
  );
}