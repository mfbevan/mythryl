"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { CastCard, CastSkeleton } from "~/components/casts";
import { useCastConversation } from "~/components/feed/feed.hooks";

interface CastDetailPageProps {
  params: Promise<{ hash: string }>;
}

const CastDetailPage = ({ params }: CastDetailPageProps) => {
  const { hash } = use(params);
  const router = useRouter();
  const { data, isLoading, isError, error } = useCastConversation(hash);

  return (
    <SidebarPage showHeader={false}>
      <div className="mx-auto w-full max-w-2xl">
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="size-8"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="font-semibold">Cast</span>
        </div>

        {isLoading && (
          <div className="flex flex-col">
            <CastSkeleton />
            <CastSkeleton />
            <CastSkeleton />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
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
                  <span className="text-sm font-medium text-muted-foreground">
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
      </div>
    </SidebarPage>
  );
};

export default CastDetailPage;
