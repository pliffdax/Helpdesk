import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { Prisma } from "@prisma/client";
import { healthRoutes } from "./routes/health";
import { monitoringRoutes } from "./routes/monitoring";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { categoryRoutes } from "./routes/categories";
import { ticketRoutes } from "./routes/tickets";
import { env } from "./config/env";
import { appLogger, logRequestDuration } from "./lib/logger";

const requestStartTimes = new WeakMap<object, number>();

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: env.corsOrigin,
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflight: true,
    optionsSuccessStatus: 204,
  });

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 5,
    },
  });

  app.addHook("onRequest", async (request) => {
    requestStartTimes.set(request, Date.now());
  });

  app.addHook("onResponse", async (request, reply) => {
    const startedAt = requestStartTimes.get(request) ?? Date.now();
    logRequestDuration({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  app.register(healthRoutes);
  app.register(monitoringRoutes);

  app.register(
    async (api) => {
      api.register(authRoutes);
      api.register(userRoutes);
      api.register(categoryRoutes);
      api.register(ticketRoutes);
    },
    { prefix: "/api" },
  );

  app.setErrorHandler((error, _request, reply) => {
    requestLog(app, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(409).send({ message: "record already exists" });
      }

      if (error.code === "P2003") {
        return reply
          .status(400)
          .send({ message: "related record does not exist" });
      }

      if (error.code === "P2025") {
        return reply.status(404).send({ message: "record not found" });
      }
    }

    if (getErrorCode(error) === "FST_REQ_FILE_TOO_LARGE") {
      return reply.status(413).send({ message: "file is too large" });
    }

    if (getErrorCode(error) === "FST_INVALID_MULTIPART_CONTENT_TYPE") {
      return reply.status(400).send({ message: "multipart/form-data request is required" });
    }

    return reply.status(500).send({
      message: "internal server error",
    });
  });

  return app;
}

function requestLog(app: ReturnType<typeof Fastify>, error: unknown) {
  if (error instanceof Error) {
    app.log.error(error);
    appLogger.error("request failed", {
      message: error.message,
      stack: error.stack,
    });
    return;
  }

  app.log.error({ error }, "Unknown error");
  appLogger.error("unknown request error", { error });
}

function getErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}
