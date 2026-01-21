"use client";

import { Button } from "../ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import type { NavigationItem } from "../navigation/navigation";
import { useCurrentUser } from "../user/user.hooks";
import { UserAvatar } from "../user/user.avatar";
import { useSidebar } from "../ui/sidebar";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  navigation?: NavigationItem;
  children?: React.ReactNode;
  className?: string;
  account?: string;
  centered?: boolean;
}

export const SidebarPageHeader = ({
  navigation,
  centered = true,
  children,
}: PageHeaderProps) => {
  const [user] = useCurrentUser();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  return (
    <div className="bg-background sticky top-0 z-10 shrink-0 border-b">
      <div
        className={cn(
          "pt-2 pr-2 pb-2 pl-4",
          centered && "mx-auto w-full max-w-screen-sm",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {navigation?.icon ? (
              <navigation.icon className="size-4" />
            ) : (
              <Button size="icon" variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="size-4" />
              </Button>
            )}
            <h2 className="text-sm font-semibold">{navigation?.label}</h2>
          </div>

          <div className="flex items-center">
            <Button size="icon" variant="ghost">
              <Bell className="size-4" />
            </Button>
            {user && (
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleSidebar}
                className="rounded-full"
              >
                <UserAvatar user={user} className="rounded-full" />
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
