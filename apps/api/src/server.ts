import { buildApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { sqlPool } from "./lib/pg";

async function bootstrap() {
  const app = buildApp();

  try {
    await prisma.$connect();
    await sqlPool.query("SELECT 1");

    await app.listen({
      host: env.host,
      port: env.port,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  const shutdown = async () => {
    await app.close();
    await prisma.$disconnect();
    await sqlPool.end();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void bootstrap();
