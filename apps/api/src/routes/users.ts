import { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { isNonEmptyString } from "../lib/mappers";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users", async (_, reply) => {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return { data: users };
  });

  app.post("/users", async (request, reply) => {
    const body = request.body as {
      name?: unknown;
      email?: unknown;
      role?: unknown;
    };

    if (!isNonEmptyString(body?.name) || !isNonEmptyString(body?.email)) {
      return reply.status(400).send({
        message: "name and email are required",
      });
    }

    const role =
      typeof body.role === "string" && Object.values(Role).includes(body.role as Role)
        ? (body.role as Role)
        : Role.USER;

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return reply.status(201).send({ data: user });
  });
}
