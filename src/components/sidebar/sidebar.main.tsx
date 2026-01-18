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
import { SidebarFrame } from "./sidebar.frame";

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

  const main = [
    createNavItem(navigation.home, pathname),
    createNavItem(navigation.apps, pathname),
    createNavItem(navigation.channels, pathname),
    createNavItem(navigation.messages, pathname),
  ];

  const demo = [createNavItem(navigation.windows, pathname)];

  const secondary = [navigation.developers, navigation.settings];

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
                  {/* <CreditsBalance /> */}
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
        <SidebarFrame />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
