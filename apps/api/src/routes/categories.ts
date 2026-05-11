import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { deleteCachedByPrefix, getCached, setCached } from "../lib/cache";
import { isNonEmptyString } from "../lib/mappers";

const categoriesCacheKey = "categories:list";

export async function categoryRoutes(app: FastifyInstance) {
  app.get("/categories", async (_request, reply) => {
    const cached = getCached<{
      data: Array<{
        id: number;
        name: string;
        createdAt: Date;
        ticketsCount: number;
      }>;
      meta: { source: "cache" | "database" };
    }>(categoriesCacheKey);

    if (cached) {
      reply.header("x-cache", "HIT");
      return cached;
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
      },
    });

    const response = {
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        ticketsCount: category._count.tickets,
      })),
      meta: {
        source: "database" as const,
      },
    };

    reply.header("x-cache", "MISS");
    setCached(categoriesCacheKey, response);

    return response;
  });

  app.post("/categories", async (request, reply) => {
    const body = request.body as { name?: unknown };

    if (!isNonEmptyString(body?.name)) {
      return reply.status(400).send({ message: "name is required" });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
      },
    });

    deleteCachedByPrefix("categories:");

    return reply.status(201).send({ data: category });
  });
}
