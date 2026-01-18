import Link from "next/link";
import { AppWindow } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { DevelopersHeader } from "./_components/developers.header";

const tools = [
  {
    href: "/developers/preview",
    title: "Miniapp Preview",
    description: "Test and preview miniapps by entering their URL",
    icon: AppWindow,
  },
];

export default function DevelopersPage() {
  return (
    <SidebarPage breadcrumbs={[{ href: "/developers", label: "Developers" }]}>
      <div className="flex h-full flex-col">
        <DevelopersHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Developer Tools</h1>
              <p className="text-muted-foreground">
                Tools for building and testing Farcaster miniapps
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-md p-2">
                          <tool.icon className="text-primary size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {tool.title}
                          </CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarPage>
  );
}
