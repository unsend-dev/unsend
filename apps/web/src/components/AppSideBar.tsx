"use client";

import {
  BookUser,
  Calendar,
  Code,
  Cog,
  Globe,
  Home,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Search,
  Server,
  Settings,
  Volume2,
  BookOpenText,
  ChartColumnBig,
  ChartArea,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@unsend/ui/src/sidebar";
import Link from "next/link";
import { MiniThemeSwitcher, ThemeSwitcher } from "./theme/ThemeSwitcher";
import { useSession } from "next-auth/react";
import { isSelfHosted } from "~/utils/common";
import { usePathname } from "next/navigation";
import { Badge } from "@unsend/ui/src/badge";

// General items
const generalItems = [
  {
    title: "Analytics",
    url: "/dashboard",
    icon: ChartColumnBig,
  },
  {
    title: "Emails",
    url: "/emails",
    icon: Mail,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
];

// Marketing items
const marketingItems = [
  {
    title: "Contacts",
    url: "/contacts",
    icon: BookUser,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Volume2,
  },
];

// Settings items
const settingsItems = [
  {
    title: "Domains",
    url: "/domains",
    icon: Globe,
  },
  {
    title: "Developer settings",
    url: "/dev-settings",
    icon: Code,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Cog,
  },
  // TODO: Add conditional logic for Admin item based on isSelfHosted() || session?.user.isAdmin
  {
    title: "Admin",
    url: "/admin",
    icon: Server,
    isAdmin: true,
    isSelfHosted: true,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const { state, open } = useSidebar();

  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarGroupLabel>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              Unsend
            </span>
            <Badge variant="outline">Beta</Badge>
          </div>
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>General</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Marketing</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketingItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="text-sidebar-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Settings</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);

                if (item.isAdmin && !session?.user.isAdmin) {
                  return null;
                }
                if (item.isSelfHosted && !isSelfHosted()) {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOut()} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Docs">
                <Link href="https://docs.unsend.dev" target="_blank">
                  <BookOpenText />
                  <span>Docs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="px-2">
              <ThemeSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
