import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import type { NavigationItem } from "../navigation/navigation";
import { Fragment } from "react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { cn } from "~/lib/utils";

export interface SidebarPageProps {
  showHeader?: boolean;
  breadcrumbs?: NavigationItem[];
  children: React.ReactNode;
  className?: string;
}

export const SidebarPage = ({
  showHeader = false,
  breadcrumbs = [],
  children,
  className,
}: SidebarPageProps) => {
  const list = breadcrumbs.length > 1 ? breadcrumbs.slice(0, -1) : [];
  const last = breadcrumbs[breadcrumbs.length - 1]!;

  return (
    <div>
      {showHeader && (
        <header className="from-background bg-background sticky top-0 z-50 hidden h-12 shrink-0 items-center gap-2 border-b md:flex md:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {list.map((breadcrumb) => (
                  <Fragment key={breadcrumb.href}>
                    <BreadcrumbItem key={breadcrumb.href}>
                      <BreadcrumbLink
                        asChild
                        className="font-mono text-xs uppercase"
                      >
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                ))}

                {!!last && (
                  <Fragment key={last.label}>
                    <BreadcrumbItem key={last.label}>
                      <BreadcrumbPage className="font-mono text-xs uppercase">
                        {last.label}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </Fragment>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      )}

      {children}
    </div>
  );
};

export const SidebarPageContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mx-auto max-w-screen-sm", className)}>{children}</div>
  );
};
