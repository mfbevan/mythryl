"use client";

import { usePathname } from "next/navigation";
import {
  createProfileLink,
  navigation,
  type NavigationItem,
} from "./navigation";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { ConnectButton } from "../wallet/connect-button";
import { PanelLeftIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { env } from "~/env.app";
import { filterUnwrap } from "~/lib/map";

const createNavItem = (item: NavigationItem, pathname: string) => {
  return {
    ...item,
    isActive: pathname.startsWith(item.href ?? ""),
  };
};

export const MobileNavigation = () => {
  const pathName = usePathname();
  const { toggleSidebar } = useSidebar();

  const items = [
    createNavItem(navigation.home, pathName),
    createNavItem(navigation.apps, pathName),
  ].filter(filterUnwrap);

  if (!env.NEXT_PUBLIC_APP_ENABLED) return null;

  return (
    <div className="bg-background z-50 flex w-full items-center justify-between md:hidden">
      <div className="flex w-full items-center justify-around">
        {items.map((item) => (
          <Fragment key={item.label}>
            <Link href={item.href ?? "#"} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  "flex h-16 w-full flex-col items-center justify-center pt-3 transition-all duration-300",
                  item.isActive && "text-primary",
                )}
              >
                {item.icon && <item.icon />}
                <span className="pb-1 text-[0.4rem] font-normal uppercase">
                  {item.label}
                </span>
              </Button>
            </Link>
          </Fragment>
        ))}

        <div key="menu" className="w-full">
          <Button
            variant="ghost"
            className={cn(
              "flex h-16 w-full flex-col items-center justify-center pt-3 transition-all duration-300",
            )}
            onClick={toggleSidebar}
          >
            <PanelLeftIcon />
            <span className="pb-1 text-[0.4rem] font-normal uppercase">
              Menu
            </span>
          </Button>
        </div>
      </div>

      <div className="hidden">
        <ConnectButton />
      </div>
    </div>
  );
};
