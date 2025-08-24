"use client";

import { AppSidebar } from "~/components/AppSideBar";
import { SidebarInset, SidebarTrigger } from "@unsend/ui/src/sidebar";
import { SidebarProvider } from "@unsend/ui/src/sidebar";
import { useIsMobile } from "@unsend/ui/src/hooks/use-mobile";
import { UpgradeModal } from "~/components/payments/UpgradeModal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="h-full bg-sidebar-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto h-full p-4 xl:px-40">
            {isMobile ? (
              <SidebarTrigger className="h-5 w-5 text-muted-foreground" />
            ) : null}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <UpgradeModal />
    </div>
  );
}
