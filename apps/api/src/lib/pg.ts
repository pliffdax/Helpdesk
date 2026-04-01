import { Pool } from "pg";
import { env } from "../config/env";

const globalForPool = globalThis as unknown as {
  sqlPool?: Pool;
};

export const sqlPool =
  globalForPool.sqlPool ??
  new Pool({
    connectionString: env.databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.sqlPool = sqlPool;
}
