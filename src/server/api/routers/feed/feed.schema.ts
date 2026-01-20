import { z } from "zod";

// Feed type enum
export const feedTypeSchema = z.enum(["following", "for_you", "trending"]);
export type FeedType = z.infer<typeof feedTypeSchema>;

// Author schema
export const authorSchema = z.object({
  fid: z.number(),
  username: z.string(),
  display_name: z.string().nullable(),
  pfp_url: z.string().nullable(),
  custody_address: z.string().optional(),
  follower_count: z.number().optional(),
  following_count: z.number().optional(),
  verifications: z.array(z.string()).optional(),
  verified_addresses: z
    .object({
      eth_addresses: z.array(z.string()).optional(),
      sol_addresses: z.array(z.string()).optional(),
    })
    .optional(),
  power_badge: z.boolean().optional(),
});
export type Author = z.infer<typeof authorSchema>;

// Channel schema
export const channelSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().nullable().optional(),
  })
  .nullable()
  .optional();
export type Channel = z.infer<typeof channelSchema>;

// Embed URL schema
export const embedUrlSchema = z.object({
  url: z.string(),
  metadata: z
    .object({
      content_type: z.string().optional(),
      content_length: z.number().optional(),
      _status: z.string().optional(),
      image: z
        .object({
          width_px: z.number().optional(),
          height_px: z.number().optional(),
        })
        .optional(),
      video: z
        .object({
          duration_s: z.number().optional(),
          stream: z
            .array(
              z.object({
                codec_name: z.string().optional(),
                width_px: z.number().optional(),
                height_px: z.number().optional(),
              })
            )
            .optional(),
        })
        .optional(),
      html: z
        .object({
          ogTitle: z.string().optional(),
          ogDescription: z.string().optional(),
          ogImage: z
            .array(z.object({ url: z.string() }))
            .optional(),
          favicon: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type EmbedUrl = z.infer<typeof embedUrlSchema>;

// Forward declare cast schema for recursive embed
export const embedCastSchema: z.ZodType<EmbedCast> = z.lazy(() =>
  z.object({
    cast: castSchema.optional(),
  })
);
export type EmbedCast = { cast?: Cast };

// Combined embed schema
export const embedSchema = z.union([
  embedUrlSchema,
  embedCastSchema,
]);
export type Embed = z.infer<typeof embedSchema>;

// Reactions schema
export const reactionsSchema = z.object({
  likes_count: z.number(),
  recasts_count: z.number(),
  likes: z
    .array(
      z.object({
        fid: z.number(),
        fname: z.string().optional(),
      })
    )
    .optional(),
  recasts: z
    .array(
      z.object({
        fid: z.number(),
        fname: z.string().optional(),
      })
    )
    .optional(),
});
export type Reactions = z.infer<typeof reactionsSchema>;

// Replies schema
export const repliesSchema = z.object({
  count: z.number(),
});
export type Replies = z.infer<typeof repliesSchema>;

// Viewer context schema
export const viewerContextSchema = z.object({
  liked: z.boolean(),
  recasted: z.boolean(),
});
export type ViewerContext = z.infer<typeof viewerContextSchema>;

// Cast schema
export const castSchema: z.ZodType<Cast> = z.object({
  hash: z.string(),
  parent_hash: z.string().nullable().optional(),
  parent_url: z.string().nullable().optional(),
  root_parent_url: z.string().nullable().optional(),
  parent_author: z
    .object({
      fid: z.number().nullable(),
    })
    .nullable()
    .optional(),
  author: authorSchema,
  text: z.string(),
  timestamp: z.string(),
  embeds: z.array(embedSchema).optional(),
  channel: channelSchema,
  reactions: reactionsSchema,
  replies: repliesSchema,
  mentioned_profiles: z.array(authorSchema).optional(),
  viewer_context: viewerContextSchema.optional(),
});
export type Cast = {
  hash: string;
  parent_hash?: string | null;
  parent_url?: string | null;
  root_parent_url?: string | null;
  parent_author?: { fid: number | null } | null;
  author: Author;
  text: string;
  timestamp: string;
  embeds?: Embed[];
  channel?: Channel;
  reactions: Reactions;
  replies: Replies;
  mentioned_profiles?: Author[];
  viewer_context?: ViewerContext;
};

// Feed response schema
export const feedResponseSchema = z.object({
  casts: z.array(castSchema),
  next: z
    .object({
      cursor: z.string().nullable(),
    })
    .optional(),
});
export type FeedResponse = z.infer<typeof feedResponseSchema>;

// Conversation response schema
export const conversationResponseSchema = z.object({
  cast: castSchema,
  chronological_parent_casts: z.array(castSchema).optional(),
  direct_replies: z.array(castSchema).optional(),
});
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;

// Input schemas
export const getFeedInputSchema = z.object({
  feedType: feedTypeSchema,
  limit: z.number().min(1).max(100).default(25),
  cursor: z.string().optional(),
});
export type GetFeedInput = z.infer<typeof getFeedInputSchema>;

export const getCastInputSchema = z.object({
  hash: z.string(),
});
export type GetCastInput = z.infer<typeof getCastInputSchema>;

export const getCastConversationInputSchema = z.object({
  hash: z.string(),
  replyDepth: z.number().min(0).max(5).default(2),
  includeChronologicalParentCasts: z.boolean().default(true),
  limit: z.number().min(1).max(50).default(20),
});
export type GetCastConversationInput = z.infer<typeof getCastConversationInputSchema>;

export const castInteractionInputSchema = z.object({
  castHash: z.string(),
});
export type CastInteractionInput = z.infer<typeof castInteractionInputSchema>;
