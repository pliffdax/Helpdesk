import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { deleteCachedByPrefix, getCached, setCached } from "../lib/cache";
import {
  isNonEmptyString,
  isPriority,
  isStatus,
  mapTicket,
} from "../lib/mappers";

type TicketsListResponse = {
  data: ReturnType<typeof mapTicket>[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    source: "cache" | "database";
  };
};

export async function ticketRoutes(app: FastifyInstance) {
  app.get("/tickets", async (request, reply) => {
    const query = request.query as {
      search?: string;
      status?: string;
      priority?: string;
      page?: string;
      limit?: string;
    };
    const page = parsePositiveInteger(query.page, 1);
    const limit = Math.min(parsePositiveInteger(query.limit, 10), 50);
    const where = {
      status: isStatus(query.status) ? query.status : undefined,
      priority: isPriority(query.priority) ? query.priority : undefined,
      OR: isNonEmptyString(query.search)
        ? [
            {
              title: {
                contains: query.search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query.search.trim(),
                mode: "insensitive" as const,
              },
            },
          ]
        : undefined,
    };
    const cacheKey = `tickets:list:${JSON.stringify({
      search: isNonEmptyString(query.search) ? query.search.trim() : "",
      status: isStatus(query.status) ? query.status : "",
      priority: isPriority(query.priority) ? query.priority : "",
      page,
      limit,
    })}`;
    const cached = getCached<TicketsListResponse>(cacheKey);

    if (cached) {
      reply.header("x-cache", "HIT");
      return cached;
    }

    const [tickets, total] = await prisma.$transaction([
      prisma.ticket.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    const response: TicketsListResponse = {
      data: tickets.map(mapTicket),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        source: "database",
      },
    };

    reply.header("x-cache", "MISS");
    setCached(cacheKey, response);

    return response;
  });

  app.get("/tickets/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return reply.status(400).send({ message: "invalid ticket id" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!ticket) {
      return reply.status(404).send({ message: "ticket not found" });
    }

    return { data: mapTicket(ticket) };
  });

  app.post("/tickets", async (request, reply) => {
    const body = request.body as {
      title?: unknown;
      description?: unknown;
      status?: unknown;
      priority?: unknown;
      creatorId?: unknown;
      categoryId?: unknown;
    };

    if (!isNonEmptyString(body?.title) || !isNonEmptyString(body?.description)) {
      return reply.status(400).send({
        message: "title and description are required",
      });
    }

    const creatorId = Number(body.creatorId);
    const categoryId = Number(body.categoryId);

    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      return reply.status(400).send({ message: "creatorId must be a positive integer" });
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return reply.status(400).send({ message: "categoryId must be a positive integer" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        status: isStatus(body.status) ? body.status : "OPEN",
        priority: isPriority(body.priority) ? body.priority : "MEDIUM",
        creatorId,
        categoryId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    deleteCachedByPrefix("tickets:");

    return reply.status(201).send({ data: mapTicket(ticket) });
  });

  app.patch("/tickets/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as {
      title?: unknown;
      description?: unknown;
      status?: unknown;
      priority?: unknown;
      categoryId?: unknown;
    };
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return reply.status(400).send({ message: "invalid ticket id" });
    }

    const updateData: {
      title?: string;
      description?: string;
      status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
      priority?: "LOW" | "MEDIUM" | "HIGH";
      categoryId?: number;
    } = {};

    if (isNonEmptyString(body.title)) {
      updateData.title = body.title.trim();
    }

    if (isNonEmptyString(body.description)) {
      updateData.description = body.description.trim();
    }

    if (isStatus(body.status)) {
      updateData.status = body.status;
    }

    if (isPriority(body.priority)) {
      updateData.priority = body.priority;
    }

    if (body.categoryId !== undefined) {
      const categoryId = Number(body.categoryId);
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return reply.status(400).send({ message: "categoryId must be a positive integer" });
      }
      updateData.categoryId = categoryId;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    deleteCachedByPrefix("tickets:");

    return { data: mapTicket(ticket) };
  });

  app.delete("/tickets/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return reply.status(400).send({ message: "invalid ticket id" });
    }

    await prisma.ticket.delete({ where: { id } });

    deleteCachedByPrefix("tickets:");

    return reply.status(204).send();
  });
}

function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}
