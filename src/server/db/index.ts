import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import type { PgTransaction, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";

import * as schema from "./schema";

import { env } from "~/env.app";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof neon> | undefined;
  transactionSql: ReturnType<typeof postgres> | undefined;
};

const sql = globalForDb.sql ?? neon(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle({ client: sql, schema });
export type DB = typeof db;
export type DBTransaction = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * Creates a postgres-based database connection that supports transactions.
 * Uses cached connection instance - creates it lazily on first use.
 */
export const createTransactionDb = () => {
  if (!globalForDb.transactionSql) {
    globalForDb.transactionSql = postgres(env.DATABASE_URL);
  }
  return drizzlePostgres(globalForDb.transactionSql, { schema });
};

export type TransactionDb = ReturnType<typeof createTransactionDb>;
export type TransactionDbTransaction = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
