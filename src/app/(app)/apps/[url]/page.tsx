import { Suspense } from "react";

import { AppDetailContent } from "./_components/app-detail.content";
import { AppDetailSkeleton } from "./_components/app-detail.skeleton";
import { SidebarPageHeader } from "~/components/sidebar/sidebar.page-header";
import {
  SidebarPage,
  SidebarPageContent,
} from "~/components/sidebar/sidebar.page";

type Props = {
  params: Promise<{ url: string }>;
};

export default async function AppDetailPage({ params }: Props) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);

  return (
    <SidebarPage>
      <SidebarPageHeader />
      <SidebarPageContent>
        <Suspense fallback={<AppDetailSkeleton />}>
          <AppDetailContent url={decodedUrl} />
        </Suspense>
      </SidebarPageContent>
    </SidebarPage>
  );
}
