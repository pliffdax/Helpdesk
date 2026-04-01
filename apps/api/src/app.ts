import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";
import { healthRoutes } from "./routes/health";
import { userRoutes } from "./routes/users";
import { categoryRoutes } from "./routes/categories";
import { ticketRoutes } from "./routes/tickets";
import { Prisma } from "@prisma/client";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: env.corsOrigin,
  });

  app.register(healthRoutes);

  app.register(async (api) => {
    api.register(userRoutes);
    api.register(categoryRoutes);
    api.register(ticketRoutes);
  }, { prefix: "/api" });

  app.setErrorHandler((error, _request, reply) => {
    requestLog(app, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(409).send({ message: "record already exists" });
      }

      if (error.code === "P2003") {
        return reply.status(400).send({ message: "related record does not exist" });
      }

      if (error.code === "P2025") {
        return reply.status(404).send({ message: "record not found" });
      }
    }

    return reply.status(500).send({
      message: "internal server error",
    });
  });

  return app;
}

function requestLog(app: ReturnType<typeof Fastify>, error: Error) {
  app.log.error(error);
}
