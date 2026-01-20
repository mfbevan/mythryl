import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { neynar } from "~/services/neynar.service";
import {
  getCastConversationInputSchema,
  type Cast,
  type ConversationResponse,
} from "./feed.schema";

// Helper to map API cast to our Cast type
function mapCast(cast: {
  hash: string;
  parent_hash?: string | null;
  parent_url?: string | null;
  root_parent_url?: string | null;
  parent_author?: { fid?: number | null } | null;
  author: {
    fid: number;
    username: string;
    display_name?: string | null;
    pfp_url?: string | null;
    custody_address?: string;
    follower_count?: number;
    following_count?: number;
    verifications?: string[];
    verified_addresses?: {
      eth_addresses?: string[];
      sol_addresses?: string[];
    };
    power_badge?: boolean;
  };
  text: string;
  timestamp: string;
  embeds?: Array<
    | { url: string; metadata?: Record<string, unknown> }
    | { cast?: { hash: string; parent_hash?: string | null; parent_url?: string | null; author: { fid: number; username: string; display_name?: string | null; pfp_url?: string | null }; text: string; timestamp: string; reactions?: { likes_count?: number; recasts_count?: number }; replies?: { count?: number } } }
  >;
  channel?: { id: string; name: string; image_url?: string | null } | null;
  reactions?: { likes_count?: number; recasts_count?: number };
  replies?: { count?: number };
  mentioned_profiles?: Array<{
    fid: number;
    username: string;
    display_name?: string | null;
    pfp_url?: string | null;
  }>;
  viewer_context?: { liked: boolean; recasted: boolean };
}): Cast {
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
      power_badge: cast.author.power_badge,
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
              username: embed.cast.author.username,
              display_name: embed.cast.author.display_name ?? null,
              pfp_url: embed.cast.author.pfp_url ?? null,
            },
            text: embed.cast.text,
            timestamp: embed.cast.timestamp,
            embeds: [],
            reactions: {
              likes_count: embed.cast.reactions?.likes_count ?? 0,
              recasts_count: embed.cast.reactions?.recasts_count ?? 0,
            },
            replies: {
              count: embed.cast.replies?.count ?? 0,
            },
          },
        };
      }
      return null;
    }).filter((embed): embed is NonNullable<typeof embed> => embed !== null),
    channel: cast.channel
      ? {
          id: cast.channel.id,
          name: cast.channel.name,
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
  };
}

export const getCastConversation = protectedProcedure
  .input(getCastConversationInputSchema)
  .query(async ({ ctx, input }): Promise<ConversationResponse> => {
    const { hash, replyDepth, includeChronologicalParentCasts, limit } = input;

    const fid = ctx.user?.fid;
    if (!fid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have a Farcaster account linked",
      });
    }

    try {
      const response = await neynar.lookupCastConversation({
        identifier: hash,
        type: "hash",
        replyDepth,
        includeChronologicalParentCasts,
        viewerFid: fid,
        limit,
      });

      const conversation = response.conversation;
      const mainCast = mapCast(conversation.cast as Parameters<typeof mapCast>[0]);

      // Get chronological parent casts (ancestors)
      const chronologicalParentCasts: Cast[] = [];
      if (includeChronologicalParentCasts && conversation.chronological_parent_casts) {
        for (const parentCast of conversation.chronological_parent_casts) {
          chronologicalParentCasts.push(mapCast(parentCast as Parameters<typeof mapCast>[0]));
        }
      }

      // Get direct replies
      const directReplies: Cast[] = [];
      const castWithReplies = conversation.cast as {
        direct_replies?: Array<Parameters<typeof mapCast>[0]>;
      };
      if (castWithReplies.direct_replies) {
        for (const reply of castWithReplies.direct_replies) {
          directReplies.push(mapCast(reply));
        }
      }

      return {
        cast: mainCast,
        chronological_parent_casts: chronologicalParentCasts,
        direct_replies: directReplies,
      };
    } catch (error) {
      console.error("[Feed] Error fetching cast conversation:", error);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cast conversation not found",
      });
    }
  });
