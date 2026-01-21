import { and, desc, eq, ilike, sql } from "drizzle-orm";
import z from "zod";

import { miniapps, userMiniapps } from "~/server/db/schema";
import {
  paginatedRequestSchema,
  paginatedResponse,
} from "../../schema/pagination.validator";
import { publicProcedure } from "../../trpc";

export const listApps = publicProcedure
  .input(
    paginatedRequestSchema.extend({
      search: z.string().optional(),
      category: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const cursor = input.cursor ?? 0;
    const userId = ctx.session?.user?.id;

    const conditions = [];
    if (input.search) {
      conditions.push(
        ilike(miniapps.searchText, `%${input.search.toLowerCase()}%`),
      );
    }
    if (input.category) {
      conditions.push(eq(miniapps.category, input.category));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [raw, total] = await Promise.all([
      ctx.db
        .select({
          miniapp: miniapps,
          userMiniapp: userMiniapps,
        })
        .from(miniapps)
        .where(where)
        .orderBy(desc(miniapps.createdAt))
        .limit(limit + 1)
        .offset(cursor)
        .leftJoin(
          userMiniapps,
          and(
            eq(userMiniapps.miniappUrl, miniapps.url),
            userId ? eq(userMiniapps.userId, userId) : sql`false`,
          ),
        ),
      ctx.db.$count(miniapps, where),
    ]);

    return paginatedResponse(raw, { limit, cursor, total });
  });
