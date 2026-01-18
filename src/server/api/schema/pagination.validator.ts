import { z } from "zod";

export const paginatedRequestSchema = z.object({
  limit: z.number().nullish(),
  cursor: z.number().nullish(),
});
export type PaginatedRequest = z.infer<typeof paginatedRequestSchema>;

export const paginatedRequestSchemaString = z.object({
  limit: z.number().nullish(),
  cursor: z.string().nullish(),
});
export type PaginatedRequestString = z.infer<
  typeof paginatedRequestSchemaString
>;

export const paginatedResponse = <T>(
  data: T[] = [],
  { limit, cursor, total }: { limit: number; cursor: number; total: number },
) => {
  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;

  return {
    data: items,
    hasNextPage,
    nextCursor: hasNextPage ? cursor + limit : undefined,
    total,
  };
};

export const extractTotal = (count: { count: number }[]) => {
  return count[0]?.count ?? 0;
};
