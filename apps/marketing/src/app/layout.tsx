import "@usesend/ui/styles/globals.css";

import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@usesend/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "useSend – Open source email platform",
  description:
    "Open source email platform for everyone: SMTP, API, editor, analytics.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://usesend.dev"),
  openGraph: {
    title: "useSend – Open source email platform",
    description:
      "Open source email platform for everyone: SMTP, API, editor, analytics.",
    url: "https://usesend.dev",
    siteName: "useSend",
    images: [
      {
        url: "/logo-squircle.png",
        width: 512,
        height: 512,
        alt: "useSend",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "useSend – Open source email platform",
    description:
      "Open source email platform for everyone: SMTP, API, editor, analytics.",
    images: ["/logo-squircle.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-sidebar-background">
      <body
        className={`font-mono ${inter.variable} ${jetbrainsMono.variable} bg-sidebar-background`}
      >
        {/* System theme with isolated storage to avoid stale overrides */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="marketing-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
