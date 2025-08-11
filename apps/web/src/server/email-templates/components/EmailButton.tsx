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
  const isPrimary = variant === "primary";
  
  return (
    <Link
      href={href}
      style={{
        backgroundColor: isPrimary ? "#3b82f6" : "transparent",
        color: isPrimary ? "#ffffff" : "#3b82f6",
        border: isPrimary ? "none" : "2px solid #3b82f6",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        padding: "12px 24px",
        textDecoration: "none",
        display: "inline-block",
        textAlign: "center" as const,
        minWidth: "120px",
        boxSizing: "border-box" as const,
      }}
    >
      {children}
    </Link>
  );
}