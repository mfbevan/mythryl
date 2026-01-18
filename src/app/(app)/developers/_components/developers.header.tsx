"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppWindow, Code2, LayoutDashboard } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const developerTools = [
  {
    href: "/developers",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/developers/preview",
    label: "Preview",
    icon: AppWindow,
  },
];

export const DevelopersHeader = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center gap-4 border-b p-3">
      <nav className="flex items-center gap-2">
        {developerTools.map((tool) => {
          const isActive = pathname === tool.href;
          return (
            <Button
              key={tool.href}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={tool.href} className={cn("flex items-center gap-2")}>
                <tool.icon className="size-4" />
                {tool.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </header>
  );
};
