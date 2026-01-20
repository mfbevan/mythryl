"use client";

import * as React from "react";

import { SidebarPrimary } from "~/components/sidebar/sidebar.primary";
import { SidebarSecondary } from "~/components/sidebar/sidebar.secondary";
import { SidebarUser } from "~/components/sidebar/sidebar.user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import Link from "next/link";
import {
  homeUrl,
  navigation,
  type NavigationItem,
} from "../navigation/navigation";
import { usePathname } from "next/navigation";
import { useTauriStore } from "~/components/tauri";
import { MonitorSmartphone, Moon, RefreshCw, Sun } from "lucide-react";
import { isTauri } from "~/lib/tauri";
import { useTheme } from "next-themes";

const createNavItem = (item: NavigationItem, pathname: string) => {
  return {
    ...item,
    isActive: pathname === item.href,
  };
};

export const SidebarMain = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const tauri = useTauriStore();
  const { setTheme, theme } = useTheme();

  const main = [
    createNavItem(navigation.home, pathname),
    createNavItem(navigation.apps, pathname),
    createNavItem(navigation.channels, pathname),
    createNavItem(navigation.messages, pathname),
  ];

  const demo = [createNavItem(navigation.windows, pathname)];

  const secondary = [
    {
      label:
        tauri.viewMode === "desktop"
          ? "Enter Mobile Mode"
          : "Enter Desktop Mode",
      icon: MonitorSmartphone,
      href: "#",
      onClick: () => tauri.toggleViewMode(),
      isAvailable: isTauri(),
    } satisfies NavigationItem,
    {
      label: "Refresh",
      icon: RefreshCw,
      href: "#",
      onClick: () => window.location.reload(),
      isAvailable: true,
    } satisfies NavigationItem,
    {
      label: "Toggle Theme",
      icon: theme === "dark" ? Moon : Sun,
      href: "#",
    } satisfies NavigationItem,
    navigation.developers,
    navigation.settings,
  ].filter((s) => s.isAvailable);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={homeUrl}>
                <div className="bg-primary size-8 overflow-hidden rounded-sm"></div>
                <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">Mythryl</span>
                  <span className="truncate text-[10px]">
                    A Farcaster Client
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarRail />
      <SidebarContent>
        <SidebarPrimary items={main} />
        <SidebarPrimary items={demo} title="Demo" />
        <SidebarSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
