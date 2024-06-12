import "@unsend/ui/styles/globals.css";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@unsend/ui";
import { Toaster } from "@unsend/ui/src/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";
import { getBoss } from "~/server/service/job-service";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Unsend",
  description: "Open source sending infrastructure for developers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Because I don't know a better way to call this during server startup.
   * This is a temporary fix to ensure that the boss is running.
   */
  // await getBoss();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Toaster />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
