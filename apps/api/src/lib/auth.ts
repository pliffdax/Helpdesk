import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac } from "node:crypto";
import { promisify } from "node:util";
import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env";

const scrypt = promisify(scryptCallback);

type TokenPayload = {
  sub: number;
  role: Role;
  email: string;
  name: string;
  exp: number;
  type: "access";
};

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64");
}

function signTokenParts(header: string, payload: string) {
  return createHmac("sha256", env.authTokenSecret)
    .update(`${header}.${payload}`)
    .digest("base64url");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash?: string | null) {
  if (!passwordHash) {
    return false;
  }

  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}

export function createAccessToken(user: {
  id: number;
  role: Role;
  email: string;
  name: string;
}) {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + env.authTokenTtlSeconds,
      type: "access",
    } satisfies TokenPayload),
  );

  const signature = signTokenParts(header, payload);

  return `${header}.${payload}.${signature}`;
}

export function verifyAccessToken(token: string): TokenPayload | null {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = signTokenParts(header, payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload).toString("utf8")) as Partial<TokenPayload>;

    if (
      typeof parsed.sub !== "number" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.exp !== "number" ||
      parsed.type !== "access" ||
      !Object.values(Role).includes(parsed.role as Role)
    ) {
      return null;
    }

    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed as TokenPayload;
  } catch {
    return null;
  }
}

function getBearerToken(request: FastifyRequest) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = getBearerToken(request);

  if (!token) {
    return reply.status(401).send({ message: "authentication required" });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return reply.status(401).send({ message: "invalid or expired token" });
  }

  request.authUser = {
    id: payload.sub,
    role: payload.role,
    email: payload.email,
    name: payload.name,
  };
}

export function requireRole(roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authResult = await requireAuth(request, reply);

    if (authResult) {
      return authResult;
    }

    if (!request.authUser || !roles.includes(request.authUser.role)) {
      return reply.status(403).send({ message: "forbidden" });
    }
  };
}
