"use client";

import { use } from "react";
import {
  SidebarPage,
  SidebarPageContent,
} from "~/components/sidebar/sidebar.page";
import { CastCard, CastSkeleton } from "~/components/casts";
import { useCastConversation } from "~/components/feed/feed.hooks";
import { SidebarPageHeader } from "~/components/sidebar/sidebar.page-header";

interface CastDetailPageProps {
  params: Promise<{ hash: string }>;
}

const CastDetailPage = ({ params }: CastDetailPageProps) => {
  const { hash } = use(params);
  const { data, isLoading, isError, error } = useCastConversation(hash);

  return (
    <SidebarPage>
      <SidebarPageHeader />

      <SidebarPageContent>
        {isLoading && (
          <div className="flex flex-col">
            <CastSkeleton />
            <CastSkeleton />
            <CastSkeleton />
          </div>
        )}

        {isError && (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <p>Failed to load cast</p>
            <p className="text-sm">{error?.message}</p>
          </div>
        )}

        {data && (
          <div className="flex flex-col">
            {data.chronological_parent_casts &&
              data.chronological_parent_casts.length > 0 && (
                <div className="flex flex-col">
                  {data.chronological_parent_casts.map((parentCast) => (
                    <CastCard
                      key={parentCast.hash}
                      cast={parentCast}
                      isDetail={false}
                    />
                  ))}
                </div>
              )}

            <CastCard cast={data.cast} isDetail />

            {data.direct_replies && data.direct_replies.length > 0 && (
              <div className="flex flex-col">
                <div className="border-b px-4 py-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    Replies
                  </span>
                </div>
                {data.direct_replies.map((reply) => (
                  <CastCard key={reply.hash} cast={reply} isDetail={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </SidebarPageContent>
    </SidebarPage>
  );
};

export default CastDetailPage;
