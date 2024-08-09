"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogoutButton, NavButton } from "./nav-button";
import {
  BookOpenText,
  BookUser,
  CircleUser,
  Code,
  Globe,
  Home,
  LayoutDashboard,
  LineChart,
  Mail,
  Menu,
  Package,
  Package2,
  Server,
  ShoppingCart,
  Users,
  Volume2,
} from "lucide-react";
import { env } from "~/env";
import { Sheet, SheetContent, SheetTrigger } from "@unsend/ui/src/sheet";
import { Button } from "@unsend/ui/src/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unsend/ui/src/dropdown-menu";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen w-full h-full">
      <div className="hidden bg-muted/20 md:block md:w-[280px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 gap-4 items-center px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
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

                <NavButton href="/contacts">
                  <BookUser className="h-4 w-4" />
                  Contacts
                </NavButton>

                <NavButton href="/campaigns">
                  <Volume2 className="h-4 w-4" />
                  Campaigns
                </NavButton>

                <NavButton href="/api-keys">
                  <Code className="h-4 w-4" />
                  Developer settings
                </NavButton>
                {!env.NEXT_PUBLIC_IS_CLOUD || session?.user.isAdmin ? (
                  <NavButton href="/admin">
                    <Server className="h-4 w-4" />
                    Admin
                  </NavButton>
                ) : null}
              </div>
              <div className=" absolute bottom-10 p-4 flex flex-col gap-2">
                <Link
                  href="https://docs.unsend.dev"
                  target="_blank"
                  className="flex gap-2 items-center hover:text-primary text-muted-foreground"
                >
                  <BookOpenText className="h-4 w-4" />
                  <span className="">Docs</span>
                </Link>
                <LogoutButton />
              </div>
            </nav>
          </div>
          <div className="mt-auto p-4"></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className=" h-14 items-center gap-4 hidden  bg-muted/20 px-4 lg:h-[60px] lg:px-6">
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
              <Button variant="secondary" size="icon" className="rounded-full">
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
  );
}
