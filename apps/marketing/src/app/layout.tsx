import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@unsend/ui/styles/globals.css";
import { ThemeProvider } from "@unsend/ui/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unsend",
  description: "Open source sending infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="dark">
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
