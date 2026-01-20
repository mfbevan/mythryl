import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { neynar } from "~/services/neynar.service";
import {
  getFeedInputSchema,
  type Cast,
  type FeedResponse,
} from "./feed.schema";

export const getFeed = protectedProcedure
  .input(getFeedInputSchema)
  .query(async ({ ctx, input }): Promise<FeedResponse> => {
    const { feedType, limit, cursor } = input;

    const fid = ctx.user?.fid;
    if (!fid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have a Farcaster account linked",
      });
    }

    try {
      let response;

      switch (feedType) {
        case "following": {
          response = await neynar.fetchFeed({
            feedType: "following",
            fid,
            limit,
            cursor: cursor ?? undefined,
          });
          break;
        }
        case "for_you": {
          response = await neynar.fetchFeed({
            feedType: "filter",
            filterType: "fids",
            fid,
            fids: [fid],
            limit,
            cursor: cursor ?? undefined,
          });
          break;
        }
        case "trending": {
          response = await neynar.fetchTrendingFeed({
            limit,
            cursor: cursor ?? undefined,
          });
          break;
        }
      }

      const casts: Cast[] = response.casts.map((cast) => ({
        hash: cast.hash,
        parent_hash: cast.parent_hash ?? null,
        parent_url: cast.parent_url ?? null,
        root_parent_url: cast.root_parent_url ?? null,
        parent_author: cast.parent_author
          ? { fid: cast.parent_author.fid ?? null }
          : null,
        author: {
          fid: cast.author.fid,
          username: cast.author.username,
          display_name: cast.author.display_name ?? null,
          pfp_url: cast.author.pfp_url ?? null,
          custody_address: cast.author.custody_address,
          follower_count: cast.author.follower_count,
          following_count: cast.author.following_count,
          verifications: cast.author.verifications,
          verified_addresses: cast.author.verified_addresses,
          power_badge: (cast.author as { power_badge?: boolean }).power_badge,
        },
        text: cast.text,
        timestamp: cast.timestamp,
        embeds: cast.embeds?.map((embed) => {
          if ("url" in embed) {
            return {
              url: embed.url,
              metadata: embed.metadata,
            };
          }
          if ("cast" in embed && embed.cast) {
            return {
              cast: {
                hash: embed.cast.hash,
                parent_hash: embed.cast.parent_hash ?? null,
                parent_url: embed.cast.parent_url ?? null,
                author: {
                  fid: embed.cast.author.fid,
                  username: embed.cast.author.username ?? `fid:${embed.cast.author.fid}`,
                  display_name: embed.cast.author.display_name ?? null,
                  pfp_url: embed.cast.author.pfp_url ?? null,
                },
                text: embed.cast.text,
                timestamp: embed.cast.timestamp,
                embeds: [],
                reactions: {
                  likes_count: (embed.cast as { reactions?: { likes_count?: number } }).reactions?.likes_count ?? 0,
                  recasts_count: (embed.cast as { reactions?: { recasts_count?: number } }).reactions?.recasts_count ?? 0,
                },
                replies: {
                  count: (embed.cast as { replies?: { count?: number } }).replies?.count ?? 0,
                },
              },
            };
          }
          return null;
        }).filter((embed): embed is NonNullable<typeof embed> => embed !== null),
        channel: cast.channel
          ? {
              id: cast.channel.id,
              name: cast.channel.name ?? cast.channel.id,
              image_url: cast.channel.image_url,
            }
          : null,
        reactions: {
          likes_count: cast.reactions?.likes_count ?? 0,
          recasts_count: cast.reactions?.recasts_count ?? 0,
        },
        replies: {
          count: cast.replies?.count ?? 0,
        },
        mentioned_profiles: cast.mentioned_profiles?.map((profile) => ({
          fid: profile.fid,
          username: profile.username,
          display_name: profile.display_name ?? null,
          pfp_url: profile.pfp_url ?? null,
        })),
        viewer_context: cast.viewer_context
          ? {
              liked: cast.viewer_context.liked,
              recasted: cast.viewer_context.recasted,
            }
          : undefined,
      }));

      return {
        casts,
        next: response.next?.cursor ? { cursor: response.next.cursor } : undefined,
      };
    } catch (error) {
      console.error("[Feed] Error fetching feed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch feed",
      });
    }
  });
