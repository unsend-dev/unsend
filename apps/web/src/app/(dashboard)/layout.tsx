import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  BookUser,
  CircleUser,
  Code,
  ExternalLink,
  Globe,
  Home,
  LayoutDashboard,
  LineChart,
  Mail,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Volume2,
} from "lucide-react";
import { Button } from "@unsend/ui/src/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unsend/ui/src/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@unsend/ui/src/sheet";

import { getServerAuthSession } from "~/server/auth";
import { NavButton } from "./nav-button";
import { db } from "~/server/db";
import { SessionProvider } from "next-auth/react";
import { DashboardProvider } from "~/providers/dashboard-provider";
import { NextAuthProvider } from "~/providers/next-auth";

export const metadata = {
  title: "Unsend",
  description: "Open source sending infrastructure for developers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function AuthenticatedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <DashboardProvider>
        <div className="flex min-h-screen w-full h-full">
          <div className="hidden bg-muted/20 md:block md:w-[280px]">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 gap-4 items-center px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <span className=" text-lg">Unsend</span>
                </Link>
                <span className="text-[10px] text-muted-foreground bg-muted p-0.5 px-2 rounded-full">
                  Early access
                </span>
              </div>
              <div className="flex-1 h-full">
                <nav className=" flex-1 h-full flex-col justify-between items-center px-2 text-sm font-medium lg:px-4">
                  <div>
                    <NavButton href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </NavButton>

                    <NavButton href="/emails">
                      <Mail className="h-4 w-4" />
                      Emails
                    </NavButton>

                    <NavButton href="/domains">
                      <Globe className="h-4 w-4" />
                      Domains
                    </NavButton>

                    <NavButton href="/contacts" comingSoon>
                      <BookUser className="h-4 w-4" />
                      Contacts
                    </NavButton>

                    <NavButton href="/contacts" comingSoon>
                      <Volume2 className="h-4 w-4" />
                      Marketing
                    </NavButton>

                    <NavButton href="/api-keys">
                      <Code className="h-4 w-4" />
                      Developer settings
                    </NavButton>
                  </div>
                  <div className=" absolute bottom-10 p-4">
                    <Link
                      href="https://docs.unsend.dev"
                      target="_blank"
                      className="flex gap-2 items-center"
                    >
                      <BookOpenText className="h-4 w-4" />
                      <span className="">Docs</span>
                    </Link>
                  </div>
                </nav>
              </div>
              <div className="mt-auto p-4"></div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-4 md:hidden  bg-muted/20 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Package2 className="h-6 w-6" />
                      <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Orders
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Package className="h-5 w-5" />
                      Products
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Users className="h-5 w-5" />
                      Customers
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <LineChart className="h-5 w-5" />
                      Analytics
                    </Link>
                  </nav>
                  <div className="mt-auto"></div>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex-1 overflow-y-auto h-full">
              <div className="flex flex-col gap-4 p-4 w-full lg:max-w-6xl mx-auto lg:gap-6 lg:p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DashboardProvider>
    </NextAuthProvider>
  );
}
