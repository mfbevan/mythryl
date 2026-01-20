import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { neynar } from "~/services/neynar.service";
import { getCastInputSchema, type Cast } from "./feed.schema";

export const getCast = protectedProcedure
  .input(getCastInputSchema)
  .query(async ({ ctx, input }): Promise<Cast> => {
    const { hash } = input;

    const fid = ctx.user?.fid;
    if (!fid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have a Farcaster account linked",
      });
    }

    try {
      const response = await neynar.lookupCastByHashOrUrl({
        identifier: hash,
        type: "hash",
        viewerFid: fid,
      });

      const cast = response.cast;

      return {
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
            const embeddedCast = embed.cast as {
              hash: string;
              parent_hash?: string | null;
              parent_url?: string | null;
              author: { fid: number; username: string; display_name?: string | null; pfp_url?: string | null };
              text: string;
              timestamp: string;
              reactions?: { likes_count?: number; recasts_count?: number };
              replies?: { count?: number };
            };
            return {
              cast: {
                hash: embeddedCast.hash,
                parent_hash: embeddedCast.parent_hash ?? null,
                parent_url: embeddedCast.parent_url ?? null,
                author: {
                  fid: embeddedCast.author.fid,
                  username: embeddedCast.author.username,
                  display_name: embeddedCast.author.display_name ?? null,
                  pfp_url: embeddedCast.author.pfp_url ?? null,
                },
                text: embeddedCast.text,
                timestamp: embeddedCast.timestamp,
                embeds: [],
                reactions: {
                  likes_count: embeddedCast.reactions?.likes_count ?? 0,
                  recasts_count: embeddedCast.reactions?.recasts_count ?? 0,
                },
                replies: {
                  count: embeddedCast.replies?.count ?? 0,
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
        mentioned_profiles: cast.mentioned_profiles?.map((profile: { fid: number; username: string; display_name?: string | null; pfp_url?: string | null }) => ({
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
      };
    } catch (error) {
      console.error("[Feed] Error fetching cast:", error);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cast not found",
      });
    }
  });
