import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import {
  isEmail,
  isNonEmptyString,
  isStrongPassword,
} from "../lib/mappers";
import {
  clearRefreshTokenCookie,
  createAccessToken,
  createRefreshToken,
  getRefreshToken,
  hashRefreshToken,
  hashPassword,
  requireAuth,
  setRefreshTokenCookie,
  verifyPassword,
} from "../lib/auth";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

async function getCurrentAuthUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
}

async function issueRefreshSession(userId: number) {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlSeconds * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt,
    },
  });

  return refreshToken;
}

async function rotateRefreshSession(refreshToken: string) {
  const now = new Date();
  const session = await prisma.authSession.findUnique({
    where: {
      refreshTokenHash: hashRefreshToken(refreshToken),
    },
    include: {
      user: {
        select: userSelect,
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= now) {
    return null;
  }

  const nextRefreshToken = createRefreshToken();
  const nextExpiresAt = new Date(Date.now() + env.refreshTokenTtlSeconds * 1000);

  await prisma.$transaction([
    prisma.authSession.update({
      where: { id: session.id },
      data: { revokedAt: now },
    }),
    prisma.authSession.create({
      data: {
        userId: session.userId,
        refreshTokenHash: hashRefreshToken(nextRefreshToken),
        expiresAt: nextExpiresAt,
      },
    }),
  ]);

  return {
    refreshToken: nextRefreshToken,
    user: session.user,
  };
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const body = request.body as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
      passwordConfirmation?: unknown;
    };

    if (!isNonEmptyString(body?.name)) {
      return reply.status(400).send({ message: "name is required" });
    }

    if (!isEmail(body?.email)) {
      return reply.status(400).send({ message: "valid email is required" });
    }

    if (!isStrongPassword(body?.password)) {
      return reply.status(400).send({ message: "password must be at least 8 characters" });
    }

    if (body.password !== body.passwordConfirmation) {
      return reply.status(400).send({ message: "password confirmation does not match" });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        passwordHash: await hashPassword(body.password),
      },
      select: userSelect,
    });
    const refreshToken = await issueRefreshSession(user.id);
    setRefreshTokenCookie(reply, refreshToken);

    return reply.status(201).send({
      data: {
        accessToken: createAccessToken(user),
        user,
      },
    });
  });

  app.post("/auth/login", async (request, reply) => {
    const body = request.body as {
      email?: unknown;
      password?: unknown;
    };

    if (!isEmail(body?.email) || !isNonEmptyString(body?.password)) {
      return reply.status(400).send({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return reply.status(401).send({ message: "invalid email or password" });
    }
    const refreshToken = await issueRefreshSession(user.id);
    setRefreshTokenCookie(reply, refreshToken);

    return {
      data: {
        accessToken: createAccessToken(user),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    };
  });

  app.post("/auth/refresh", async (request, reply) => {
    const refreshToken = getRefreshToken(request);

    if (!refreshToken) {
      clearRefreshTokenCookie(reply);
      return reply.status(401).send({ message: "refresh token is required" });
    }

    const rotated = await rotateRefreshSession(refreshToken);

    if (!rotated) {
      clearRefreshTokenCookie(reply);
      return reply.status(401).send({ message: "invalid or expired refresh token" });
    }

    setRefreshTokenCookie(reply, rotated.refreshToken);

    return {
      data: {
        accessToken: createAccessToken(rotated.user),
        user: rotated.user,
      },
    };
  });

  app.get("/auth/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getCurrentAuthUser(request.authUser!.id);

    if (!user) {
      return reply.status(401).send({ message: "invalid or expired token" });
    }

    return { data: user };
  });

  app.patch("/auth/profile", { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      name?: unknown;
      email?: unknown;
    };

    const updateData: {
      name?: string;
      email?: string;
    } = {};

    if (body.name !== undefined) {
      if (!isNonEmptyString(body.name)) {
        return reply.status(400).send({ message: "name must not be empty" });
      }

      updateData.name = body.name.trim();
    }

    if (body.email !== undefined) {
      if (!isEmail(body.email)) {
        return reply.status(400).send({ message: "valid email is required" });
      }

      updateData.email = body.email.trim().toLowerCase();
    }

    if (!Object.keys(updateData).length) {
      return reply.status(400).send({ message: "no valid profile fields provided" });
    }

    const existingUser = await getCurrentAuthUser(request.authUser!.id);

    if (!existingUser) {
      return reply.status(401).send({ message: "invalid or expired token" });
    }

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: updateData,
      select: userSelect,
    });

    return {
      data: {
        accessToken: createAccessToken(user),
        user,
      },
    };
  });

  app.post("/auth/change-password", { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      currentPassword?: unknown;
      newPassword?: unknown;
      newPasswordConfirmation?: unknown;
    };

    if (!isNonEmptyString(body?.currentPassword)) {
      return reply.status(400).send({ message: "current password is required" });
    }

    if (!isStrongPassword(body?.newPassword)) {
      return reply.status(400).send({ message: "new password must be at least 8 characters" });
    }

    if (body.newPassword !== body.newPasswordConfirmation) {
      return reply.status(400).send({ message: "new password confirmation does not match" });
    }

    const user = await prisma.user.findUnique({
      where: { id: request.authUser!.id },
    });

    if (!user) {
      return reply.status(401).send({ message: "invalid or expired token" });
    }

    if (!(await verifyPassword(body.currentPassword, user.passwordHash))) {
      return reply.status(401).send({ message: "current password is incorrect" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(body.newPassword),
      },
    });

    return reply.status(204).send();
  });

  app.post("/auth/logout", async (request, reply) => {
    const refreshToken = getRefreshToken(request);

    if (refreshToken) {
      await prisma.authSession.updateMany({
        where: {
          refreshTokenHash: hashRefreshToken(refreshToken),
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    clearRefreshTokenCookie(reply);
    return reply.status(204).send();
  });
}
