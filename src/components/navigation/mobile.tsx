"use client";

import { usePathname } from "next/navigation";
import { navigation, type NavigationItem } from "./navigation";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { ConnectButton } from "../wallet/connect-button";
import { Wallet } from "lucide-react";
import { useWindowActions } from "../windows/provider";
import { env } from "~/env.app";
import { filterUnwrap } from "~/lib/map";

const createNavItem = (item: NavigationItem, pathname: string) => {
  const href = item.href ?? "";
  return {
    ...item,
    isActive: href === "/" ? pathname === "/" : pathname.startsWith(href),
  };
};

export const MobileNavigation = () => {
  const pathName = usePathname();
  const { toggleWindowByType } = useWindowActions();

  const items = [
    createNavItem(navigation.home, pathName),
    createNavItem(navigation.search, pathName),
    createNavItem(navigation.explore, pathName),
    createNavItem(navigation.apps, pathName),
    createNavItem(navigation.messages, pathName),
  ].filter(filterUnwrap);

  const windowButtons = [
    {
      label: "Wallet",
      icon: Wallet,
      onClick: () => toggleWindowByType({ type: "wallet" }),
    },
  ];

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
                  "flex h-12 w-full flex-col items-center justify-center transition-all duration-300",
                  item.isActive && "text-primary",
                )}
              >
                {item.icon && (
                  <item.icon
                    className="size-4"
                    fill="currentColor"
                    fillOpacity={item.isActive ? 0.3 : 0}
                  />
                )}
                {/* <span className="pb-1 text-[0.4rem] font-normal uppercase">
                  {item.label}
                </span> */}
              </Button>
            </Link>
          </Fragment>
        ))}

        {windowButtons.map((button) => (
          <div key={button.label} className="w-full">
            <Button
              variant="ghost"
              className="flex h-12 w-full flex-col items-center justify-center transition-all duration-300"
              onClick={button.onClick}
            >
              <button.icon className="size-4" />
              {/* <span className="pb-1 text-[0.4rem] font-normal uppercase">
                {button.label}
              </span> */}
            </Button>
          </div>
        ))}
      </div>

      <div className="hidden">
        <ConnectButton />
      </div>
    </div>
  );
};
