"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { disableLink, type NavigationItem } from "../navigation/navigation";
import { cn } from "~/lib/utils";

export const SidebarPrimary = ({
  title,
  items,
}: {
  title?: string;
  items: (NavigationItem & {
    isActive?: boolean;
    items?: NavigationItem[];
  })[];
}) => {
  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.label} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild={item.isAvailable}
                tooltip={item.label}
                disabled={!item.isAvailable}
                className={cn(
                  !item.isAvailable && "cursor-not-allowed opacity-25",
                  item.isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                {item.isAvailable ? (
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </>
                )}
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.href}
                              onClick={disableLink(!subItem.isAvailable)}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
