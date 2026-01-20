"use client";

import { api } from "~/trpc/react";
import { useRequireOnboarding } from "~/components/onboarding/use-require-onboarding";
import type { FeedType, Cast } from "~/server/api/routers/feed/feed.schema";

interface UseCastInteractionsOptions {
  feedType?: FeedType;
}

export const useCastInteractions = ({ feedType }: UseCastInteractionsOptions = {}) => {
  const utils = api.useUtils();
  const { requireOnboarding } = useRequireOnboarding("Complete setup to interact with casts");

  const likeMutation = api.feed.like.useMutation({
    onMutate: async ({ castHash }) => {
      // Cancel any outgoing refetches
      await utils.feed.getFeed.cancel();
      await utils.feed.getCast.cancel();
      await utils.feed.getCastConversation.cancel();

      // Snapshot previous value
      const previousFeedData = feedType
        ? utils.feed.getFeed.getInfiniteData({ feedType, limit: 25 })
        : undefined;

      // Optimistically update feed
      if (feedType) {
        utils.feed.getFeed.setInfiniteData({ feedType, limit: 25 }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              casts: page.casts.map((cast: Cast) =>
                cast.hash === castHash
                  ? {
                      ...cast,
                      viewer_context: { ...cast.viewer_context, liked: true, recasted: cast.viewer_context?.recasted ?? false },
                      reactions: {
                        ...cast.reactions,
                        likes_count: cast.reactions.likes_count + 1,
                      },
                    }
                  : cast
              ),
            })),
          };
        });
      }

      return { previousFeedData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFeedData && feedType) {
        utils.feed.getFeed.setInfiniteData(
          { feedType, limit: 25 },
          context.previousFeedData
        );
      }
    },
  });

  const unlikeMutation = api.feed.unlike.useMutation({
    onMutate: async ({ castHash }) => {
      await utils.feed.getFeed.cancel();
      await utils.feed.getCast.cancel();
      await utils.feed.getCastConversation.cancel();

      const previousFeedData = feedType
        ? utils.feed.getFeed.getInfiniteData({ feedType, limit: 25 })
        : undefined;

      if (feedType) {
        utils.feed.getFeed.setInfiniteData({ feedType, limit: 25 }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              casts: page.casts.map((cast: Cast) =>
                cast.hash === castHash
                  ? {
                      ...cast,
                      viewer_context: { ...cast.viewer_context, liked: false, recasted: cast.viewer_context?.recasted ?? false },
                      reactions: {
                        ...cast.reactions,
                        likes_count: Math.max(0, cast.reactions.likes_count - 1),
                      },
                    }
                  : cast
              ),
            })),
          };
        });
      }

      return { previousFeedData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeedData && feedType) {
        utils.feed.getFeed.setInfiniteData(
          { feedType, limit: 25 },
          context.previousFeedData
        );
      }
    },
  });

  const recastMutation = api.feed.recast.useMutation({
    onMutate: async ({ castHash }) => {
      await utils.feed.getFeed.cancel();
      await utils.feed.getCast.cancel();
      await utils.feed.getCastConversation.cancel();

      const previousFeedData = feedType
        ? utils.feed.getFeed.getInfiniteData({ feedType, limit: 25 })
        : undefined;

      if (feedType) {
        utils.feed.getFeed.setInfiniteData({ feedType, limit: 25 }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              casts: page.casts.map((cast: Cast) =>
                cast.hash === castHash
                  ? {
                      ...cast,
                      viewer_context: { ...cast.viewer_context, recasted: true, liked: cast.viewer_context?.liked ?? false },
                      reactions: {
                        ...cast.reactions,
                        recasts_count: cast.reactions.recasts_count + 1,
                      },
                    }
                  : cast
              ),
            })),
          };
        });
      }

      return { previousFeedData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeedData && feedType) {
        utils.feed.getFeed.setInfiniteData(
          { feedType, limit: 25 },
          context.previousFeedData
        );
      }
    },
  });

  const unrecastMutation = api.feed.unrecast.useMutation({
    onMutate: async ({ castHash }) => {
      await utils.feed.getFeed.cancel();
      await utils.feed.getCast.cancel();
      await utils.feed.getCastConversation.cancel();

      const previousFeedData = feedType
        ? utils.feed.getFeed.getInfiniteData({ feedType, limit: 25 })
        : undefined;

      if (feedType) {
        utils.feed.getFeed.setInfiniteData({ feedType, limit: 25 }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              casts: page.casts.map((cast: Cast) =>
                cast.hash === castHash
                  ? {
                      ...cast,
                      viewer_context: { ...cast.viewer_context, recasted: false, liked: cast.viewer_context?.liked ?? false },
                      reactions: {
                        ...cast.reactions,
                        recasts_count: Math.max(0, cast.reactions.recasts_count - 1),
                      },
                    }
                  : cast
              ),
            })),
          };
        });
      }

      return { previousFeedData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeedData && feedType) {
        utils.feed.getFeed.setInfiniteData(
          { feedType, limit: 25 },
          context.previousFeedData
        );
      }
    },
  });

  const handleLike = (hash: string, isLiked: boolean) => {
    if (requireOnboarding()) return;
    if (isLiked) {
      unlikeMutation.mutate({ castHash: hash });
    } else {
      likeMutation.mutate({ castHash: hash });
    }
  };

  const handleRecast = (hash: string, isRecasted: boolean) => {
    if (requireOnboarding()) return;
    if (isRecasted) {
      unrecastMutation.mutate({ castHash: hash });
    } else {
      recastMutation.mutate({ castHash: hash });
    }
  };

  return {
    handleLike,
    handleRecast,
    isLiking: likeMutation.isPending || unlikeMutation.isPending,
    isRecasting: recastMutation.isPending || unrecastMutation.isPending,
  };
}
