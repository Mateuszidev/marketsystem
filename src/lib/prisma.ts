import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi configurada.");
}

const runtimeConnectionString = (() => {
  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");
  url.searchParams.delete("sslcert");
  url.searchParams.delete("sslidentity");
  url.searchParams.delete("sslpassword");
  url.searchParams.delete("sslaccept");
  url.searchParams.delete("sslrootcert");
  return url.toString();
})();

const pool =
  global.pgPool ??
  new Pool({
    connectionString: runtimeConnectionString,
    ssl: connectionString.includes("sslmode=")
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.pgPool = pool;
}
