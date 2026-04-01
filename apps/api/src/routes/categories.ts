import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { isNonEmptyString } from "../lib/mappers";

export async function categoryRoutes(app: FastifyInstance) {
  app.get("/categories", async () => {
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

    return {
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        ticketsCount: category._count.tickets,
      })),
    };
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

    return reply.status(201).send({ data: category });
  });
}
