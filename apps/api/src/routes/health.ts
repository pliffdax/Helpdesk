import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "helpdesk-api",
      timestamp: new Date().toISOString(),
    };
  });
}
