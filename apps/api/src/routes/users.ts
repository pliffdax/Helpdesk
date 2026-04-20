import { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  isEmail,
  isNonEmptyString,
  isRole,
  isStrongPassword,
} from "../lib/mappers";
import { hashPassword } from "../lib/auth";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export async function userRoutes(app: FastifyInstance) {
  app.get("/users", async (_, reply) => {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: userSelect,
    });

    return { data: users };
  });

  app.post("/users", async (request, reply) => {
    const body = request.body as {
      name?: unknown;
      email?: unknown;
      role?: unknown;
      password?: unknown;
      passwordConfirmation?: unknown;
    };

    if (!isNonEmptyString(body?.name)) {
      return reply.status(400).send({
        message: "name is required",
      });
    }

    if (!isEmail(body?.email)) {
      return reply.status(400).send({
        message: "valid email is required",
      });
    }

    if (!isStrongPassword(body?.password)) {
      return reply.status(400).send({
        message: "password must be at least 8 characters",
      });
    }

    if (body.password !== body.passwordConfirmation) {
      return reply.status(400).send({
        message: "password confirmation does not match",
      });
    }

    const role = isRole(body.role) ? body.role : Role.USER;

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        passwordHash: await hashPassword(body.password),
        role,
      },
      select: userSelect,
    });

    return reply.status(201).send({ data: user });
  });
}
